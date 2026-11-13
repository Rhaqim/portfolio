import { el, $, api, stream, watch, fmtUSD, mountFeedback, checkApi, tabs } from "./common.js";

const L = "/api/loom";
let config = null;

// Typical tokens per AI-run round, for the up-front estimate (matches the server).
const EST_IN = 7000, EST_OUT = 1800;

// ===========================================================================
// Model and key. The key is held in this page (or sessionStorage if the
// visitor ticks "keep for this tab") and sent as a header per request.
// ===========================================================================

const keyInput = $("#key");
const modelSelect = $("#model");
const remember = $("#remember");

try {
	const saved = sessionStorage.getItem("loom-key");
	if (saved) { keyInput.value = saved; remember.checked = true; }
} catch {}

function persistKey() {
	try {
		if (remember.checked && keyInput.value) sessionStorage.setItem("loom-key", keyInput.value);
		else sessionStorage.removeItem("loom-key");
	} catch {}
	updateMode();
	$("#verify-result").replaceChildren();
}
keyInput.addEventListener("input", persistKey);
remember.addEventListener("change", persistKey);
modelSelect.addEventListener("change", () => {
	try { sessionStorage.setItem("loom-model", modelSelect.value); } catch {}
	updateMode();
	$("#verify-result").replaceChildren();
});

const headers = () => {
	const key = keyInput.value.trim();
	return key ? { "X-LLM-Key": key, "X-LLM-Model": modelSelect.value } : {};
};
const selectedModel = () => config?.models.find((x) => `${x.provider}/${x.id}` === modelSelect.value);
const priceLabel = (inP, outP) => `$${inP} in / $${outP} out per 1M tokens`;

function updateMode() {
	const chip = $("#mode-chip");
	const m = selectedModel();
	if (keyInput.value.trim()) {
		chip.textContent = m ? m.label : "Live";
		chip.className = "chip chip-red";
	} else {
		chip.textContent = "Dry run";
		chip.className = "chip";
	}
}

$("#verify").addEventListener("click", async () => {
	const host = $("#verify-result");
	if (!keyInput.value.trim()) {
		host.replaceChildren(el("div", { class: "notice" }, "No key: games and pipelines run as dry runs, with real orchestration and canned model output."));
		return;
	}
	host.replaceChildren(el("p", { class: "dim" }, "Checking with the provider…"));
	try {
		const r = await api(`${L}/models/verify`, { method: "POST", headers: headers() });
		host.replaceChildren(el("div", { class: "notice" },
			el("span", { class: "chip chip-ok" }, "✓ key accepted"), " ",
			`${r.display_name || r.label}. `,
			r.priced
				? `${priceLabel(r.input_per_1m, r.output_per_1m)}. An AI-run round costs about ${fmtUSD(r.estimate_round_usd)} (${r.estimate_basis}).`
				: "No published price in the demo's table for this model, so costs will show token counts only."));
	} catch (e) {
		host.replaceChildren(el("div", { class: "notice notice-err" }, e.message));
	}
});

function costLabel(step) {
	if (step.error) return "failed";
	return `${step.input_tokens}→${step.output_tokens} tok · ${step.priced ? fmtUSD(step.usd) : "—"} · ${(step.duration_ms / 1000).toFixed(1)}s`;
}

// ===========================================================================
// Multiplayer tabletop
// ===========================================================================

const room = {
	code: null,
	me: { host: false },
	game: null,
	es: null,
	seen: new Set(),
	live: null, // streaming narration element
	lastSuggestions: null,
	lastCost: null,
};

// ---------- Lobby ----------

function archetypeChoices(host, name, checked = 1) {
	host.replaceChildren(...config.archetypes.map((a, i) =>
		el("label", { class: "choice" }, el("input", { type: "radio", name, value: a.id, checked: i === checked }),
			el("b", {}, a.label), el("small", {}, a.blurb))));
}

function npcRow(n = { name: "", persona: "" }) {
	const row = el("div", { class: "npc-row" },
		el("input", { class: "input", maxLength: 40, placeholder: "Name", value: n.name, "aria-label": "NPC name", dataset: { k: "name" } }),
		el("input", { class: "input", maxLength: 400, placeholder: "Who they are and what they want", value: n.persona, "aria-label": "NPC persona", dataset: { k: "persona" } }),
		el("button", { type: "button", class: "btn btn-sm btn-ghost", "aria-label": "Remove NPC", onclick: () => row.remove() }, "✕"));
	return row;
}

