import { el, $, api, stream, fmtUSD, mountFeedback, checkApi } from "./common.js";

const D = "/api/loom/desk";
const STORE = "forecast-desk";
const WHO = {
	you: { label: "You", color: "var(--fg)" },
	value: { label: "Value hunter", color: "var(--red-bright)" },
	contrarian: { label: "Contrarian", color: "#d29922" },
};
const OUT = { home: "Home", draw: "Draw", away: "Away" };

let state = null; // the desk view from the server
let pick = "home";
let busy = false;

// The cloud's script API (src/scripts/cloud/cloud.js), if the page has it.
const cloud = () => window.rhaqimCloud;
const fill = (node, ...kids) => node.replaceChildren(...kids.flat().filter((k) => k != null && k !== false));

// ---------------------------------------------------------------------------
// Model & key: same sessionStorage keys as the loom page, so a key entered
// there (with "keep for this tab") carries over.
// ---------------------------------------------------------------------------

const keyInput = $("#key"), modelSelect = $("#model"), remember = $("#remember");
try {
	const saved = sessionStorage.getItem("loom-key");
	if (saved) { keyInput.value = saved; remember.checked = true; }
} catch {}
const persist = () => {
	try {
		if (remember.checked && keyInput.value) sessionStorage.setItem("loom-key", keyInput.value);
		else sessionStorage.removeItem("loom-key");
		sessionStorage.setItem("loom-model", modelSelect.value);
	} catch {}
	const chip = $("#mode-chip");
	chip.textContent = keyInput.value.trim() ? modelSelect.selectedOptions[0]?.textContent.split(" ·")[0] || "Live" : "Dry run";
	chip.className = keyInput.value.trim() ? "chip chip-red" : "chip";
};
keyInput.addEventListener("input", persist);
remember.addEventListener("change", persist);
modelSelect.addEventListener("change", persist);
const headers = () => (keyInput.value.trim() ? { "X-LLM-Key": keyInput.value.trim(), "X-LLM-Model": modelSelect.value } : {});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function formChips(form) {
	return [...form].map((r) => el("span", { class: `fd-r fd-r-${r}`, title: { W: "won", D: "drew", L: "lost" }[r] }, r));
}

function renderCard() {
	const f = state.fixture;
	$("#fd-md").textContent = `Matchday ${f.matchday}`;
	$("#fd-home").textContent = f.home.name;
	$("#fd-away").textContent = f.away.name;
	$("#fd-home-meta").textContent = `att ${f.home.attack.toFixed(2)} · def ${f.home.defense.toFixed(2)}`;
	$("#fd-away-meta").textContent = `att ${f.away.attack.toFixed(2)} · def ${f.away.defense.toFixed(2)}`;
	fill($("#fd-home-form"), formChips(f.home.form));
	fill($("#fd-away-form"), formChips(f.away.form));
	fill($("#fd-odds"), ["home", "draw", "away"].map((o) =>
		el("button", {
			type: "button", class: "fd-odd", role: "radio", "aria-checked": String(pick === o),
			onclick: () => { pick = o; renderCard(); },
		},
			el("span", { class: "fd-odd-name" }, o === "home" ? f.home.name : o === "away" ? f.away.name : "Draw"),
			el("span", { class: "fd-odd-price mono" }, f.odds[o].toFixed(2)),
			el("span", { class: "fd-odd-imp mono" }, `${Math.round(f.implied[o] * 100)}% implied`))));
	const lim = state.limits;
	$("#fd-limit").textContent = `limit ${lim.max_stake} · ${lim.rule}`;
	for (const id of ["#fd-stake", "#fd-stake-range"]) {
		$(id).max = Math.max(1, lim.max_stake);
		if (+$(id).value > lim.max_stake) $(id).value = lim.max_stake;
	}
	updateReturn();
	$("#fd-play").disabled = busy || lim.max_stake < 1;
	$("#fd-sit").disabled = busy;
}

function updateReturn() {
	const stake = +$("#fd-stake").value || 0;
	const odds = state?.fixture.odds[pick] || 0;
	$("#fd-return").textContent = stake ? `wins ${Math.round(stake * (odds - 1))} · loses ${stake}` : "";
}
$("#fd-stake").addEventListener("input", (e) => { $("#fd-stake-range").value = e.target.value; updateReturn(); });
$("#fd-stake-range").addEventListener("input", (e) => { $("#fd-stake").value = e.target.value; updateReturn(); });

