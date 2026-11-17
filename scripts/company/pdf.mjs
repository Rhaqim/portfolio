#!/usr/bin/env node
// Prints a company page's two resumes to PDF with headless Chrome (no npm
// dependencies), into public/company/<slug>/ so the page links to them.
//
//   npm run build && npm run company:pdf -- deliveroo-k7f3q
//   npm run company:pdf -- deliveroo-k7f3q --base http://localhost:4321   # use a running server
//
// Without --base it serves ./dist itself on a random local port (no astro preview,
// whose background daemon would outlive this script).
// Set CHROME=/path/to/chrome if Chrome or Chromium isn't found.

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, statSync, readFileSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const baseArg = args.includes("--base") ? args[args.indexOf("--base") + 1] : null;
if (!slug) {
	console.error("usage: npm run company:pdf -- <slug> [--base http://localhost:4321]");
	process.exit(1);
}
if (!existsSync(`src/content/companies/${slug}.json`)) {
	console.error(`no src/content/companies/${slug}.json`);
	process.exit(1);
}

const chrome = [
	process.env.CHROME,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
	"/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].find((p) => p && existsSync(p));
if (!chrome) {
	console.error("Chrome/Chromium not found. Set CHROME=/path/to/chrome.");
	process.exit(1);
}

let server = null, base = baseArg;
if (!base) {
	if (!existsSync(`dist/company/${slug}/resume/index.html`)) {
		console.error("dist has no build of this page yet. Run `npm run build` first.");
		process.exit(1);
	}
	const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };
	server = createServer((req, res) => {
		let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
		let file = join("dist", p);
		if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
		if (!existsSync(file)) { res.writeHead(404).end(); return; }
		res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
	});
	await new Promise((r) => server.listen(0, "127.0.0.1", r));
	base = `http://127.0.0.1:${server.address().port}`;
}

const out = `public/company/${slug}`;
mkdirSync(out, { recursive: true });
const jobs = [
	[`${base}/company/${slug}/resume/`, `${out}/john-franklin-anusiem-resume.pdf`],
	[`${base}/company/${slug}/resume-ats/`, `${out}/john-franklin-anusiem-resume-ats.pdf`],
];
// Async spawn: the static server above lives in this process and must keep answering.
const run = (cmd, argv) => new Promise((resolve) => {
	const p = spawn(cmd, argv);
	let stderr = "";
	p.stderr.on("data", (d) => (stderr += d));
	p.on("close", (status) => resolve({ status, stderr }));
});
let ok = true;
for (const [url, file] of jobs) {
	const r = await run(chrome, [
		"--headless=new", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer",
		"--virtual-time-budget=6000", `--print-to-pdf=${file}`, url,
	]);
	if (r.status !== 0 || !existsSync(file)) {
		ok = false;
		console.error(`failed: ${url}\n${r.stderr}`);
	} else {
		console.log(`✓ ${file} (${Math.round(statSync(file).size / 1024)} KB)`);
	}
}
server?.close();
process.exit(ok ? 0 : 1);