function loadPreset(p) {
	$("#g-world").value = p.world;
	if (!$("#g-title").value) $("#g-title").value = p.label;
	$("#g-npcs").replaceChildren(...p.npcs.map(npcRow));
}

function renderLobby() {
	$("#g-presets").replaceChildren(...config.worlds.map((p) =>
		el("button", { type: "button", class: "btn btn-sm", onclick: () => loadPreset(p) }, p.label)));
	archetypeChoices($("#g-archetypes"), "g-arch", 0);
	archetypeChoices($("#j-archetypes"), "j-arch", 1);
	if (!$("#g-world").value) loadPreset(config.worlds[0]);
	const sync = () => {
		const human = document.querySelector("input[name=g-mode]:checked").value === "human";
		$("#g-character").hidden = human;
		$("#g-bookkeeping-row").hidden = !human;
	};
	document.querySelectorAll("input[name=g-mode]").forEach((r) => r.addEventListener("change", sync));
	sync();
}

$("#g-add-npc").addEventListener("click", () => {
	if ($("#g-npcs").children.length < 4) $("#g-npcs").append(npcRow());
});

$("#create").addEventListener("submit", async (e) => {
	e.preventDefault();
	const mode = document.querySelector("input[name=g-mode]:checked").value;
	const body = {
		title: $("#g-title").value.trim(),
		world: $("#g-world").value.trim(),
		mode,
		bookkeeping: $("#g-bookkeeping").checked,
		npcs: [...$("#g-npcs").children].map((r) => ({
			name: r.querySelector("[data-k=name]").value.trim(),
			persona: r.querySelector("[data-k=persona]").value.trim(),
		})).filter((n) => n.name),
	};
	if (mode === "ai") {
		body.character = { name: $("#g-char-name").value.trim(), archetype: document.querySelector("input[name=g-arch]:checked")?.value };
		if (!body.character.name) return $("#g-char-name").focus();
	}
	const status = $("#g-create-status");
	status.textContent = keyInput.value.trim() ? "Checking your key and setting the table…" : "Setting the table (dry run)…";
	$("#g-create").disabled = true;
	try {
		const r = await api(`${L}/games`, { method: "POST", body, headers: headers() });
		status.textContent = "";
		enterRoom(r.code);
	} catch (err) {
		status.textContent = err.message;
	} finally {
		$("#g-create").disabled = false;
	}
});

$("#join").addEventListener("submit", async (e) => {
	e.preventDefault();
	const code = $("#j-code").value.trim().toUpperCase();
	const status = $("#j-status");
	if (code.length !== 6) { status.textContent = "Codes are six characters."; return; }
	status.textContent = "Joining…";
	try {
		await api(`${L}/games/${code}/join`, { method: "POST", body: {
			name: $("#j-name").value.trim(), archetype: document.querySelector("input[name=j-arch]:checked")?.value,
		} });
		status.textContent = "";
		enterRoom(code);
	} catch (err) {
		// Already at the table (e.g. a returning player)? Just go in.
		if (err.status === 409 && /already at this table|game master of this table/.test(err.message)) { status.textContent = ""; enterRoom(code); }
		else status.textContent = err.message;
	}
});

$("#j-watch").addEventListener("click", () => {
	const code = $("#j-code").value.trim().toUpperCase();
	if (code.length === 6) enterRoom(code);
	else $("#j-status").textContent = "Codes are six characters.";
});

// ---------- Room ----------

async function enterRoom(code) {
	let data;
	try {
		data = await api(`${L}/games/${code}`);
	} catch (e) {
		$("#j-status").textContent = e.message;
		return;
	}
	leaveRoom(false);
	Object.assign(room, { code, me: data.me, game: data.game, seen: new Set(), live: null, lastSuggestions: null, lastCost: null });
	const u = new URL(location.href);
	u.searchParams.set("game", code);
	history.replaceState(null, "", u);

	$("#lobby").hidden = true;
	$("#room").hidden = false;
	$("#feed").replaceChildren();
	$("#live-steps").replaceChildren(el("li", { class: "dim" }, "Agent steps appear here as they finish."));
	renderState(data.game);

	room.es = watch(`${L}/games/${code}/events`, {
		feed: onFeed,
		state: renderState,
		chunk: onChunk,
		step: onStep,
		step_started: onStepStarted,
		busy: (d) => setBusy(d.busy),
		error: () => setRoomError("Reconnecting to the table…"),
		open: () => setRoomError(""),
	});
}

