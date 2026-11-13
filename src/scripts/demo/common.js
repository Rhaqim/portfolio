// Shared helpers for the /demo pages. The pages are served by the portfolio;
// every call goes cross-origin to the demo API on the Hetzner box (through
// Cloudflare), with the visitor's sandbox cookie.
import { demo } from "../../data/site";

export const API = (import.meta.env.PUBLIC_DEMO_API || demo.api).replace(/\/$/, "");

/** Create an element. attrs: props, "on*" listeners, "class", "dataset". */
export function el(tag, attrs = {}, ...children) {
	const node = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs || {})) {
		if (v == null || v === false) continue;
		if (k === "class") node.className = v;
		else if (k === "dataset") Object.assign(node.dataset, v);
		else if (k === "value") node.value = v;
		else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
		else if (k in node && typeof v !== "string") node[k] = v;
		else node.setAttribute(k, v === true ? "" : v);
	}
	for (const c of children.flat(Infinity)) {
		if (c == null || c === false) continue;
		node.append(c instanceof Node ? c : document.createTextNode(String(c)));
	}
	return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);

/** Absolute URL for an API path, for <img src> and links. */
export const url = (path) => API + path;

/** JSON request to the demo API. Throws an Error carrying the server's message. */
export async function api(path, { method = "GET", body, headers = {}, form } = {}) {
	const opts = { method, headers: { ...headers }, credentials: "include" };
	if (form) opts.body = form;
	else if (body !== undefined) {
		opts.body = JSON.stringify(body);
		opts.headers["Content-Type"] = "application/json";
	}
	let res;
	try {
		res = await fetch(API + path, opts);
	} catch {
		throw new Error("Couldn't reach the demo server. It may be restarting; try again in a minute.");
	}
	const text = await res.text();
	let data = null;
	try { data = text ? JSON.parse(text) : null; } catch { data = text; }
	if (!res.ok) {
		const err = new Error((data && data.error) || `Request failed (${res.status})`);
		err.status = res.status;
		err.data = data;
		throw err;
	}
	return data;
}

/**
 * POST and read a server-sent-event stream. EventSource can't send a body or
 * headers, so this parses the stream from fetch. Errors thrown by onEvent
 * propagate, so an "error" event ends the stream.
 */
export async function stream(path, { body, headers = {}, signal, onEvent }) {
	let res;
	try {
		res = await fetch(API + path, {
			method: "POST", credentials: "include", signal,
			headers: { "Content-Type": "application/json", ...headers },
			body: JSON.stringify(body),
		});
	} catch (e) {
		if (e.name === "AbortError") throw e;
		throw new Error("Couldn't reach the demo server. Check your connection.");
	}
	if (!res.ok || !res.body) {
		let msg = `Request failed (${res.status})`;
		try { msg = (await res.json()).error || msg; } catch {}
		throw new Error(msg);
	}
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buf = "";
	for (;;) {
		const { value, done } = await reader.read();
		if (done) break;
		buf += decoder.decode(value, { stream: true });
		let idx;
		while ((idx = buf.indexOf("\n\n")) >= 0) {
			const raw = buf.slice(0, idx);
			buf = buf.slice(idx + 2);
			let event = "message", data = "";
			for (const line of raw.split("\n")) {
				if (line.startsWith("event: ")) event = line.slice(7);
				else if (line.startsWith("data: ")) data += line.slice(6);
			}
			let parsed = null;
			try { parsed = data ? JSON.parse(data) : null; } catch { continue; }
			onEvent(event, parsed);
		}
	}
}

/**
 * Subscribe to a long-lived event stream (a game room). EventSource
 * reconnects by itself and resends the last event id, so the server replays
 * only what was missed.
 */
export function watch(path, handlers) {
	const es = new EventSource(API + path, { withCredentials: true });
	for (const [name, fn] of Object.entries(handlers)) {
		if (name === "open" || name === "error") es.addEventListener(name, fn);
		else es.addEventListener(name, (e) => { try { fn(JSON.parse(e.data)); } catch (err) { console.error(err); } });
	}
	return es;
}

/** Show a notice in `host` if the API is unreachable. Resolves to true when up. */
export async function checkApi(host) {
	try {
		const res = await fetch(API + "/api/health", { credentials: "include" });
		if (res.ok) return true;
	} catch {}
	if (host) host.replaceChildren(el("div", { class: "notice notice-err api-down" },
		"The demo server isn't answering right now. It may be mid-deploy; try again in a minute."));
	return false;
}

export function fmtBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function fmtUSD(n) {
	if (!n) return "$0";
	if (n < 0.01) return `$${n.toFixed(4)}`;
	return `$${n.toFixed(3)}`;
}

export function timeLeft(iso) {
	const ms = new Date(iso) - Date.now();
	if (ms <= 0) return "expiring";
	const m = Math.round(ms / 60000);
	return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

/** Render the shared "tell me what you think" form into #feedback. */
export function mountFeedback(demoName) {
	const host = document.getElementById("feedback");
	if (!host) return;
	let rating = 0;
	const status = el("p", { class: "dim", role: "status", "aria-live": "polite" });
	const stars = [1, 2, 3, 4, 5].map((n) =>
		el("button", {
			type: "button", class: "star", "aria-label": `${n} out of 5`, "aria-pressed": "false",
			onclick: () => {
				rating = rating === n ? 0 : n;
				stars.forEach((s, i) => s.setAttribute("aria-pressed", String(i < rating)));
			},
		}, "★"),
	);
	const message = el("textarea", { class: "textarea prose", rows: 4, maxLength: 4000, placeholder: "What worked, what broke, what you'd use it for…" });
	const contact = el("input", { class: "input", maxLength: 200, placeholder: "Email or @handle, if you'd like a reply" });
	const honeypot = el("input", { class: "honeypot", tabIndex: -1, autocomplete: "off", "aria-hidden": "true", name: "website" });
	const send = el("button", { type: "submit", class: "btn btn-primary" }, "Send");

	const form = el("form", {
		class: "stack",
		onsubmit: async (e) => {
			e.preventDefault();
			send.disabled = true;
			status.textContent = "Sending…";
			try {
				await api("/api/feedback", { method: "POST", body: {
					demo: demoName, rating, message: message.value, contact: contact.value, website: honeypot.value,
				} });
				form.replaceChildren(el("p", {}, "Thank you. I read every one of these."));
			} catch (err) {
				status.textContent = err.message;
				send.disabled = false;
			}
		},
	},
		el("div", { class: "field" }, el("span", {}, "How was it?"), el("div", { class: "stars" }, stars)),
		el("label", { class: "field" }, el("span", {}, "Thoughts"), message),
		el("label", { class: "field" }, el("span", {}, "Contact (optional)"), contact),
		honeypot,
		el("div", { class: "row" }, send, status),
	);

	host.className = "demo-feedback";
	host.replaceChildren(el("div", { class: "wrap feedback-inner" },
		el("div", {},
			el("p", { class: "eyebrow" }, "Feedback"),
			el("h2", { style: "font-size:1.5rem;margin-top:10px;letter-spacing:-.02em" }, "Tried it? Tell me what you think."),
			el("p", { class: "lede" }, "Bugs, rough edges, ideas, or how you'd use it. It goes straight to me. Nothing else is collected."),
		),
		form,
	));
}

/** Wire up [role=tab] buttons with data-tab to [data-pane] siblings. */
export function tabs(root = document, onSwitch) {
	const all = [...root.querySelectorAll(".tab[data-tab]")];
	const show = (name) => {
		all.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
		root.querySelectorAll("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== name));
		onSwitch?.(name);
	};
	all.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
	return show;
}
