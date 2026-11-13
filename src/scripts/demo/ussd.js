import { el, $, api, url, API, mountFeedback, checkApi } from "./common.js";

const CODE = "*384#";
const screen = $("#screen");
const keypad = $("#keypad");

// A fake Kenyan number, kept per browser so your loan follows you between calls.
const msisdn = (() => {
	try {
		const saved = localStorage.getItem("ussd-msisdn");
		if (saved && /^2547\d{8}$/.test(saved)) return saved;
	} catch {}
	const n = "2547" + Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b % 10).join("");
	try { localStorage.setItem("ussd-msisdn", n); } catch {}
	return n;
})();
$("#msisdn").textContent = `Your number: +${msisdn.slice(0, 3)} ${msisdn.slice(3, 6)} ${msisdn.slice(6, 9)} ${msisdn.slice(9)}`;

const state = {
	mode: "dialer", // dialer | session
	digits: "",
	sessionId: null,
	message: "",
	reply: "",
	ended: false,
	busy: false,
	log: [],
};

// ---------------------------------------------------------------------------
// Screen rendering
// ---------------------------------------------------------------------------

function render() {
	const status = el("div", { class: "lcd-status" }, el("span", {}, "QuickTel"), el("span", {}, "▂▄▆ 3G"));
	let body;
	if (state.mode === "dialer") {
		body = el("div", { class: "dialer" },
			el("div", { class: "dial-digits" }, state.digits || " "),
			el("div", { class: "dial-hint" }, state.digits ? "Press the green key to call" : `Dial ${CODE}`),
		);
	} else {
		body = el("div", { class: "ussd" },
			el("div", { class: "ussd-msg" }, state.message),
			state.ended ? null : el("div", { class: "ussd-reply" }, state.reply),
			el("div", { class: "ussd-actions" },
				el("span", {}, state.ended ? "" : "Cancel"),
				el("span", {}, state.ended ? "OK" : "Send"),
			),
		);
	}
	screen.replaceChildren(...[status, body, state.busy ? el("div", { class: "ussd-busy" }, "Running USSD code…") : null].filter(Boolean));
}

// ---------------------------------------------------------------------------
// Keypad
// ---------------------------------------------------------------------------

const keys = [
	["1", ""], ["2", "abc"], ["3", "def"], ["4", "ghi"], ["5", "jkl"], ["6", "mno"],
	["7", "pqrs"], ["8", "tuv"], ["9", "wxyz"], ["*", ""], ["0", "+"], ["#", ""],
];
for (const [k, letters] of keys) {
	keypad.append(el("button", { type: "button", class: "key", dataset: { key: k }, "aria-label": k, onclick: () => press(k) },
		el("b", {}, k), el("small", {}, letters || " ")));
}
keypad.append(
	el("button", { type: "button", class: "key key-call", dataset: { key: "Enter" }, "aria-label": "Call or send", onclick: () => press("Enter") }, el("b", {}, "✆"), el("small", {}, "send")),
	el("button", { type: "button", class: "key key-del", dataset: { key: "Backspace" }, "aria-label": "Delete", onclick: () => press("Backspace") }, el("b", {}, "⌫"), el("small", {}, "del")),
	el("button", { type: "button", class: "key key-end", dataset: { key: "Escape" }, "aria-label": "End call", onclick: () => press("Escape") }, el("b", {}, "✕"), el("small", {}, "end")),
);