function leaveRoom(showLobby = true) {
	room.es?.close();
	room.es = null;
	if (showLobby) {
		room.code = null;
		const u = new URL(location.href);
		u.searchParams.delete("game");
		history.replaceState(null, "", u);
		$("#room").hidden = true;
		$("#lobby").hidden = false;
	}
}
$("#r-leave").addEventListener("click", () => leaveRoom(true));
$("#r-copy").addEventListener("click", async () => {
	const link = `${location.origin}${location.pathname}?game=${room.code}`;
	try { await navigator.clipboard.writeText(link); $("#r-copy").textContent = "Copied"; }
	catch { prompt("Copy this link", link); }
	setTimeout(() => ($("#r-copy").textContent = "Copy invite link"), 1500);
});

function setRoomError(msg) {
	$("#room-error").replaceChildren(msg ? el("div", { class: "notice notice-err" }, msg) : "");
}

function setBusy(busy) {
	$("#r-busy").hidden = !busy;
	if (room.game) room.game.busy = busy;
	renderControls();
	if (busy) $("#live-steps").replaceChildren();
}

function renderState(g) {
	room.game = g;
	$("#r-title").textContent = g.title;
	$("#r-mode").textContent = g.mode === "ai" ? "AI game master" : "Human game master";
	$("#r-status").textContent = g.status;
	$("#r-status").className = g.status === "playing" ? "chip chip-ok" : g.status === "ended" ? "chip" : "chip chip-warn";
	$("#r-watching").textContent = `${g.watching} watching`;
	$("#r-code").textContent = g.code;
	$("#r-world").textContent = g.world;
	$("#r-round").textContent = `round ${g.round}`;
	$("#r-busy").hidden = !g.busy;

	// The party
	$("#party").replaceChildren(...(g.players.length ? g.players.map((p) => {
		const sh = p.sheet || {};
		const pct = sh.max_hp ? Math.round((sh.hp / sh.max_hp) * 100) : 0;
		return el("li", {},
			el("div", { class: "party-top" }, el("b", {}, p.name), el("span", { class: "dim" }, sh.archetype || p.archetype),
				p.name === room.me.name ? el("span", { class: "chip" }, "you") : null,
				el("span", { class: "spacer" }),
				p.submitted ? el("span", { class: "chip chip-ok" }, "✓ acted") : null,
				sh.condition ? el("span", { class: sh.fallen ? "chip chip-red" : "chip chip-warn" }, sh.condition) : null),
			el("div", { class: "row", style: "justify-content:space-between;font-family:var(--font-mono);font-size:.72rem;margin-top:4px" },
				el("span", {}, `HP ${sh.hp ?? "?"}/${sh.max_hp ?? "?"}`), el("span", {}, `${sh.gold ?? 0} gold`)),
			el("div", { class: "hpbar", role: "meter", "aria-valuemin": 0, "aria-valuemax": sh.max_hp || 1, "aria-valuenow": sh.hp || 0, "aria-label": `${p.name} hit points` },
				el("span", { style: `width:${pct}%` })),
			el("p", { class: "items" }, (sh.items || []).join(", ")));
	}) : [el("li", { class: "dim" }, "No players yet. Share the code.")]));

	// Host's selects
	const names = g.players.map((p) => el("option", {}, p.name));
	$("#dm-check-player").replaceChildren(...names.map((n) => n.cloneNode(true)));
	$("#dm-adj-player").replaceChildren(...names.map((n) => n.cloneNode(true)));
	$("#npc-name").replaceChildren(...(g.npcs || []).map((n) => el("option", {}, n.name)));

	renderCost();
	renderControls();
	markRewinds();
}

