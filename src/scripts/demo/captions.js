import { el, $, api, stream, watch, fmtUSD, mountFeedback, checkApi } from "./common.js";

const C = "/api/loom/captions";
const STORE = "sermon-captions";
const LANGS = [
	{ code: "en", name: "English", short: "EN" },
	{ code: "yo", name: "Yorùbá", short: "YO" },
	{ code: "ig", name: "Igbo", short: "IG" },
	{ code: "pcm", name: "Nigerian Pidgin", short: "PCM" },
];
const nameOf = (code) => LANGS.find((l) => l.code === code)?.name || code;
const MODE = { quoted: "read aloud", cited: "named", paraphrase: "paraphrased" };

const fill = (node, ...kids) => node.replaceChildren(...kids.flat().filter((k) => k != null && k !== false));
const params = new URLSearchParams(location.search);
const followId = params.get("follow");

let cfg = null;
let svc = null; // the service view from the server
let lang = "yo";
let busy = false;
let sampleAt = 0;
let live = null; // the line being captioned: { en, captions, refs }

const textOf = (line, code) => (code === "en" ? line.en || line.spoken : line.captions?.[code]) || "";

// ---------------------------------------------------------------------------
// Language tabs, shared by the speaker's screen and the follower's
// ---------------------------------------------------------------------------

function langTabs(host, onPick) {
	fill(host, LANGS.map((l) => el("button", {
		type: "button", class: "tab", role: "tab", "aria-selected": String(l.code === lang),
		onclick: () => { lang = l.code; try { localStorage.setItem(STORE + "-lang", lang); } catch {} langTabs(host, onPick); onPick(); },
	}, l.short, el("span", { class: "sc-tab-name" }, ` ${l.name}`))));
}
try { lang = localStorage.getItem(STORE + "-lang") || lang; } catch {}

function verseCard(ref, code) {
	const text = ref.texts?.[code === "en" ? "en" : code];
	return el("div", { class: `sc-verse sc-verse--${ref.mode}` },
		el("div", { class: "sc-verse-hd" }, el("b", {}, ref.label), el("span", { class: "chip" }, MODE[ref.mode] || ref.mode)),
		text ? el("p", {}, text) : null);
}

function screen(host, line, streaming) {
	if (!line) return fill(host, el("p", { class: "sc-screen-text dim" }, followId ? "Waiting for the preacher." : "Captions appear here."));
	const t = textOf(line, lang);
	fill(host,
		el("p", { class: `sc-screen-text${!t ? " dim" : ""}` }, t || (streaming ? "…" : "")),
		(line.refs || []).filter((r) => r.mode === "quoted").map((r) => el("p", { class: "sc-screen-ref mono" }, r.label)));
}

// ---------------------------------------------------------------------------
// Follower: the congregation's phone
// ---------------------------------------------------------------------------

function bootFollower() {
	$("#sc-speaker").hidden = true;
	$("#sc-follower").hidden = false;
	$("#sc-lede").textContent = "You're following a live service. Pick your language: captions arrive as the preacher speaks, and Scripture read aloud comes from that language's Bible.";
	let lines = [];
	let current = null;
	const render = () => {
		screen($("#sc-f-screen"), current || lines.at(-1), !!current);
		fill($("#sc-f-feed"), [...lines].reverse().slice(1, 30).map((l) => el("li", { class: "sc-feed-line" },
			el("span", { class: "mono dim" }, `#${l.n}`), el("span", {}, textOf(l, lang)))));
	};
	langTabs($("#sc-f-langs"), render);
	watch(`${C}/${followId}/follow`, {
		open: () => { $("#sc-f-live").textContent = "live"; $("#sc-f-live").className = "chip chip-ok"; },
		error: () => { $("#sc-f-live").textContent = "reconnecting"; $("#sc-f-live").className = "chip"; },
		history: (v) => { $("#sc-f-title").textContent = v.title || "Live captions"; lines = v.lines || []; render(); },
		speaking: () => { current = { en: "", captions: {}, refs: [] }; render(); },
		chunk: (d) => { if (current) { current.en += d.text; if (lang === "en") render(); } },
		line: (l) => { current = null; lines.push(l); render(); },
	});
}

