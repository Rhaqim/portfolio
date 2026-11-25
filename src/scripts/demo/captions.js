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
// Streams still open: a line's stream outlives its caption while the judge
// scores it, so the next sample line can overlap the last one's judge.
const inflight = new Set();

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
		judge: (d) => { const l = lines.find((x) => x.n === d.n); if (l) l.judge = d.judge; },
	});
}

// ---------------------------------------------------------------------------
// Speaker: the agent graph, models and keys
// ---------------------------------------------------------------------------
//
// The page draws the graph the server runs (config.graph, from the same Go
// builder) and lets the speaker run every agent on one model and key, or pick
// a model per agent with a key per provider. Keys go with each request only.

const keyInput = $("#key"), modelSelect = $("#model"), remember = $("#remember");
const providerKeys = { anthropic: $("#key-anthropic"), openai: $("#key-openai") };
let mode = "one"; // "one" | "per"
let agentModels = {}; // agent slug → "provider/model"
let models = []; // from /api/loom/config
let nodeState = {}; // graph node id → started | done | failed | skipped
let agentModes = {}; // agent slug → { mode, model } from the last run

const SS = (k, v) => { try { v === undefined ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch {} };
const GS = (k) => { try { return sessionStorage.getItem(k); } catch { return null; } };

function restoreKeys() {
	const saved = GS("loom-key");
	if (saved) { keyInput.value = saved; remember.checked = true; }
	for (const [p, input] of Object.entries(providerKeys)) {
		const v = GS(`loom-key-${p}`);
		if (v) { input.value = v; remember.checked = true; }
	}
	mode = GS("sc-mode") === "per" ? "per" : "one";
	try { agentModels = JSON.parse(GS("sc-agent-models") || "{}"); } catch { agentModels = {}; }
}

const graphAgents = () => (cfg?.graph?.nodes || []).filter((n) => n.agent);
const modelLabel = (id) => models.find((m) => `${m.provider}/${m.id}` === id)?.label || id;
const providerOf = (id) => (id || "").split("/")[0];

function persist() {
	const keep = remember.checked;
	SS("loom-key", keep && keyInput.value ? keyInput.value : undefined);
	for (const [p, input] of Object.entries(providerKeys)) SS(`loom-key-${p}`, keep && input.value ? input.value : undefined);
	SS("loom-model", modelSelect.value);
	SS("sc-mode", mode);
	SS("sc-agent-models", JSON.stringify(agentModels));
	const chip = $("#mode-chip");
	const live = mode === "one" ? !!keyInput.value.trim() : graphAgents().some((a) => providerKeys[providerOf(agentModels[a.agent])]?.value.trim());
	chip.textContent = live ? (mode === "one" ? modelSelect.selectedOptions[0]?.textContent.split(" ·")[0] || "Live" : "Your keys") : cfg?.house ? `Demo key · ${cfg.house_model}` : "Dry run";
	chip.className = live || cfg?.house ? "chip chip-red" : "chip";
	drawGraph();
}

// assignment says what each agent will run on, for the diagram.
function assignment(agent) {
	if (busy && agentModes[agent]) return agentModes[agent].model;
	if (mode === "one") {
		if (keyInput.value.trim()) return modelLabel(modelSelect.value);
		return cfg?.house ? `${cfg.house_model} · demo key` : "dry run";
	}
	const m = agentModels[agent] || modelSelect.value;
	return providerKeys[providerOf(m)]?.value.trim() ? modelLabel(m) : `${modelLabel(m)} · dry run`;
}

function setMode(m) {
	mode = m;
	for (const t of document.querySelectorAll("#sc-model-mode .tab")) t.setAttribute("aria-selected", String(t.dataset.mode === m));
	$("#sc-one").hidden = m !== "one";
	$("#sc-per").hidden = m !== "per";
	persist();
}

function renderAgentModels() {
	fill($("#sc-agent-models"), graphAgents().flatMap((a) => {
		const sel = el("select", { class: "select", id: `model-${a.agent}`, onchange: (e) => { agentModels[a.agent] = e.target.value; persist(); } },
			[...modelSelect.cloneNode(true).children]);
		sel.value = agentModels[a.agent] || modelSelect.value;
		agentModels[a.agent] = sel.value;
		return [el("label", { for: `model-${a.agent}` }, a.label), sel];
	}));
}

const SVGNS = "http://www.w3.org/2000/svg";
function svg(tag, attrs = {}, ...kids) {
	const n = document.createElementNS(SVGNS, tag);
	for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
	for (const c of kids.flat()) if (c != null) n.append(c instanceof Node ? c : document.createTextNode(String(c)));
	return n;
}

// drawGraph lays the graph out top-down by depth (longest path from the
// start) and marks each node with what it runs on and how far it has got.
function drawGraph() {
	const g = cfg?.graph;
	if (!g) return;
	const depth = {};
	for (const n of g.nodes) depth[n.id] = 0;
	for (let i = 0; i < g.nodes.length; i++) for (const [a, b] of g.edges) depth[b] = Math.max(depth[b], depth[a] + 1);
	const rows = {};
	for (const n of g.nodes) (rows[depth[n.id]] ??= []).push(n);
	const W = 620, BW = 168, BH = 44, RH = 74, top = 16;
	const pos = {};
	for (const [d, list] of Object.entries(rows)) {
		const gap = Math.min(BW + 22, (W - 20) / list.length);
		const x0 = W / 2 - (gap * (list.length - 1)) / 2;
		list.forEach((n, i) => (pos[n.id] = { x: x0 + i * gap, y: top + +d * RH }));
	}
	const H = top + Object.keys(rows).length * RH;
	const edges = g.edges.map(([a, b]) => {
		const p = pos[a], q = pos[b];
		const y1 = p.y + BH, y2 = q.y, my = (y1 + y2) / 2;
		return svg("path", { class: "edge", d: `M${p.x} ${y1} C${p.x} ${my} ${q.x} ${my} ${q.x} ${y2 - 4}`, "marker-end": "url(#sc-arrow)" });
	});
	const nodes = g.nodes.map((n) => {
		const p = pos[n.id];
		const sub = n.agent ? assignment(n.agent) : n.kind === "func" ? "Go function" : "";
		const cls = `node ${n.agent ? "agent" : "func"} ${nodeState[n.id] || ""}`;
		const grp = svg("g", { class: cls, transform: `translate(${p.x - BW / 2} ${p.y})`, tabindex: n.agent ? "0" : null, role: n.agent ? "button" : null,
			"aria-label": n.agent ? `${n.label}: ${sub}. Choose its model.` : null },
			svg("title", {}, n.agent ? `${n.agent} · ${sub}` : n.label),
			svg("rect", { width: BW, height: BH, rx: 2 }),
			svg("text", { x: 10, y: 18 }, n.label),
			svg("text", { x: 10, y: 34, class: "sub" }, sub.length > 26 ? sub.slice(0, 25) + "…" : sub));
		if (n.agent) {
			const pick = () => { setMode("per"); const s = $(`#model-${n.agent}`); s?.focus(); };
			grp.addEventListener("click", pick);
			grp.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
		}
		return grp;
	});
	fill($("#sc-graph"), svg("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "How one caption line runs: the English caption and the detector start together, the Bible lookup follows the detector, the three translators start once both are done, the line goes on screen, then the judge scores it." },
		svg("defs", {}, svg("marker", { id: "sc-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto" },
			svg("path", { d: "M0 0L10 5L0 10z", fill: "var(--fg-dim)" }))),
		edges, nodes));
}

for (const input of [keyInput, ...Object.values(providerKeys)]) input.addEventListener("input", persist);
remember.addEventListener("change", persist);
modelSelect.addEventListener("change", persist);
for (const t of document.querySelectorAll("#sc-model-mode .tab")) t.addEventListener("click", () => setMode(t.dataset.mode));

function headers() {
	if (mode === "one") return keyInput.value.trim() ? { "X-LLM-Key": keyInput.value.trim(), "X-LLM-Model": modelSelect.value } : {};
	const h = {};
	if (providerKeys.anthropic.value.trim()) h["X-LLM-Key-Anthropic"] = providerKeys.anthropic.value.trim();
	if (providerKeys.openai.value.trim()) h["X-LLM-Key-OpenAI"] = providerKeys.openai.value.trim();
	return h;
}

function lineBody(text) {
	return mode === "per" ? { text, models: { ...agentModels } } : { text };
}

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
	$("#sc-stop").hidden = !busy && !playing && !inflight.size;
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
	const roles = { detect: "in parallel with the caption", caption: "streams at once", judge: "after the line is on screen" };
	const role = roles[s.role] || "after caption + lookup";
	$("#sc-steps").append(el("li", {},
		el("div", { class: "step-top" }, el("b", {}, s.agent.replace(/^sc-/, "")), el("span", { class: "r" }, role),
			el("span", { class: "c" }, s.error ? `failed${s.wall_ms ? ` after ${secs(s.wall_ms)}` : ""}` : [
				s.wall_ms ? secs(s.wall_ms) : secs(s.duration_ms || 0),
				s.first_token_ms ? `first word ${secs(s.first_token_ms)}` : null,
				`${s.input_tokens}→${s.output_tokens} tok${s.reasoning_tokens ? ` (${s.reasoning_tokens} thinking)` : ""}`,
				s.priced ? fmtUSD(s.usd) : "—",
			].filter(Boolean).join(" · "))),
		s.error ? el("p", { class: "notice notice-err", style: "margin-top:6px" }, s.error) : el("details", {},
			el("summary", {}, "prompt & output"),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Rendered prompt"), el("pre", { class: "code" }, s.prompt),
			el("p", { class: "eyebrow", style: "margin-top:8px" }, "Output"), el("pre", { class: "code" }, s.output))));
}