function renderControls() {
	const g = room.game;
	if (!g) return;
	const me = room.mePlayer = g.players.find((p) => p.name === room.me.name);
	const playing = g.status === "playing";
	// Composer: players only.
	const composer = $("#composer");
	composer.hidden = !me || g.status === "ended";
	if (me) {
		const fallen = me.sheet?.fallen;
		const waiting = me.submitted;
		$("#action").disabled = $("#act").disabled = !playing || g.busy || fallen || waiting;
		$("#composer-note").textContent = !playing ? "Waiting for the host to start." :
			fallen ? "Your character has fallen. The host can rewind, or a human DM can heal you." :
			waiting ? (g.mode === "ai" ? "Action locked in. The round resolves when everyone has acted." : "Action locked in. Waiting for the game master.") :
			g.busy ? "The agents are working…" : "";
	}
	// Host
	const host = room.me.host;
	$("#host-panel").hidden = !host || g.status === "ended";
	$("#host-label").textContent = g.mode === "human" ? "Game master console" : "Host controls";
	$("#h-start").hidden = g.status !== "lobby";
	$("#h-resolve").hidden = !(g.mode === "ai" && playing);
	$("#h-key").hidden = g.key_loaded;
	$("#dm-console").hidden = !(g.mode === "human" && playing);
	$("#npc-console").hidden = !(playing && (g.npcs || []).length);
	$("#dm-narrate-note").textContent = g.bookkeeping ? "AI referee, chronicler and suggester follow your narration." : "Bookkeeping is off: adjust sheets by hand.";
	document.querySelectorAll("#host-panel button").forEach((b) => { if (b.id !== "h-end") b.disabled = g.busy; });
	if (!g.key_loaded && host) setRoomError("Your API key isn't loaded on the server (it restarted, or the key expired). Enter it above and press Reconnect my key.");
}

function renderCost() {
	const g = room.game;
	const dry = !g.model;
	$("#c-model").textContent = dry ? "dry run" : g.model_label || g.model;
	const priced = g.priced && g.input_per_1m > 0;
	const rounds = g.rounds || [];
	const pricedRounds = rounds.filter((r) => r.priced && r.usd > 0);
	const avg = pricedRounds.length ? pricedRounds.reduce((a, r) => a + r.usd, 0) / pricedRounds.length : 0;
	const est = g.input_per_1m ? (EST_IN * g.input_per_1m + EST_OUT * g.output_per_1m) / 1e6 : 0;
	const maxUSD = Math.max(...rounds.map((r) => r.usd), 0.000001);
	const maxTok = Math.max(...rounds.map((r) => r.input_tokens + r.output_tokens), 1);

	const kids = [
		el("div", {},
			el("p", { class: "eyebrow" }, "This game so far"),
			el("p", { class: "cost-total" }, dry ? "dry run" : priced ? fmtUSD(g.total_usd) : "—"),
			el("p", { class: "dim mono", style: "font-size:.72rem" }, `${g.total_input_tokens.toLocaleString()} in · ${g.total_output_tokens.toLocaleString()} out tokens`)),
		!dry && g.input_per_1m ? el("p", { class: "dim", style: "font-size:.8rem" },
			`${priceLabel(g.input_per_1m, g.output_per_1m)}. `,
			avg ? `Rounds so far average ${fmtUSD(avg)}.` : `Estimated ${fmtUSD(est)} per AI-run round.`) : null,
		rounds.length ? el("div", {},
			el("p", { class: "eyebrow" }, dry || !priced ? "Tokens per round" : "Cost per round"),
			el("div", { class: "bars", role: "img", "aria-label": "Cost per round" },
				rounds.map((r) => el("span", {
					title: `Round ${r.round}: ${r.priced ? fmtUSD(r.usd) + ", " : ""}${r.input_tokens + r.output_tokens} tokens`,
					style: `height:${Math.max(4, Math.round(((priced ? r.usd / maxUSD : (r.input_tokens + r.output_tokens) / maxTok)) * 100))}%`,
				})))) : null,
		room.lastCost ? costTable(room.lastCost) : null,
	];
	$("#cost").replaceChildren(...kids.filter(Boolean));
}

function costTable(c) {
	return el("div", {},
		el("p", { class: "eyebrow" }, `Last: ${c.label}${c.dry_run ? " (dry run)" : ""}`),
		el("table", { class: "cost-table" },
			el("thead", {}, el("tr", {}, el("th", {}, "agent"), el("th", {}, "tokens"), el("th", {}, "cost"))),
			el("tbody", {}, c.steps.map((s) => el("tr", {},
				el("td", {}, s.agent.replace(/^tt-/, "")), el("td", {}, `${s.input_tokens}→${s.output_tokens}`),
				el("td", {}, c.dry_run ? "—" : s.priced ? fmtUSD(s.usd) : "—")))),
			el("tfoot", {}, el("tr", {}, el("td", {}, "turn"), el("td", {}, `${c.input_tokens}→${c.output_tokens}`),
				el("td", {}, c.dry_run ? "dry run" : c.priced ? fmtUSD(c.usd) : "—")))));
}