// ---------------------------------------------------------------------------
// Speaker: model & key (shared with the other Noewright pages)
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
	const own = keyInput.value.trim();
	chip.textContent = own ? modelSelect.selectedOptions[0]?.textContent.split(" ·")[0] || "Live" : cfg?.house ? `Demo key · ${cfg.house_model}` : "Dry run";
	chip.className = own || cfg?.house ? "chip chip-red" : "chip";
};
keyInput.addEventListener("input", persist);
remember.addEventListener("change", persist);
modelSelect.addEventListener("change", persist);
const headers = () => (keyInput.value.trim() ? { "X-LLM-Key": keyInput.value.trim(), "X-LLM-Model": modelSelect.value } : {});

// ---------------------------------------------------------------------------
// Speaker: rendering
// ---------------------------------------------------------------------------

function followLink() {
	return `${location.origin}${location.pathname}?follow=${svc.id}`;
}

function renderSpeaker() {
	const lines = svc.lines || [];
	$("#sc-count").textContent = `${lines.length} line${lines.length === 1 ? "" : "s"}`;
	$("#sc-follow").value = followLink();
	$("#sc-open").href = followLink();
	const sample = cfg?.sample || [];
	sampleAt = Math.min(sampleAt, sample.length);
	$("#sc-sample-hint").textContent = sample.length && sampleAt < sample.length ? `Next sample line (${sampleAt + 1} of ${sample.length}): “${sample[sampleAt]}”` : "That's the whole sample sermon. Type your own lines, or open a new service.";
	$("#sc-next").disabled = busy || sampleAt >= sample.length;
	$("#sc-play").disabled = !playing && (busy || sampleAt >= sample.length);
	$("#sc-send").disabled = busy;
	const last = live || lines.at(-1);
	screen($("#sc-screen"), last, !!live);
	fill($("#sc-verses"), (last?.refs || []).map((r) => verseCard(r, lang)));
	renderHistory();
}

function judgeChip(line, code) {
	const j = line.judge?.[code];
	if (line.dry_run || !j || !j.score) return null;
	return el("span", { class: `chip ${j.score >= 4 ? "chip-ok" : j.score <= 2 ? "chip-red" : ""}`, title: j.note || "" },
		`judge ${j.score}/5${j.confidence ? ` · ${j.confidence}` : ""}`);
}

function guardChip(line, code) {
	const g = line.guard?.[code];
	if (!g) return null;
	return el("span", { class: `chip ${g === "flagged" ? "chip-red" : "chip-warn"}`,
		title: g === "flagged" ? "The caption still didn't quote the Bible text after a retry." : "The scripture guard sent this caption back once; the retry quoted the Bible text." },
		g === "flagged" ? "guard: flagged" : "guard: retried");
}

function renderHistory() {
	const lines = svc.lines || [];
	if (!lines.length) return fill($("#sc-history"), el("li", { class: "dim" }, "No lines yet."));
	fill($("#sc-history"), [...lines].reverse().map((l) => el("li", { class: "sc-line" },
		el("div", { class: "sc-line-hd" },
			el("span", { class: "mono dim" }, `#${l.n}`),
			el("span", { class: "sc-spoken" }, l.spoken),
			(l.refs || []).map((r) => el("span", { class: "chip" }, `${r.label} · ${MODE[r.mode] || r.mode}`))),
		el("div", { class: "sc-line-langs" }, LANGS.slice(1).map((x) => el("div", { class: "sc-line-lang" },
			el("div", { class: "sc-line-lang-hd" }, el("b", {}, x.name), judgeChip(l, x.code), guardChip(l, x.code)),
			el("p", {}, textOf(l, x.code) || el("span", { class: "dim" }, "—")),
			l.judge?.[x.code]?.note && !l.dry_run ? el("p", { class: "dim sc-note" }, l.judge[x.code].note) : null))))));
}