document.addEventListener("keydown", (e) => {
	if (e.target.closest("textarea, input, select")) return;
	const k = e.key;
	if (/^[0-9*#]$/.test(k) || k === "Enter" || k === "Backspace" || k === "Escape") {
		e.preventDefault();
		const btn = keypad.querySelector(`[data-key="${CSS.escape(k)}"]`);
		btn?.classList.add("pressed");
		setTimeout(() => btn?.classList.remove("pressed"), 90);
		press(k);
	}
});

function press(k) {
	if (state.busy) return;
	if (state.mode === "dialer") {
		if (k === "Enter") return call();
		if (k === "Backspace") state.digits = state.digits.slice(0, -1);
		else if (k === "Escape") state.digits = "";
		else if (state.digits.length < 20) state.digits += k;
		return render();
	}
	// In a USSD session
	if (state.ended) {
		if (k === "Enter" || k === "Escape") hangUp();
		return;
	}
	if (k === "Enter") return send();
	if (k === "Escape") return hangUp();
	if (k === "Backspace") state.reply = state.reply.slice(0, -1);
	else if (state.reply.length < 40) state.reply += k;
	render();
}

function hangUp() {
	Object.assign(state, { mode: "dialer", digits: "", sessionId: null, message: "", reply: "", ended: false });
	render();
}

async function call() {
	if (state.digits !== CODE) {
		Object.assign(state, { mode: "session", message: state.digits.endsWith("#")
			? `Unknown service code ${state.digits}.\nTry ${CODE}.` : "Connection problem or invalid MMI code.", ended: true });
		return render();
	}
	state.sessionId = crypto.randomUUID();
	state.log = [];
	Object.assign(state, { mode: "session", message: "", reply: "", ended: false });
	await exchange("");
}

async function send() {
	const input = state.reply;
	state.reply = "";
	await exchange(input);
}

async function exchange(input) {
	state.busy = true;
	render();
	const body = { session_id: state.sessionId, msisdn, input };
	if ($("#use-custom").checked) {
		try {
			body.menu = JSON.parse($("#menu-json").value);
		} catch (e) {
			state.busy = false;
			Object.assign(state, { message: "Your menu JSON doesn't parse:\n" + e.message, ended: true });
			switchTab("menu");
			return render();
		}
	}
	try {
		const res = await api("/api/ussd/dial", { method: "POST", body });
		Object.assign(state, { message: res.message, ended: res.end_session });
		inspect(res, input);
	} catch (err) {
		Object.assign(state, { message: err.message, ended: true });
		if (err.data?.report) {
			showReport(err.data.report);
			switchTab("menu");
		}
	} finally {
		state.busy = false;
		render();
	}
}

// ---------------------------------------------------------------------------
// Inspector
// ---------------------------------------------------------------------------

function inspect(res, input) {
	$("#session-empty").hidden = true;
	$("#session-view").hidden = false;
	const s = res.session || {};
	$("#cur-screen").textContent = s.current_screen || "—";
	$("#timing").textContent = `${res.elapsed_us} µs in the framework`;
	$("#menu-mode").textContent = $("#use-custom").checked ? "your menu" : "default menu";
	$("#path").replaceChildren(
		...(s.visited_screens || []).flatMap((n) => [el("span", {}, n), " → "]),
		el("span", { class: "cur" }, s.current_screen || ""),
	);
	$("#data").textContent = JSON.stringify(s.data || {}, null, 2);
	$("#gateway-str").textContent = res.gateway;
	state.log.unshift({ input, screen: s.current_screen, end: res.end_session });
	$("#log").replaceChildren(...state.log.slice(0, 30).map((l) =>
		el("li", {}, el("span", {}, l.input === "" ? "(dial)" : JSON.stringify(l.input)), el("span", {}, "→ " + (l.screen || "?") + (l.end ? "  [END]" : "")))));
	if (res.warnings?.length) showReport({ errors: [], warnings: res.warnings });
}

function showReport(r) {
	const host = $("#menu-report");
	const items = [
		...(r.errors || []).map((e) => el("li", {}, "✕ ", e)),
		...(r.warnings || []).map((w) => el("li", { class: "dim" }, "! ", w)),
	];
	host.replaceChildren(items.length
		? el("div", { class: r.errors?.length ? "notice notice-err" : "notice notice-warn" }, el("ul", { class: "list-plain stack", style: "--gap:4px" }, items))
		: el("div", { class: "notice" }, "✓ The menu is valid."));
}

// Tabs
function switchTab(name) {
	document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
	document.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== name));
}
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));

// Menu editor
let defaultMenu = "";
async function loadMenu() {
	const res = await fetch(url("/api/ussd/menu"), { credentials: "include" });
	defaultMenu = await res.text();
	let saved = null;
	try { saved = sessionStorage.getItem("ussd-menu"); } catch {}
	$("#menu-json").value = saved || defaultMenu;
}
$("#menu-json").addEventListener("input", () => { try { sessionStorage.setItem("ussd-menu", $("#menu-json").value); } catch {} });
$("#reset-menu").addEventListener("click", () => {
	$("#menu-json").value = defaultMenu;
	try { sessionStorage.removeItem("ussd-menu"); } catch {}
	$("#menu-report").replaceChildren();
});
$("#validate").addEventListener("click", async () => {
	let menu;
	try { menu = JSON.parse($("#menu-json").value); } catch (e) {
		return showReport({ errors: ["JSON: " + e.message], warnings: [] });
	}
	try { showReport(await api("/api/ussd/validate", { method: "POST", body: menu })); }
	catch (e) { showReport({ errors: [e.message], warnings: [] }); }
});

async function loadFunctions() {
	try {
		const list = await api("/api/ussd/functions");
		$("#functions").replaceChildren(...list.map((f) =>
			el("li", {}, el("p", { class: "mono", style: "font-size:.82rem" }, f.name), el("p", { class: "dim", style: "font-size:.85rem" }, f.description))));
	} catch {}
}

$("#curl").textContent =
	`curl -s ${API}/api/ussd/africastalking \\\n` +
	`  -d sessionId=my-session-1 --data-urlencode phoneNumber=+${msisdn} \\\n` +
	`  -d networkCode=63902 --data-urlencode serviceCode='${CODE}' -d text=`;

render();
loadMenu();
loadFunctions();
mountFeedback("ussd");

checkApi($("#api-status"));