// ---------- Live events ----------

function onChunk(d) {
	if (!room.live) {
		room.live = el("li", { class: "entry entry-narration", dataset: { round: (room.game?.round ?? 0) + 1 } },
			el("div", { class: "entry-hd" }, el("b", {}, "Game master"), el("span", { class: "pulse" })),
			el("div", { class: "entry-text" }));
		$("#feed").append(room.live);
	}
	room.live.querySelector(".entry-text").textContent += d.text;
	scrollFeed();
}

function roleLabel(agent, role) {
	if (agent === "tt-human-dm") return "lead · written by the GM";
	if (role === "lead") return "lead · streams";
	if (role === "rules") return "before the turn";
	if (role === "npc") return "npc";
	return "follower · parallel";
}

// loom's step.started: show the agent as running until its step.done arrives.
function onStepStarted(d) {
	const list = $("#live-steps");
	if (list.firstElementChild?.classList.contains("dim")) list.replaceChildren();
	if (list.querySelector(`[data-running="${CSS.escape(d.agent)}"]`)) return;
	list.append(el("li", { dataset: { running: d.agent } },
		el("div", { class: "step-top" }, el("b", {}, d.agent.replace(/^tt-/, "")), el("span", { class: "r" }, roleLabel(d.agent, d.role)),
			el("span", { class: "c row", style: "gap:6px" }, el("span", { class: "pulse" }), "running"))));
}

function onStep(s) {
	const role = roleLabel(s.agent, s.role);
	const list = $("#live-steps");
	if (list.firstElementChild?.classList.contains("dim")) list.replaceChildren();
	list.querySelector(`[data-running="${CSS.escape(s.agent)}"]`)?.remove();
	list.append(el("li", {},
		el("div", { class: "step-top" }, el("b", {}, s.agent.replace(/^tt-/, "")), el("span", { class: "r" }, role), el("span", { class: "c" }, costLabel(s))),
		s.error ? el("p", { class: "notice notice-err", style: "margin-top:6px" }, s.error) : el("details", {},
			el("summary", {}, "prompt & output"),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Rendered prompt"), el("pre", { class: "code" }, s.prompt),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Output"), el("pre", { class: "code" }, s.output))));
}

function onFeed(item) {
	if (room.seen.has(item.seq)) return;
	room.seen.add(item.seq);
	const p = item.payload;
	let node = null;
	const entry = (kind, hd, text) => el("li", { class: `entry entry-${kind}`, dataset: { round: item.round, seq: item.seq } },
		hd ? el("div", { class: "entry-hd" }, hd) : null, text != null ? el("div", { class: "entry-text" }, text) : null);

	switch (item.kind) {
		case "system": node = entry("system", null, p.text); if (p.tone === "error") node.querySelector(".entry-text").style.color = "var(--red-bright)"; break;
		case "join": node = entry("join", null, `${p.name} the ${p.archetype} joins the party.`); break;
		case "action": node = entry("action", [el("b", {}, p.name), " acts"], p.text); break;
		case "roll": node = entry("roll", null, null);
			node.append(el("span", { class: p.success ? "chip chip-ok" : "chip chip-red" }, `🎲 ${p.text}`));
			if (p.reason) node.append(el("p", { class: "dim", style: "font-size:.78rem;margin-top:4px" }, p.reason));
			break;
		case "narration":
			node = entry("narration", [el("b", {}, p.author), el("span", {}, `· round ${item.round}`)], p.text);
			if (room.live) { room.live.remove(); room.live = null; }
			if (p.suggestions && room.me.name) showSuggestions(p.suggestions[room.me.name] || []);
			node.append(el("div", { class: "row rewind-slot", style: "margin-top:8px" }));
			break;
		case "npc": node = entry("npc", [el("b", {}, p.name), " (NPC)"], p.text); break;
		case "adjust": node = entry("adjust", null, p.text); break;
		case "cost":
			room.lastCost = p;
			node = entry("cost", null, null);
			node.append(el("span", { class: "chip" }, `${p.label}: ${p.dry_run ? "dry run" : p.priced ? fmtUSD(p.usd) : "—"} · ${p.input_tokens + p.output_tokens} tokens · ${p.steps.length} agent steps`));
			if (room.game) renderCost();
			break;
		case "rewind":
			$("#feed").querySelectorAll(".entry").forEach((e) => { if (+e.dataset.round > p.to_round) e.classList.add("stale"); });
			node = entry("system", null, p.text);
			showSuggestions([]);
			break;
		default: return;
	}
	$("#feed").append(node);
	markRewinds();
	scrollFeed();
}