// ---------------------------------------------------------------------------
// Where the time went: every node on the line's clock (ms from the request's
// arrival on the server), drawn as a timeline, with the slowest agent named
// and, where the numbers say, why.
// ---------------------------------------------------------------------------

const TL_ROWS = [
	["detect", "detector"], ["caption", "caption"], ["lookup", "lookup"],
	["yo", "Yorùbá"], ["ig", "Igbo"], ["pcm", "Pidgin"], ["judge", "judge"],
];
// All times are ms from the request reaching the server, so they include any
// time queued behind the previous line.
let timing = null; // { waited, offset, nodes: {id: {start, end, kind, first, out, reasoning}}, onScreen, total, guard }
let timingTick = 0;
const secs = (ms) => (ms >= 10000 ? `${Math.round(ms / 1000)}s` : `${(ms / 1000).toFixed(1)}s`);
const serverNow = () => (timing ? performance.now() - timing.offset : 0);

function timingStart() {
	timing = { waited: 0, offset: performance.now(), nodes: {}, onScreen: 0, total: 0, guard: {} };
	clearInterval(timingTick);
	timingTick = setInterval(renderTiming, 250);
	renderTiming();
}

function timingStop() {
	clearInterval(timingTick);
	timingTick = 0;
	if (timing && !timing.total) timing.total = serverNow();
	renderTiming();
}