function agentCard(key, title, role, body) {
	const existing = document.querySelector(`[data-agent-card="${key}"]`);
	const node = el("div", { class: "fd-agent", dataset: { agentCard: key } },
		el("div", { class: "fd-agent-hd" }, el("b", {}, title), el("span", { class: "dim mono" }, role)), body);
	existing ? existing.replaceWith(node) : $("#sc-agents").append(node);
}

function addStep(s) {
	const roles = { detect: "before the turn", lead: "lead · streams" };
	const role = roles[s.role] || (s.agent === "sc-judge" ? "layer 2 · reads all three" : "layer 1 · parallel");
	$("#sc-steps").append(el("li", {},
		el("div", { class: "step-top" }, el("b", {}, s.agent.replace(/^sc-/, "")), el("span", { class: "r" }, role),
			el("span", { class: "c" }, s.error ? "failed" : `${s.input_tokens}→${s.output_tokens} tok · ${s.priced ? fmtUSD(s.usd) : "—"}`)),
		s.error ? el("p", { class: "notice notice-err", style: "margin-top:6px" }, s.error) : el("details", {},
			el("summary", {}, "prompt & output"),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Rendered prompt"), el("pre", { class: "code" }, s.prompt),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Output"), el("pre", { class: "code" }, s.output))));
}

// ---------------------------------------------------------------------------
// Speaker: captioning a line
// ---------------------------------------------------------------------------

function setBusy(b) {
	busy = b;
	$("#sc-busy").hidden = !b;
	renderSpeaker();
}

async function caption(text) {
	text = text.trim();
	if (busy || !svc || !text) return false;
	live = { spoken: text, en: "", captions: {}, refs: [] };
	setBusy(true);
	fill($("#sc-error"));
	fill($("#sc-agents"));
	fill($("#sc-steps"));
	$("#sc-status").textContent = "";
	let usd = 0, priced = true, dry = false, ok = false;
	try {
		await stream(`${C}/${svc.id}/line`, {
			body: { text }, headers: headers(),
			onEvent: (ev, d) => {
				if (ev === "session") {
					dry = d.dry_run;
					$("#sc-status").textContent = d.dry_run ? "Dry run: no model is called." : `Running on ${d.model}.`;
				}
				if (ev === "scripture") {
					live.refs = d;
					agentCard("detect", "Detector", "before the turn", d.length
						? el("div", {}, d.map((r) => el("p", {}, el("b", {}, r.label), ` · ${MODE[r.mode] || r.mode}`)))
						: el("p", { class: "dim" }, "No scripture in this line."));
				}
				if (ev === "chunk") live.en += d.text;
				if (ev === "caption") live.captions[d.lang] = d.text;
				if (ev === "step") {
					addStep(d);
					if (!d.error) { usd += d.usd; priced = priced && d.priced; }
				}
				if (ev === "line") {
					svc.lines = [...(svc.lines || []), d];
					live = null;
					const g = Object.entries(d.guard || {});
					agentCard("guard", "Scripture guard", "hook on each translator", g.length
						? el("div", {}, g.map(([code, v]) => el("p", {}, el("b", {}, nameOf(code)), v === "flagged" ? ": still off after a retry, flagged." : ": sent back once; the retry quoted the Bible.")))
						: el("p", { class: "dim" }, (d.refs || []).some((r) => r.mode === "quoted") ? "Every caption quoted the Bible text first time." : "No passage read aloud, nothing to enforce."));
					if (!d.dry_run) agentCard("judge", "Judge", "layer 2", el("div", {},
						LANGS.slice(1).map((x) => el("p", {}, el("b", {}, x.name), `: ${d.judge?.[x.code]?.score || "—"}/5`,
							d.judge?.[x.code]?.note ? el("span", { class: "dim" }, ` · ${d.judge[x.code].note}`) : null))));
					ok = true;
				}
				if (ev === "error") throw new Error(d.message);
				if (["chunk", "caption", "scripture"].includes(ev)) renderSpeaker();
			},
		});
		$("#sc-cost").textContent = dry ? "dry run" : priced ? fmtUSD(usd) : "cost —";
	} catch (e) {
		live = null;
		fill($("#sc-error"), el("div", { class: "notice notice-err" }, e.message));
	} finally {
		setBusy(false);
	}
	return ok;
}