function markRewinds() {
	if (!room.me.host || !room.game) return;
	const rounds = new Set((room.game.rounds || []).map((r) => r.round));
	$("#feed").querySelectorAll(".entry-narration:not(.stale)").forEach((e) => {
		const slot = e.querySelector(".rewind-slot");
		const r = +e.dataset.round;
		if (!slot) return;
		slot.replaceChildren(rounds.has(r) && r < room.game.round
			? el("button", { class: "btn btn-sm btn-ghost", type: "button", title: "Fork the story at the end of this round",
				onclick: () => hostAction("rewind", { round: r }) }, `↺ Rewind to here (round ${r})`)
			: "");
	});
}

function showSuggestions(list) {
	$("#suggestions").replaceChildren(...list.map((s) =>
		el("button", { type: "button", class: "btn btn-sm", onclick: () => { $("#action").value = s; $("#action").focus(); } }, s)));
}

function scrollFeed() {
	const f = $("#feed");
	f.scrollTop = f.scrollHeight;
}

// ---------- Actions ----------

$("#composer").addEventListener("submit", async (e) => {
	e.preventDefault();
	const action = $("#action").value.trim();
	if (!action) return;
	try {
		await api(`${L}/games/${room.code}/act`, { method: "POST", body: { action } });
		$("#action").value = "";
		showSuggestions([]);
		setRoomError("");
	} catch (err) { setRoomError(err.message); }
});

async function hostAction(path, body, extra = {}) {
	try {
		await api(`${L}/games/${room.code}/${path}`, { method: "POST", body, ...extra });
		setRoomError("");
		return true;
	} catch (err) { setRoomError(err.message); return false; }
}

$("#h-start").addEventListener("click", () => hostAction("start"));
$("#h-resolve").addEventListener("click", () => hostAction("resolve"));
$("#h-end").addEventListener("click", () => { if (confirm("End the game for everyone?")) hostAction("end"); });
$("#h-key").addEventListener("click", () => {
	if (!keyInput.value.trim()) return setRoomError("Enter your API key in the Model & key panel first.");
	hostAction("key", undefined, { headers: headers() });
});
$("#dm-narrate").addEventListener("click", async () => {
	const text = $("#dm-text").value.trim();
	if (!text) return;
	$("#dm-narrate").disabled = true;
	if (await hostAction("narrate", { text })) $("#dm-text").value = "";
	$("#dm-narrate").disabled = false;
});
$("#dm-check").addEventListener("click", () => hostAction("check", {
	player: $("#dm-check-player").value, ability: $("#dm-check-ability").value, dc: +$("#dm-check-dc").value || 12,
}));
$("#dm-adjust").addEventListener("click", async () => {
	const item = $("#dm-adj-item").value.trim();
	const ok = await hostAction("adjust", { player: $("#dm-adj-player").value, change: {
		hp_delta: +$("#dm-adj-hp").value || 0, items_gained: item ? [item] : [],
	} });
	if (ok) { $("#dm-adj-hp").value = 0; $("#dm-adj-item").value = ""; }
});
$("#npc-speak").addEventListener("click", async () => {
	$("#npc-speak").disabled = true;
	if (await hostAction("npc", { npc: $("#npc-name").value, direction: $("#npc-direction").value.trim() })) $("#npc-direction").value = "";
	$("#npc-speak").disabled = false;
});

// ===========================================================================
// Pipeline
// ===========================================================================

let preset = null;
let lastPlan = null;