function sparkline(series, color) {
	const w = 120, h = 28, min = Math.min(...series, 700), max = Math.max(...series, 1300);
	const pts = series.map((v, i) => `${(i / Math.max(1, series.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(" ");
	const base = h - ((1000 - min) / (max - min)) * h;
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
	svg.setAttribute("class", "fd-spark");
	svg.setAttribute("aria-hidden", "true");
	svg.innerHTML = `<line x1="0" x2="${w}" y1="${base}" y2="${base}" stroke="var(--line-strong)" stroke-dasharray="2 3"/>` +
		(series.length > 1 ? `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/>` : "");
	return svg;
}

function renderBoard() {
	const series = { you: [1000], value: [1000], contrarian: [1000] };
	let running = { you: 1000, value: 1000, contrarian: 1000 };
	for (const h of state.history) {
		for (const who of Object.keys(series)) {
			running[who] += h.bets[who]?.delta || 0;
			series[who].push(running[who]);
		}
	}
	const order = Object.keys(WHO).sort((a, b) => state.chips[b] - state.chips[a]);
	fill($("#fd-board"), order.map((who, i) => el("li", { class: "fd-row" },
		el("span", { class: "mono dim" }, `${i + 1}`),
		el("span", { class: "fd-who", style: `color:${WHO[who].color}` }, WHO[who].label),
		sparkline(series[who], WHO[who].color),
		el("span", { class: "mono fd-chips" }, state.chips[who].toLocaleString()))));
}

function renderHistory() {
	if (!state.history.length) return fill($("#fd-history"), el("li", { class: "dim" }, "No matches yet."));
	fill($("#fd-history"), [...state.history].reverse().map((h) => {
		const you = h.bets.you || {};
		return el("li", { class: "fd-hist" },
			el("span", { class: "mono dim" }, `MD${h.matchday}`),
			el("span", { class: "fd-hist-score" }, `${h.home} ${h.score} ${h.away}`),
			el("span", { class: `mono ${you.delta > 0 ? "fd-up" : you.delta < 0 ? "fd-down" : "dim"}` }, you.pick ? `${you.delta > 0 ? "+" : ""}${you.delta}` : "sat out"),
			el("button", { type: "button", class: "btn btn-sm btn-ghost", title: "Fork the desk before this match and bet it differently",
				disabled: busy, onclick: () => rewind(h.matchday) }, "What if?"));
	}));
}

function render() {
	state.history ||= [];
	renderCard();
	renderBoard();
	renderHistory();
}

function agentCard(key, title, role, body) {
	const existing = document.querySelector(`[data-agent-card="${key}"]`);
	const node = el("div", { class: "fd-agent", dataset: { agentCard: key } },
		el("div", { class: "fd-agent-hd" }, el("b", {}, title), el("span", { class: "dim mono" }, role)), body);
	existing ? existing.replaceWith(node) : $("#fd-agents").append(node);
}

function pickBody(output) {
	let p = null;
	try { p = JSON.parse(output.slice(output.indexOf("{"), output.lastIndexOf("}") + 1)); } catch {}
	if (!p) return el("p", { class: "dim" }, output.slice(0, 200));
	const f = state.fixture;
	const name = p.pick === "home" ? f.home.name : p.pick === "away" ? f.away.name : p.pick === "draw" ? "the draw" : "nothing (pass)";
	return el("div", {},
		el("p", {}, "Backs ", el("b", {}, name), p.probabilities?.[p.pick] ? ` · thinks ${Math.round(p.probabilities[p.pick] * 100)}%` : ""),
		p.reason ? el("p", { class: "dim", style: "font-size:.85rem" }, p.reason) : null);
}

// ---------------------------------------------------------------------------
// Playing a match
// ---------------------------------------------------------------------------

function setBusy(b) {
	busy = b;
	$("#fd-busy").hidden = !b;
	renderCard();
	renderHistory();
}

async function play(sitOut) {
	if (busy || !state) return;
	setBusy(true);
	["#fd-risk", "#fd-result", "#fd-error", "#fd-agents"].forEach((s) => fill($(s)));
	$("#fd-comment").textContent = "";
	$("#fd-preview").textContent = "";
	fill($("#fd-steps"));
	let usd = 0, priced = true, dry = false;
	const body = sitOut ? { pick: "pass", stake: 0 } : { pick, stake: +$("#fd-stake").value };
	try {
		await stream(`${D}/${state.session_id}/play`, {
			body, headers: headers(),
			onEvent: (ev, d) => {
				if (ev === "session") dry = d.dry_run;
				if (ev === "chunk") $("#fd-preview").textContent += d.text;
				if (ev === "comment") $("#fd-comment").textContent += d.text;
				if (ev === "step") {
					addStep(d);
					if (!d.error) { usd += d.usd; priced = priced && d.priced; }
					if (d.agent === "fd-value") agentCard("value", "Value hunter", "layer 1 · parallel", pickBody(d.output));
					if (d.agent === "fd-contrarian") agentCard("contrarian", "Contrarian", "layer 1 · parallel", pickBody(d.output));
				}
				if (ev === "risk") {
					const p = d.pending || {};
					agentCard("bankroll", "Bankroll manager", "layer 2 · reads both picks", el("div", {},
						["value", "contrarian"].map((w) => el("p", {}, `${WHO[w].label}: `, el("b", {}, p[w]?.stake ? `${p[w].stake} chips` : "no stake"),
							p[w]?.note ? el("span", { class: "dim" }, ` · ${p[w].note}`) : null))));
					fill($("#fd-risk"), (d.notes || []).length ? el("div", { class: "notice notice-warn" },
						el("b", {}, "Risk referee (hook): "), d.notes.join(" ")) : el("p", { class: "dim", style: "font-size:.85rem" }, "Risk referee: all stakes within limits."));
				}
				if (ev === "result") showResult(d);
				if (ev === "state") state = { ...d, history: d.history || [] };
				if (ev === "error") throw new Error(d.message);
			},
		});
		$("#fd-cost").textContent = dry ? "dry run" : priced ? fmtUSD(usd) : "cost —";
	} catch (e) {
		fill($("#fd-error"), el("div", { class: "notice notice-err" }, e.message));
	} finally {
		setBusy(false);
		render();
	}
}

function showResult(r) {
	const winner = r.outcome === "home" ? r.home : r.outcome === "away" ? r.away : "Nobody: a draw";
	fill($("#fd-result"), el("div", { class: "fd-result" },
		el("span", { class: "eyebrow" }, `Full time · matchday ${r.matchday}`),
		el("p", { class: "fd-score mono" }, `${r.home} ${r.score} ${r.away}`),
		el("p", { class: "dim" }, `${winner}${r.outcome !== "draw" ? " win" : ""}.`),
		el("div", { class: "fd-deltas" }, Object.keys(WHO).map((w) => {
			const b = r.bets[w] || {};
			return el("span", { class: `chip ${b.delta > 0 ? "chip-ok" : b.delta < 0 ? "chip-red" : ""}` },
				`${WHO[w].label}: ${b.pick ? `${OUT[b.pick]} ${b.stake} → ${b.delta > 0 ? "+" : ""}${b.delta}` : "sat out"}`);
		}))));
	// The cloud spells the score, then goes back to the host.
	const c = cloud();
	if (c) {
		c.morph({ text: r.score.replace("-", "–") });
		setTimeout(() => c.release(), 5000);
	}
}

function addStep(s) {
	const role = s.role === "lead" ? "lead · streams" : s.role === "commentary" ? "after the match" : s.agent === "fd-bankroll" ? "layer 2" : "layer 1 · parallel";
	$("#fd-steps").append(el("li", {},
		el("div", { class: "step-top" }, el("b", {}, s.agent.replace(/^fd-/, "")), el("span", { class: "r" }, role),
			el("span", { class: "c" }, s.error ? "failed" : `${s.input_tokens}→${s.output_tokens} tok · ${s.priced ? fmtUSD(s.usd) : "—"}`)),
		s.error ? el("p", { class: "notice notice-err", style: "margin-top:6px" }, s.error) : el("details", {},
			el("summary", {}, "prompt & output"),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Rendered prompt"), el("pre", { class: "code" }, s.prompt),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Output"), el("pre", { class: "code" }, s.output))));
}

async function rewind(matchday) {
	if (busy) return;
	try {
		state = await api(`${D}/${state.session_id}/rewind`, { method: "POST", body: { matchday } });
		save();
		["#fd-risk", "#fd-result", "#fd-agents"].forEach((s) => fill($(s)));
		$("#fd-preview").textContent = "";
		$("#fd-comment").textContent = "";
		fill($("#fd-steps"), el("li", { class: "dim" }, `Forked before matchday ${matchday}. Same match, same seed: only your bet can change the result for you.`));
		render();
	} catch (e) {
		fill($("#fd-error"), el("div", { class: "notice notice-err" }, e.message));
	}
}

$("#fd-play").addEventListener("click", () => play(false));
$("#fd-sit").addEventListener("click", () => play(true));
$("#fd-new").addEventListener("click", async () => {
	if (busy || !confirm("Open a new desk with a new league and 1,000 chips each?")) return;
	state = await api(D, { method: "POST" });
	save();
	render();
});

function save() {
	try { localStorage.setItem(STORE, state.session_id); } catch {}
}

// ---------------------------------------------------------------------------
// Backtest chart
// ---------------------------------------------------------------------------

const BT_COLORS = ["var(--red-bright)", "#d29922", "var(--fg)", "var(--fg-dim)"];

async function backtest() {
	$("#bt-run").disabled = true;
	try {
		const seed = state?.seed ? `&seed=${state.seed}` : "";
		const d = await api(`${D}/backtest?n=${$("#bt-n").value}${seed}`);
		drawChart(d);
	} catch (e) {
		fill($("#bt-chart"), el("div", { class: "notice notice-err" }, e.message));
	} finally {
		$("#bt-run").disabled = false;
	}
}

function drawChart(d) {
	const W = 900, H = 260, pad = { l: 48, r: 180, t: 12, b: 26 };
	const all = d.strategies.flatMap((s) => s.chips).concat(d.start);
	const min = Math.min(...all), max = Math.max(...all);
	const X = (i) => pad.l + (i / (d.matches - 1)) * (W - pad.l - pad.r);
	const Y = (v) => pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b);
	const ticks = [min, d.start, max].map((v) => Math.round(v));
	let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chips over ${d.matches} matches for each strategy">`;
	svg += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(d.start)}" y2="${Y(d.start)}" stroke="var(--line-strong)" stroke-dasharray="3 4"/>`;
	for (const t of ticks) svg += `<text x="${pad.l - 8}" y="${Y(t) + 4}" text-anchor="end" class="fd-axis">${t}</text>`;
	svg += `<text x="${pad.l}" y="${H - 6}" class="fd-axis">match 1</text><text x="${W - pad.r}" y="${H - 6}" text-anchor="end" class="fd-axis">match ${d.matches}</text>`;
	// End labels, nudged apart so they never overlap.
	const ends = d.strategies.map((s, i) => ({ i, y: Y(s.final) })).sort((a, b) => a.y - b.y);
	for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 14);
	d.strategies.forEach((s, i) => {
		const pts = s.chips.map((v, j) => `${X(j).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
		svg += `<polyline points="${pts}" fill="none" stroke="${BT_COLORS[i]}" stroke-width="${i === 0 ? 2 : 1.5}" ${i === 3 ? 'stroke-dasharray="4 3"' : ""}/>`;
	});
	for (const e of ends) {
		const s = d.strategies[e.i];
		svg += `<text x="${W - pad.r + 8}" y="${e.y + 4}" fill="${BT_COLORS[e.i]}" class="fd-label">${s.name} ${s.final}</text>`;
	}
	svg += "</svg>";
	$("#bt-chart").innerHTML = svg;
	fill($("#bt-table"), el("table", { class: "cost-table fd-bt-table" },
		el("thead", {}, el("tr", {}, ["Strategy", "Final chips", "Bets", "Win rate", "Brier (lower is better)", "Worst drawdown"].map((h) => el("th", {}, h)))),
		el("tbody", {}, d.strategies.map((s, i) => el("tr", {},
			el("td", {}, el("span", { style: `color:${BT_COLORS[i]}` }, "■ "), s.name, el("p", { class: "dim", style: "font-family:var(--font-sans);font-size:.78rem;margin-top:2px" }, s.blurb)),
			el("td", {}, s.final), el("td", {}, s.bets), el("td", {}, s.bets ? `${Math.round((s.wins / s.bets) * 100)}%` : "—"),
			el("td", {}, s.brier.toFixed(3)), el("td", {}, s.max_drawdown))))));
}
$("#bt-run").addEventListener("click", backtest);

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
	if (!(await checkApi($("#api-status")))) return;
	try {
		const cfg = await api("/api/loom/config");
		fill(modelSelect, ["anthropic", "openai"].map((p) => el("optgroup", { label: p === "anthropic" ? "Anthropic" : "OpenAI" },
			cfg.models.filter((m) => m.provider === p).map((m) =>
				el("option", { value: `${m.provider}/${m.id}` }, m.input_per_1m ? `${m.label} · $${m.input_per_1m}/$${m.output_per_1m} per 1M` : m.label)))));
		try {
			const saved = sessionStorage.getItem("loom-model");
			if (saved) modelSelect.value = saved;
		} catch {}
		persist();
	} catch {}
	let id = null;
	try { id = localStorage.getItem(STORE); } catch {}
	try {
		state = id ? await api(`${D}/${id}`) : null;
	} catch { state = null; }
	if (!state) {
		state = await api(D, { method: "POST" });
		save();
	}
	render();
	backtest();
}

boot();
mountFeedback("loom");