async function nextSample() {
	const sample = cfg?.sample || [];
	if (sampleAt >= sample.length) return false;
	const line = sample[sampleAt];
	$("#sc-text").value = line;
	const ok = await caption(line);
	if (ok) { sampleAt++; saveSample(); renderSpeaker(); }
	return ok;
}

let playing = false;
async function playSermon() {
	if (playing) { playing = false; $("#sc-play").textContent = "Play the sample sermon"; return; }
	playing = true;
	$("#sc-play").textContent = "Stop";
	$("#sc-play").disabled = false;
	while (playing && (await nextSample())) {
		await new Promise((r) => setTimeout(r, 1200));
	}
	playing = false;
	$("#sc-play").textContent = "Play the sample sermon";
	renderSpeaker();
}

function save() { try { localStorage.setItem(STORE, svc.id); } catch {} }
function saveSample() { try { localStorage.setItem(`${STORE}-at-${svc.id}`, String(sampleAt)); } catch {} }

$("#sc-send").addEventListener("click", async () => { if (await caption($("#sc-text").value)) $("#sc-text").value = ""; });
$("#sc-text").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) $("#sc-send").click(); });
$("#sc-next").addEventListener("click", nextSample);
$("#sc-play").addEventListener("click", playSermon);
$("#sc-copy").addEventListener("click", async () => {
	try { await navigator.clipboard.writeText(followLink()); $("#sc-copy").textContent = "Copied"; } catch { $("#sc-follow").select(); }
	setTimeout(() => ($("#sc-copy").textContent = "Copy link"), 1500);
});
$("#sc-new").addEventListener("click", async () => {
	if (busy || !confirm("Open a new service? The follow link changes too.")) return;
	svc = await api(C, { method: "POST" });
	sampleAt = 0;
	save();
	renderSpeaker();
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
	if (!(await checkApi($("#api-status")))) return;
	try { cfg = await api(`${C}/config`); } catch {}
	if (followId) return bootFollower();
	try {
		const loom = await api("/api/loom/config");
		fill(modelSelect, ["anthropic", "openai"].map((p) => el("optgroup", { label: p === "anthropic" ? "Anthropic" : "OpenAI" },
			loom.models.filter((m) => m.provider === p).map((m) =>
				el("option", { value: `${m.provider}/${m.id}` }, m.input_per_1m ? `${m.label} · $${m.input_per_1m}/$${m.output_per_1m} per 1M` : m.label)))));
		try {
			const saved = sessionStorage.getItem("loom-model");
			if (saved) modelSelect.value = saved;
		} catch {}
	} catch {}
	if (cfg?.house) {
		keyInput.placeholder = "Optional: the demo's key runs your first lines";
		$("#key-note").textContent = `No key needed: your first ${cfg.house_per_visitor} lines a day run on the demo's key (${cfg.house_model}). Bring your own key for more; it goes with each request, is used for that line only and is never stored. A line is six model calls, plus a retry when the guard sends one back.`;
	}
	persist();
	langTabs($("#sc-langs"), renderSpeaker);
	let id = null;
	try { id = localStorage.getItem(STORE); } catch {}
	try { svc = id ? await api(`${C}/${id}`) : null; } catch { svc = null; }
	if (!svc || !svc.owner) {
		svc = await api(C, { method: "POST" });
		save();
	}
	try { sampleAt = +localStorage.getItem(`${STORE}-at-${svc.id}`) || 0; } catch {}
	renderSpeaker();
}

boot();
mountFeedback("captions");