function agentCard(a, i) {
	const field = (label, key, rows) => {
		const input = el("textarea", { class: "textarea", rows, value: a[key] ?? "", spellcheck: "false" });
		input.dataset.key = key;
		return el("label", { class: "field" }, el("span", {}, label), input);
	};
	const slug = el("input", { class: "input mono", value: a.slug, "aria-label": "Agent name", spellcheck: "false" });
	slug.dataset.key = "slug";
	const out = el("input", { class: "input mono", value: a.output_key, "aria-label": "Output name", spellcheck: "false" });
	out.dataset.key = "output_key";
	return el("li", { class: "agent-card" },
		el("div", { class: "agent-card-hd" },
			i === 0 ? el("span", { class: "chip chip-red" }, "lead") : el("span", { class: "chip" }, "follower"),
			slug, el("span", { class: "dim mono", style: "font-size:.7rem" }, "→"), out,
			el("button", { type: "button", class: "btn btn-sm btn-ghost", "aria-label": `Remove ${a.slug}`, onclick: (e) => { e.target.closest("li").remove(); relabel(); } }, "✕")),
		el("div", { class: "agent-card-bd" }, field("System prompt", "system", 3), field("Template", "template", 3)));
}

function relabel() {
	[...$("#pl-agents").children].forEach((li, i) => {
		const chip = li.querySelector(".chip");
		chip.textContent = i === 0 ? "lead" : "follower";
		chip.className = i === 0 ? "chip chip-red" : "chip";
	});
}

function loadPipeline(def) {
	$("#pl-input-name").value = def.input_name;
	$("#pl-input").value = def.input || "";
	$("#pl-agents").replaceChildren(...def.agents.map(agentCard));
}

function readPipeline() {
	return {
		input_name: $("#pl-input-name").value.trim(),
		input: $("#pl-input").value,
		agents: [...$("#pl-agents").children].map((li) => {
			const a = {};
			li.querySelectorAll("[data-key]").forEach((x) => (a[x.dataset.key] = x.value.trim()));
			return a;
		}),
	};
}

$("#pl-add").addEventListener("click", () => {
	const n = $("#pl-agents").children.length + 1;
	$("#pl-agents").append(agentCard({ slug: `agent-${n}`, output_key: `Output${n}`, system: "You are a concise reviewer.", template: `Review this:\n{{.Inputs.${$("#pl-input-name").value || "Incident"}}}` }, n - 1));
	relabel();
});
$("#pl-reset").addEventListener("click", () => preset && loadPipeline(preset));
$("#pl-plan").addEventListener("click", () => planPipeline());
$("#pl-run").addEventListener("click", () => runPipeline());

function plStatus(msg, tone = "") {
	$("#pl-status").replaceChildren(msg ? el("div", { class: `notice ${tone === "err" ? "notice-err" : ""}` }, msg) : "");
}

async function planPipeline() {
	const def = readPipeline();
	delete def.input;
	try {
		const plan = await api(`${L}/pipeline/plan`, { method: "POST", body: def });
		renderPlan(plan);
		plStatus(plan.valid ? `✓ Valid. ${plan.nodes.length} agents in ${layerCount(plan)} layers.` : plan.errors.join("\n"), plan.valid ? "" : "err");
	} catch (e) { plStatus(e.message, "err"); }
}

const layerCount = (plan) => (plan.nodes?.length ? Math.max(...plan.nodes.map((n) => n.Layer)) + 1 : 0);

function renderPlan(plan) {
	lastPlan = plan;
	if (!plan.nodes?.length) {
		$("#pl-layers").replaceChildren(el("p", { class: "dim" }, "Nothing to plan yet."));
		return;
	}
	const layers = [];
	for (const n of plan.nodes) (layers[n.Layer] ||= []).push(n);
	$("#pl-layers").replaceChildren(...layers.map((nodes, i) => el("div", { class: "layer" },
		el("div", { class: "layer-hd" }, i === 0 ? "Layer 0 · lead" : `Layer ${i}${nodes.length > 1 ? " · parallel" : ""}`),
		...nodes.map((n) => el("div", { class: "node", dataset: { agent: n.AgentSlug, state: "idle" } },
			el("b", {}, n.AgentSlug),
			el("div", { class: "io" }, ...(n.Consumes || []).map((c) => el("span", { class: "chip" }, "in " + c)), el("span", { class: "chip chip-red" }, "out " + n.OutputKey)),
			el("div", { class: "st" }, el("span", {}, "")))))));
}

function setNode(agent, state, label) {
	const node = document.querySelector(`.node[data-agent="${CSS.escape(agent)}"]`);
	if (!node) return;
	node.dataset.state = state;
	node.querySelector(".st").replaceChildren(state === "running" ? el("span", { class: "pulse" }) : null, el("span", {}, label));
}