function timingNode(d) {
	if (!timing || d.at_ms == null) return;
	const n = (timing.nodes[d.node] ||= {});
	if (d.kind === "started") n.start = d.at_ms;
	else { n.end = d.at_ms; n.kind = d.kind; }
	if (d.node === "line" && d.kind === "done") timing.onScreen = d.at_ms;
}

function timingStep(s) {
	if (!timing) return;
	const n = (timing.nodes[s.role] ||= {});
	if (s.start_ms != null && n.start == null) n.start = s.start_ms;
	if (s.first_token_ms) n.first = s.first_token_ms;
	n.out = s.output_tokens || 0;
	n.reasoning = s.reasoning_tokens || 0;
	n.model = agentModes[s.agent]?.model;
}

// why explains a slow agent from what the numbers show.
function whyOf(id, n) {
	const out = [];
	if (n.reasoning && n.out) {
		const pct = Math.round((100 * n.reasoning) / n.out);
		if (pct >= 30) out.push(`${pct}% of its ${n.out} output tokens were hidden reasoning, thinking nobody reads, which ${n.model ? `${n.model}` : "a reasoning model"} spends before it answers`);
	}
	if (n.first && n.end != null && n.start != null && n.first > 0.5 * (n.end - n.start)) out.push(`it took ${secs(n.first)} to send its first word`);
	if (timing.guard[id]) out.push("the scripture guard sent it back once, so it ran twice");
	if (!out.length && n.out > 400) out.push(`it wrote ${n.out} tokens`);
	return out;
}

