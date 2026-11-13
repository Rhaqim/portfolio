import { el, $, api, url, fmtBytes, timeLeft, mountFeedback, checkApi } from "./common.js";

const B = "/api/buckt";
let tree = null;
let path = []; // folder ids from root to current
let selected = null;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function refresh() {
	try {
		tree = await api(`${B}/tree`);
	} catch (e) {
		toast(e.message, "err");
		return;
	}
	if (!path.length || !findFolder(path[path.length - 1])) path = [tree.root.id];
	render();
	loadEvents();
}

function findFolder(id, f = tree?.root) {
	if (!f) return null;
	if (f.id === id) return f;
	for (const sub of f.folders) {
		const hit = findFolder(id, sub);
		if (hit) return hit;
	}
	return null;
}

function allFolders(f = tree.root, depth = 0, out = []) {
	out.push({ id: f.id, name: depth === 0 ? "/ (sandbox root)" : "  ".repeat(depth) + f.name });
	f.folders.forEach((s) => allFolders(s, depth + 1, out));
	return out;
}

function findFile(id, f = tree.root) {
	const hit = f.files.find((x) => x.id === id);
	if (hit) return hit;
	for (const sub of f.folders) {
		const h = findFile(id, sub);
		if (h) return h;
	}
	return tree.trash.find((x) => x.id === id) || null;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render() {
	const here = findFolder(path[path.length - 1]);

	$("#crumbs").replaceChildren(...path.flatMap((id, i) => {
		const f = findFolder(id);
		const label = i === 0 ? "sandbox" : f?.name;
		const last = i === path.length - 1;
		return [
			i ? el("span", { class: "dim" }, "/") : null,
			last ? el("span", { class: "here" }, label) : el("button", { onclick: () => { path = path.slice(0, i + 1); render(); } }, label),
		];
	}));

	const tiles = [
		...here.folders.map((f) => el("button", { class: "tile tile-folder", onclick: () => { path.push(f.id); render(); } },
			el("div", { class: "tile-thumb" }, "▤"),
			el("div", { class: "tile-meta" }, el("div", { class: "tile-name" }, f.name),
				el("div", { class: "tile-sub" }, el("span", {}, `${f.files.length} files`), el("span", {}, "folder"))))),
		...here.files.map((f) => el("button", {
			class: "tile", "aria-pressed": String(selected === f.id), onclick: () => { selected = f.id; render(); },
		},
			el("div", { class: "tile-thumb" }, f.derivatives
				? el("img", { src: url(`${B}/files/${f.id}/derivatives/thumbnail`), alt: "", loading: "lazy" })
				: kind(f.content_type)),
			el("div", { class: "tile-meta" }, el("div", { class: "tile-name", title: f.name }, f.name),
				el("div", { class: "tile-sub" }, el("span", {}, fmtBytes(f.size)), el("span", {}, f.expires_at ? `⏳ ${timeLeft(f.expires_at)}` : ""))))),
	];
	$("#tiles").replaceChildren(...(tiles.length ? tiles : [el("div", { class: "muted-box", style: "grid-column:1/-1" }, "Empty folder. Upload something.")]));

	$("#trash").replaceChildren(...(tree.trash.length ? tree.trash.map((f) => el("li", {},
		el("span", {}, f.name),
		el("button", { class: "btn btn-sm", onclick: () => act(`${B}/files/${f.id}/restore`, "POST", "Restored to its original folder.") }, "Restore"),
		el("button", { class: "btn btn-sm btn-ghost", onclick: () => act(`${B}/files/${f.id}`, "DELETE", "Deleted for good: blob, derivatives and record.") }, "Delete forever"),
	)) : [el("li", { class: "dim" }, "Nothing in the trash.")]));

	const u = tree.usage;
	$("#usage").textContent = `${u.files}/${u.max_files} files · ${fmtBytes(u.bytes)} of ${fmtBytes(u.max_bytes)}`;
	$("#backend").textContent = tree.backend;
	renderMetrics(tree.metrics);
	renderDetails();
}

function kind(ct) {
	if (ct.startsWith("image/")) return "IMG";
	if (ct === "application/pdf") return "PDF";
	if (ct.startsWith("text/")) return "TXT";
	return "FILE";
}

function renderMetrics(m) {
	const rows = [];
	for (const [backend, ops] of Object.entries(m || {})) {
		for (const [op, s] of Object.entries(ops)) {
			rows.push(el("tr", {}, el("td", {}, `${backend}.${op}`), el("td", {}, s.Count), el("td", {}, s.Errors), el("td", {}, fmtBytes(s.Bytes)),
				el("td", {}, s.Count ? `${(s.TotalDur / s.Count / 1e6).toFixed(2)} ms` : "—")));
		}
	}
	$("#metrics").replaceChildren(
		el("thead", {}, el("tr", {}, ["op", "count", "errors", "bytes", "mean"].map((h) => el("th", {}, h)))),
		el("tbody", {}, rows.length ? rows : el("tr", {}, el("td", { colspan: 5, class: "dim" }, "No backend calls yet."))),
	);
}

function renderDetails() {
	const host = $("#details");
	const f = selected && findFile(selected);
	if (!f) {
		host.replaceChildren(el("p", { class: "dim" }, "Pick a file to see its record: hash, metadata, expiry and derivatives."));
		return;
	}
	const inTrash = tree.trash.some((x) => x.id === f.id);
	const raw = url(`${B}/files/${f.id}/raw`);
	const md = el("textarea", { class: "textarea", rows: 3, placeholder: "key=value, one per line" });
	md.value = Object.entries(f.metadata || {}).map(([k, v]) => `${k}=${v}`).join("\n");
	const move = el("select", { class: "select" }, allFolders().map((o) => el("option", { value: o.id }, o.name)));

	host.replaceChildren(
		f.content_type.startsWith("image/") ? el("div", { class: "preview" },
			el("img", { src: f.derivatives ? url(`${B}/files/${f.id}/derivatives/medium`) : raw, alt: f.name })) : null,
		el("dl", { class: "kv" },
			el("dt", {}, "name"), el("dd", {}, f.name),
			el("dt", {}, "type"), el("dd", {}, f.content_type),
			el("dt", {}, "size"), el("dd", {}, fmtBytes(f.size)),
			el("dt", {}, "hash"), el("dd", { class: "mono" }, f.hash + "…"),
			el("dt", {}, "expires"), el("dd", {}, f.expires_at ? `in ${timeLeft(f.expires_at)}` : "never"),
			el("dt", {}, "derivatives"), el("dd", {}, f.derivatives
				? el("span", {}, el("a", { href: url(`${B}/files/${f.id}/derivatives/thumbnail`), target: "_blank" }, "thumbnail (240px)"), " · ",
					el("a", { href: url(`${B}/files/${f.id}/derivatives/medium`), target: "_blank" }, "medium (960px)"))
				: f.content_type.match(/png|jpeg/) ? "generating…" : "none for this type"),
		),
		el("div", { class: "row", style: "margin-top:12px" },
			el("a", { class: "btn btn-sm", href: raw, target: "_blank" }, "Open original"),
			inTrash ? null : el("button", { class: "btn btn-sm", onclick: () => act(`${B}/files/${f.id}`, "DELETE", "Moved to the trash. Restore it from below.") }, "Move to trash"),
		),
		inTrash ? null : el("div", { class: "stack", style: "margin-top:16px" },
			el("label", { class: "field" }, el("span", {}, "Metadata"), md),
			el("button", { class: "btn btn-sm", onclick: () => saveMetadata(f.id, md.value) }, "Save metadata"),
			el("label", { class: "field" }, el("span", {}, "Move to"), move),
			el("button", { class: "btn btn-sm", onclick: () => act(`${B}/files/${f.id}/move`, "POST", "Moved.", { folder_id: move.value }) }, "Move"),
		),
	);
}

async function loadEvents() {
	try {
		const evs = await api(`${B}/events`);
		$("#events").replaceChildren(...(evs.length ? evs.slice(0, 14).map((e) => el("li", {},
			el("span", { class: "t" }, e.type),
			el("span", { class: "n", title: e.name }, e.name),
			el("span", { class: "w" }, `${new Date(e.time).toLocaleTimeString()} · ${fmtBytes(e.size)}${e.hash ? " · " + e.hash.slice(0, 10) : ""}`),
		)) : [el("li", { class: "dim" }, "Events appear as you upload, trash and restore.")]));
	} catch {}
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function toast(msg, tone = "") {
	$("#toast").replaceChildren(el("div", { class: `notice ${tone === "err" ? "notice-err" : tone === "warn" ? "notice-warn" : ""}` }, msg));
}

async function act(url, method, ok, body) {
	try {
		await api(url, { method, body });
		toast(ok);
	} catch (e) {
		toast(e.message, "err");
	}
	await refresh();
}

async function saveMetadata(id, text) {
	const md = {};
	for (const line of text.split("\n")) {
		const i = line.indexOf("=");
		if (i > 0) md[line.slice(0, i).trim()] = line.slice(i + 1).trim();
	}
	await act(`${B}/files/${id}/metadata`, "PUT", "Metadata saved on the file record.", md);
}

async function upload(files) {
	const folder = path[path.length - 1];
	const notes = [];
	for (const file of files) {
		const form = new FormData();
		form.append("folder_id", folder);
		form.append("file", file);
		try {
			const res = await api(`${B}/files`, { method: "POST", form });
			notes.push(res.deduplicated
				? `${file.name}: identical bytes already in this folder, so buckt returned the existing file and stored nothing new.`
				: `${file.name}: stored.`);
			selected = res.id;
		} catch (e) {
			notes.push(`${file.name}: ${e.message}`);
		}
	}
	toast(notes.join(" "), notes.some((n) => /Rejected|full|5 MB/.test(n)) ? "warn" : "");
	await refresh();
	// Derivatives are generated asynchronously; check back shortly.
	setTimeout(refresh, 1500);
}

$("#file-input").addEventListener("change", (e) => {
	upload([...e.target.files]);
	e.target.value = "";
});
const drop = $("#drop");
drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("dragging"); });
drop.addEventListener("dragleave", (e) => { if (!drop.contains(e.relatedTarget)) drop.classList.remove("dragging"); });
drop.addEventListener("drop", (e) => {
	e.preventDefault();
	drop.classList.remove("dragging");
	if (e.dataTransfer.files.length) upload([...e.dataTransfer.files]);
});

$("#new-folder").addEventListener("click", async () => {
	const name = prompt("Folder name");
	if (name) await act(`${B}/folders`, "POST", `Created ${name}.`, { parent_id: path[path.length - 1], name });
});

$("#reset").addEventListener("click", async () => {
	if (!confirm("Delete everything in your sandbox and start fresh?")) return;
	path = [];
	selected = null;
	await act(`${B}/reset`, "POST", "Sandbox reset. A fresh one was created.");
});

refresh();
setInterval(() => { if (!document.hidden) refresh(); }, 30000);
mountFeedback("buckt");

checkApi($("#api-status"));