async function runPipeline() {
	const def = readPipeline();
	$("#pl-run").disabled = $("#pl-plan").disabled = true;
	$("#pl-cost").textContent = "";
	plStatus("");
	const outputs = $("#pl-outputs");
	outputs.replaceChildren();
	const leadSlug = def.agents[0]?.slug;
	let leadBox = null, usd = 0, priced = true, dry = false;
	const done = new Set();
	const advance = () => {
		if (!lastPlan) return;
		for (const n of lastPlan.nodes) {
			if (done.has(n.AgentSlug)) continue;
			const ready = (n.Consumes || []).every((c) => c === def.input_name || lastPlan.nodes.some((m) => m.OutputKey === c && done.has(m.AgentSlug)));
			setNode(n.AgentSlug, ready ? "running" : "idle", ready ? "running" : "waiting");
		}
	};
	try {
		await stream(`${L}/pipeline/run`, {
			body: def, headers: headers(),
			onEvent: (ev, d) => {
				if (ev === "plan") { renderPlan(d); advance(); }
				if (ev === "session") dry = d.dry_run;
				if (ev === "chunk") {
					if (!leadBox) {
						leadBox = el("div", { class: "entry-text" });
						outputs.append(el("li", { class: "output", dataset: { agent: leadSlug } }, el("h3", {}, leadSlug, el("span", { class: "dim" }, "streaming…")), leadBox));
					}
					leadBox.textContent += d.text;
				}
				if (ev === "step") {
					done.add(d.agent);
					setNode(d.agent, d.error ? "error" : "done", d.error ? "failed" : costLabel(d));
					if (!d.error) { usd += d.usd; priced = priced && d.priced; }
					const item = el("li", { class: "output" },
						el("h3", {}, d.agent, el("span", { class: "dim" }, d.error ? "failed" : costLabel(d))),
						d.error ? el("p", { class: "notice notice-err" }, d.error) : el("div", { class: "entry-text" }, d.output),
						d.error ? null : el("details", {}, el("summary", {}, "rendered prompt"), el("pre", { class: "code" }, d.prompt)));
					const existing = outputs.querySelector(`[data-agent="${CSS.escape(d.agent)}"]`);
					existing ? existing.replaceWith(item) : outputs.append(item);
					advance();
				}
				if (ev === "done") $("#pl-cost").textContent = `${d.steps} steps · ${(d.elapsed_ms / 1000).toFixed(1)}s · ${dry ? "dry run" : priced ? fmtUSD(usd) : "cost —"}`;
				if (ev === "error") throw new Error(d.message);
			},
		});
	} catch (e) { plStatus(e.message, "err"); }
	finally { $("#pl-run").disabled = $("#pl-plan").disabled = false; }
}

// ===========================================================================
// Boot
// ===========================================================================

tabs(document);

async function boot() {
	if (!(await checkApi($("#api-status")))) return;
	try {
		config = await api(`${L}/config`);
	} catch (e) {
		$("#g-create-status").textContent = e.message;
		return;
	}
	modelSelect.replaceChildren(...["anthropic", "openai"].map((p) =>
		el("optgroup", { label: p === "anthropic" ? "Anthropic" : "OpenAI" },
			config.models.filter((m) => m.provider === p).map((m) =>
				el("option", { value: `${m.provider}/${m.id}` }, m.input_per_1m ? `${m.label} · $${m.input_per_1m}/$${m.output_per_1m} per 1M` : m.label)))));
	try {
		const saved = sessionStorage.getItem("loom-model");
		if (saved && config.models.some((m) => `${m.provider}/${m.id}` === saved)) modelSelect.value = saved;
	} catch {}
	updateMode();
	renderLobby();

	const code = new URL(location.href).searchParams.get("game");
	if (code) {
		$("#j-code").value = code.toUpperCase();
		try {
			const d = await api(`${L}/games/${code.toUpperCase()}`);
			if (d.me.host || d.me.name) enterRoom(code.toUpperCase()); // returning to your own table
			else $("#j-name").focus();
		} catch (e) { $("#j-status").textContent = e.message; }
	}

	try {
		preset = await api(`${L}/pipeline/preset`);
		loadPipeline(preset);
		planPipeline();
	} catch {}
}

boot();
mountFeedback("loom");