function renderTiming() {
	const box = $("#sc-timeline"), sum = $("#sc-time-sum");
	if (!timing) return;
	const now = timingTick ? serverNow() : timing.total;
	const span = Math.max(1, timing.total || now, ...Object.values(timing.nodes).map((n) => n.end || 0));
	const left = (ms) => `${Math.max(0, Math.min(100, (ms / span) * 100))}%`;
	const width = (a, b) => `${Math.max(0, ((b - a) / span) * 100)}%`;
	const mark = timing.onScreen ? el("i", { class: "sc-tl-mark", style: `left:${left(timing.onScreen)}`, title: `captions on screen at ${secs(timing.onScreen)}` }) : null;
	// The slowest agent that has finished, by wall time.
	let slow = null, slowMs = 0;
	for (const [id] of TL_ROWS) {
		const n = timing.nodes[id];
		if (id !== "lookup" && n?.start != null && n.end != null && n.end - n.start > slowMs) { slow = id; slowMs = n.end - n.start; }
	}
	const rows = [];
	if (timing.waited > 300) rows.push(el("div", { class: "sc-tl-row" }, el("span", { class: "n", title: "queued behind the previous line's judge" }, "queued"),
		el("div", { class: "sc-tl-track" }, el("i", { class: "sc-tl-bar wait", style: `left:0;width:${width(0, timing.waited)}` }), mark),
		el("span", { class: "t" }, secs(timing.waited))));
	for (const [id, name] of TL_ROWS) {
		const n = timing.nodes[id];
		if (!n || n.start == null) continue;
		const end = n.end ?? now;
		const bars = [];
		// The lighter part is time before any answer: until the first token
		// when the node streams, else the reasoning tokens' share of its run.
		const think = n.first ? n.first : n.reasoning && n.out && n.end != null ? ((end - n.start) * n.reasoning) / n.out : 0;
		const cls = `sc-tl-bar${id === "lookup" ? " func" : ""}${n.end == null ? " running" : ""}${n.kind === "failed" ? " failed" : ""}`;
		bars.push(el("i", { class: cls, style: `left:${left(n.start)};width:${width(n.start, end)}` }));
		if (think > 0) bars.push(el("i", { class: "sc-tl-bar think", style: `left:${left(n.start)};width:${width(0, think)}` }));
		rows.push(el("div", { class: `sc-tl-row${id === slow && !timingTick ? " slow" : ""}` },
			el("span", { class: "n" }, name),
			el("div", { class: "sc-tl-track", title: `${name}: started at ${secs(n.start)}, ${n.end == null ? "running" : `took ${secs(end - n.start)}`}${n.reasoning ? `, ${n.reasoning} reasoning tokens` : ""}` }, bars, mark),
			el("span", { class: "t" }, n.end == null ? "…" : secs(end - n.start))));
	}
	if (rows.length) rows.push(el("div", { class: "sc-tl-legend" },
		el("span", {}, el("i"), "working"), el("span", {}, el("i", { class: "think" }), "before the first word / thinking"),
		el("span", {}, el("i", { class: "mark" }), "on screen"), timing.waited > 300 ? el("span", {}, el("i", { class: "wait" }), "queued") : null));
	fill(box, rows);
	$("#sc-total").textContent = timingTick ? secs(now) : timing.total ? `${secs(timing.total)} total` : "";
	if (timingTick) {
		sum.textContent = timing.onScreen ? `On screen at ${secs(timing.onScreen)}. The judge is still scoring…` : "Agents working…";
		return;
	}
	const parts = [];
	if (timing.onScreen) parts.push(["Captions reached the screen at ", el("b", {}, secs(timing.onScreen)), "."]);
	else parts.push(["This line never reached the screen."]);
	if (timing.waited > 300) parts.push([" It queued ", el("b", {}, secs(timing.waited)), " of that behind the previous line's judge."]);
	const cap = timing.nodes.caption;
	if (cap?.end != null && timing.onScreen) {
		const tr = ["yo", "ig", "pcm"].map((c) => timing.nodes[c]).filter((n) => n?.end != null);
		const slowest = tr.length ? Math.max(...tr.map((n) => n.end - n.start)) : 0;
		parts.push([` The English caption took ${secs(cap.end - cap.start)}, then the translators ran side by side; the slowest took ${secs(slowest)}.`]);
	}
	if (slow) {
		const why = whyOf(slow, timing.nodes[slow]);
		const name = TL_ROWS.find(([id]) => id === slow)[1];
		parts.push([" Slowest agent: ", el("b", {}, `${name}, ${secs(slowMs)}`), why.length ? ` — ${why.join("; ")}.` : "."]);
	}
	fill(sum, parts.flat());
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
	nodeState = {};
	setBusy(true);
	fill($("#sc-error"));
	fill($("#sc-agents"));
	fill($("#sc-steps"));
	$("#sc-status").textContent = "";
	let usd = 0, priced = true, dry = false, lineN = 0;
	// The line resolves this promise as soon as it is on screen; the stream
	// carries on in the background for the judge's scores.
	let shown;
	const ctl = new AbortController();
	inflight.add(ctl);
	timingStart();
	const onScreen = new Promise((r) => (shown = r));
	const run = stream(`${C}/${svc.id}/line`, {
		body: lineBody(text), headers: headers(), signal: ctl.signal,
		onEvent: (ev, d) => {
			if (ev === "session") {
				dry = d.dry_run;
				if (timing) { timing.waited = d.waited_ms || 0; timing.offset = performance.now() - (d.at_ms || 0); }
				agentModes = Object.fromEntries(Object.entries(d.agents || {}).map(([a, v]) => [a, { mode: v.mode, model: v.model }]));
				$("#sc-status").textContent = d.dry_run ? "Dry run: no model is called." : mode === "per" ? "Running each agent on its own model." : `Running on ${d.model}.`;
				drawGraph();
			}
			if (ev === "node") { nodeState[d.node] = d.kind; timingNode(d); drawGraph(); }
			if (ev === "scripture") {
				live && (live.refs = d);
				agentCard("detect", "Detector", "in parallel with the caption", d.length
					? el("div", {}, d.map((r) => el("p", {}, el("b", {}, r.label), ` · ${MODE[r.mode] || r.mode}`)))
					: el("p", { class: "dim" }, "No scripture in this line."));
			}
			if (ev === "chunk" && live) live.en += d.text;
			if (ev === "caption" && live) live.captions[d.lang] = d.text;
			if (ev === "step") {
				timingStep(d);
				addStep(d);
				if (!d.error) { usd += d.usd; priced = priced && d.priced; }
				$("#sc-cost").textContent = dry ? "dry run" : priced ? fmtUSD(usd) : "cost —";
			}
			if (ev === "line") {
				lineN = d.n;
				if (timing) timing.guard = d.guard || {};
				svc.lines = [...(svc.lines || []), d];
				live = null;
				const g = Object.entries(d.guard || {});
				agentCard("guard", "Scripture guard", "hook on each translator", g.length
					? el("div", {}, g.map(([code, v]) => el("p", {}, el("b", {}, nameOf(code)), v === "flagged" ? ": still off after a retry, flagged." : ": sent back once; the retry quoted the Bible.")))
					: el("p", { class: "dim" }, (d.refs || []).some((r) => r.mode === "quoted") ? "Every caption quoted the Bible text first time." : "No passage read aloud, nothing to enforce."));
				if (!d.dry_run) agentCard("judge", "Judge", "after the line is on screen", el("p", { class: "dim" }, "Scoring…"));
				setBusy(false);
				shown(true);
			}
			if (ev === "judge") {
				const line = (svc.lines || []).find((l) => l.n === d.n);
				if (line) line.judge = d.judge;
				if (!dry) agentCard("judge", "Judge", "after the line is on screen", el("div", {},
					LANGS.slice(1).map((x) => el("p", {}, el("b", {}, x.name), `: ${d.judge?.[x.code]?.score || "—"}/5`,
						d.judge?.[x.code]?.note ? el("span", { class: "dim" }, ` · ${d.judge[x.code].note}`) : null))));
				renderHistory();
			}
			if (ev === "done" && timing) timing.total = d.total_ms;
			if (ev === "error") throw new Error(d.message);
			if (["chunk", "caption", "scripture"].includes(ev)) renderSpeaker();
		},
	});
	run.catch((e) => {
		live = null;
		if (e.name === "AbortError") {
			$("#sc-status").textContent = lineN ? "Stopped before the judge finished." : "Stopped. That line wasn't captioned.";
			nodeState = {};
		} else fill($("#sc-error"), el("div", { class: "notice notice-err" }, e.message));
		shown(false);
	}).finally(() => {
		inflight.delete(ctl);
		timingStop();
		agentModes = {};
		if (busy) setBusy(false);
		shown(false);
		drawGraph();
		renderSpeaker();
	});
	return onScreen;
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
// Pause lets the line in flight finish, then stops; Play picks up at the next
// sample line. Stop cancels the line in flight as well, which cancels its
// model calls on the server.
async function playSermon() {
	if (playing) { playing = false; $("#sc-play").textContent = "Resume the sermon"; renderSpeaker(); return; }
	playing = true;
	$("#sc-play").textContent = "Pause after this line";
	$("#sc-play").disabled = false;
	while (playing && (await nextSample())) {
		await new Promise((r) => setTimeout(r, 1200));
	}
	playing = false;
	$("#sc-play").textContent = sampleAt > 0 && sampleAt < (cfg?.sample || []).length ? "Resume the sermon" : "Play the sample sermon";
	renderSpeaker();
}

function stop() {
	playing = false;
	for (const c of inflight) c.abort();
}

function save() { try { localStorage.setItem(STORE, svc.id); } catch {} }
function saveSample() { try { localStorage.setItem(`${STORE}-at-${svc.id}`, String(sampleAt)); } catch {} }

$("#sc-send").addEventListener("click", async () => { if (await caption($("#sc-text").value)) $("#sc-text").value = ""; });
$("#sc-text").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) $("#sc-send").click(); });
$("#sc-next").addEventListener("click", nextSample);
$("#sc-play").addEventListener("click", playSermon);
$("#sc-stop").addEventListener("click", stop);
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
		models = loom.models;
		try {
			const saved = sessionStorage.getItem("loom-model");
			if (saved) modelSelect.value = saved;
		} catch {}
	} catch {}
	restoreKeys();
	renderAgentModels();
	setMode(mode);
	if (cfg?.house) {
		keyInput.placeholder = "Optional: the demo's key runs your first lines";
		$("#key-note").textContent = `No key needed: your first ${cfg.house_per_visitor} lines a day run on the demo's key (${cfg.house_model}). Bring your own keys for more, on one model or a model per agent; they go with each request, are used for that line only and are never stored. A line is six model calls, plus a retry when the guard sends one back; the caption and the detector run together, and the judge scores after the line is on screen.`;
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
