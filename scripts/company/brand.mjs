#!/usr/bin/env node
// Reads a company's public site and summarises its look, for picking a theme
// that's inspired by it (never a copy: no logos, no brand fonts).
//
//   npm run company:brand -- https://deliveroo.co.uk
//
// Prints JSON: page title and description, theme-color, the most-used colours,
// colour custom properties and font families from the HTML and up to four
// stylesheets. Logos and images are deliberately ignored.

const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) {
	console.error("usage: npm run company:brand -- https://company.example");
	process.exit(1);
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const get = async (u) => {
	const res = await fetch(u, { headers: { "User-Agent": UA, Accept: "text/html,text/css,*/*" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
	if (!res.ok) throw new Error(`${u} answered ${res.status}`);
	return res.text();
};

const html = await get(url);
const meta = (name) => html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)`, "i"))?.[1]
	?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`, "i"))?.[1];

const sheets = [...html.matchAll(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi)]
	.map((m) => m[0].match(/href=["']([^"']+)/i)?.[1])
	.filter(Boolean)
	.slice(0, 4)
	.map((h) => new URL(h, url).toString());
let css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
const fetched = [];
for (const s of sheets) {
	try {
		css += "\n" + (await get(s));
		fetched.push(s);
	} catch (e) {
		fetched.push(`${s} (failed: ${e.message})`);
	}
}
const styleAttrs = [...html.matchAll(/style=["']([^"']+)/gi)].map((m) => m[1]).join(";");
const all = css + ";" + styleAttrs;

const toHex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(+v))).toString(16).padStart(2, "0")).join("");
const counts = new Map();
const bump = (hex) => counts.set(hex, (counts.get(hex) || 0) + 1);
for (const m of all.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) {
	const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
	bump("#" + h.toLowerCase());
}
for (const m of all.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/gi)) bump(toHex(m[1], m[2], m[3]));

const props = [...all.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi)]
	.map((m) => ({ name: m[1], value: m[2] }))
	.filter((p, i, arr) => arr.findIndex((q) => q.name === p.name) === i)
	.slice(0, 40);

const fonts = new Map();
for (const m of all.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) {
	const first = m[1].split(",")[0].trim().replace(/["']/g, "");
	if (first && !first.startsWith("var(") && !/^(inherit|initial|unset|sans-serif|serif|monospace)$/i.test(first)) fonts.set(first, (fonts.get(first) || 0) + 1);
}

const top = (map, n) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ value: k, count: v }));

console.log(JSON.stringify({
	url,
	title: html.match(/<title[^>]*>([^<]*)/i)?.[1]?.trim(),
	description: meta("description") ?? meta("og:description"),
	themeColor: meta("theme-color"),
	stylesheets: fetched,
	colors: top(counts, 20),
	colorProperties: props,
	fonts: top(fonts, 8),
	note: "Brand fonts are usually licensed: pick the closest free font from the allow-list in src/content.config.ts. Never use the logo.",
}, null, 2));
