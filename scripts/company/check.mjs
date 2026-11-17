#!/usr/bin/env node
// Checks company pages beyond what the content schema can express, then prints
// a review sheet: the source resume wording beside the tailored wording.
//
//   npm run company:check                 # every file in src/content/companies
//   npm run company:check -- deliveroo-k7f3q
//
// Exits 1 if anything fails. Warnings don't fail; read them in review.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { jobs, skills, summary as sourceSummary, bulletsById } from "../../src/data/resume.ts";

const DIR = "src/content/companies";
const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const files = (args.length ? args.map((a) => `${a.replace(/\.json$/, "")}.json`) : readdirSync(DIR).filter((f) => f.endsWith(".json")));

const bold = (s) => `\x1b[1m${s}\x1b[0m`, red = (s) => `\x1b[31m${s}\x1b[0m`, yellow = (s) => `\x1b[33m${s}\x1b[0m`, dim = (s) => `\x1b[2m${s}\x1b[0m`, green = (s) => `\x1b[32m${s}\x1b[0m`;

// ---- facts the page may draw numbers from ----------------------------------
const allSource = [sourceSummary, ...[...bulletsById.values()].map((b) => b.text)].join(" ");
/** Numbers as written: 16, 1.2s, 30%, 15,000, 5+ ... normalised to digits. */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const TENS = { thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, dozen: 12 };
const numbers = (s) => {
	const found = (s.match(/\d[\d,.]*/g) || []).map((n) => n.replace(/[,]/g, "").replace(/\.$/, ""));
	for (const w of s.toLowerCase().match(/\b[a-z]+\b/g) || []) {
		if (WORDS.includes(w)) found.push(String(WORDS.indexOf(w)));
		else if (w in TENS) found.push(String(TENS[w]));
	}
	return new Set(found);
};
const sourceNumbers = numbers(allSource);
const unknownNumbers = (text, allowed = sourceNumbers) => [...numbers(text)].filter((n) => !allowed.has(n) && !/^20\d\d$/.test(n));

// ---- WCAG contrast ------------------------------------------------------------
const lum = (hex) => {
	const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
};

// ---- internal links -------------------------------------------------------------
const routeExists = (path) => {
	const clean = path.replace(/[#?].*$/, "").replace(/\/$/, "") || "/";
	if (existsSync("dist")) return existsSync(join("dist", clean, "index.html")) || existsSync(join("dist", clean));
	const page = clean === "/" ? "index" : clean.slice(1);
	return ["astro", "md"].some((ext) => existsSync(`src/pages/${page}.${ext}`) || existsSync(`src/pages/${page}/index.${ext}`)) || existsSync(`public${clean}`);
};

let failed = false;

for (const file of files) {
	const errors = [], warnings = [];
	const path = join(DIR, file);
	console.log(`\n${bold(file)}`);
	if (!existsSync(path)) {
		console.log(red(`  ✕ ${path} not found`));
		failed = true;
		continue;
	}
	let d;
	try {
		d = JSON.parse(readFileSync(path, "utf8"));
	} catch (e) {
		console.log(red(`  ✕ not valid JSON: ${e.message}`));
		failed = true;
		continue;
	}
	const slug = basename(file, ".json");
	const companySlug = String(d.company || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

	// File name: <company>-<5 random chars>, so the link shows the name but can't be guessed.
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{5}$/.test(slug)) errors.push(`file name must be <company>-<5 random lowercase letters/digits>.json, got ${file}`);
	else if (!slug.startsWith(companySlug.split("-")[0])) warnings.push(`file name doesn't start with the company name (${companySlug})`);

	// Resume: every bullet points at a real one; rephrasings keep the facts.
	const used = new Set();
	for (const tj of d.resume?.jobs || []) {
		const job = jobs.find((j) => j.id === tj.id);
		if (!job) { errors.push(`resume.jobs: unknown job id "${tj.id}" (known: ${jobs.map((j) => j.id).join(", ")})`); continue; }
		for (const b of tj.bullets || []) {
			const src = bulletsById.get(b.ref);
			if (!src) { errors.push(`resume: unknown bullet ref "${b.ref}"`); continue; }
			if (src.job !== job.id) errors.push(`resume: bullet "${b.ref}" belongs to ${src.job}, not ${job.id}`);
			if (used.has(b.ref)) errors.push(`resume: bullet "${b.ref}" used twice`);
			used.add(b.ref);
			if (b.text) {
				const extra = unknownNumbers(b.text, numbers(src.text));
				if (extra.length) errors.push(`resume: "${b.ref}" rephrasing has numbers not in the original: ${extra.join(", ")}`);
				if (b.text.length > src.text.length * 1.5 + 40) warnings.push(`resume: "${b.ref}" rephrasing is much longer than the original`);
			}
		}
	}
	for (const s of d.resume?.skills || []) {
		const g = skills.find((x) => x.id === s.id);
		if (!g) { errors.push(`resume.skills: unknown group "${s.id}"`); continue; }
		for (const item of s.items || []) if (!g.items.includes(item)) errors.push(`resume.skills: "${item}" isn't in the ${g.label} group of resume.ts`);
	}
	const sx = unknownNumbers(d.resume?.summary || "");
	if (sx.length) errors.push(`resume.summary has numbers that appear nowhere in resume.ts: ${sx.join(", ")}`);

	// Claims elsewhere on the page: numbers must come from the resume.
	for (const [field, text] of [["headline", d.headline], ["pitch", d.pitch], ["note", d.note]]) {
		const extra = unknownNumbers(text || "");
		if (extra.length) errors.push(`${field} has numbers that appear nowhere in resume.ts: ${extra.join(", ")}`);
	}
	(d.matches || []).forEach((m, i) => {
		for (const r of m.refs || []) if (!bulletsById.has(r)) errors.push(`matches[${i}]: unknown ref "${r}"`);
		const extra = unknownNumbers(m.evidence || "");
		if (extra.length) errors.push(`matches[${i}].evidence has numbers not in resume.ts: ${extra.join(", ")}`);
		for (const l of m.links || []) if (l.href.startsWith("/") && !routeExists(l.href)) errors.push(`matches[${i}]: link ${l.href} doesn't exist on the site`);
		if (!(m.refs || []).length && !(m.links || []).length) warnings.push(`matches[${i}] has no refs or links: what backs it up?`);
	});

	// Theme: readable, and not a copy of their brand.
	const t = d.theme || {};
	const pairs = [
		["fg on bg", t.fg, t.bg, 7, 4.5],
		["fg on surface", t.fg, t.surface, 4.5, 4.5],
		["muted on bg", t.muted, t.bg, 4.5, 4.5],
		["muted on surface", t.muted, t.surface, 4.5, 4.5],
		["onAccent on accent", t.onAccent, t.accent, 4.5, 4.5],
		["accent on bg", t.accent, t.bg, 3, 3],
	];
	for (const [label, a, b, want, must] of pairs) {
		if (!/^#[0-9a-f]{6}$/i.test(a || "") || !/^#[0-9a-f]{6}$/i.test(b || "")) continue;
		const r = contrast(a, b);
		if (r < must) errors.push(`contrast ${label}: ${r.toFixed(2)}:1 is below ${must}:1`);
		else if (r < want) warnings.push(`contrast ${label}: ${r.toFixed(2)}:1 (aim for ${want}:1)`);
	}
	if (t.cloud?.svg) warnings.push("theme.cloud is a custom SVG: make sure it isn't their logo");
	if (!(d.sources || []).some((s) => d.roleUrl && s.href === d.roleUrl)) warnings.push("sources don't include the role URL");

	// ---- report ---------------------------------------------------------------
	for (const e of errors) console.log(red(`  ✕ ${e}`));
	for (const w of warnings) console.log(yellow(`  ! ${w}`));
	if (!errors.length) console.log(green(`  ✓ checks passed${warnings.length ? ` with ${warnings.length} warning(s)` : ""}`));
	failed ||= errors.length > 0;

	console.log(`\n  ${bold("Review sheet")} ${dim("(source wording → tailored wording)")}`);
	console.log(`  ${d.company} · ${d.role}\n  ${dim(d.headline || "")}`);
	for (const tj of d.resume?.jobs || []) {
		const job = jobs.find((j) => j.id === tj.id);
		if (!job) continue;
		console.log(`\n  ${bold(job.title)} · ${job.company}`);
		for (const b of tj.bullets || []) {
			const src = bulletsById.get(b.ref);
			if (!src) continue;
			if (b.text && b.text !== src.text) {
				console.log(`   ~ ${dim(src.text)}`);
				console.log(`     ${b.text}`);
			} else console.log(`   = ${src.text}`);
		}
		const dropped = job.bullets.filter((b) => !used.has(b.id));
		if (dropped.length) console.log(dim(`   left out: ${dropped.map((b) => b.id).join(", ")}`));
	}
}

console.log(failed ? red("\nSome checks failed.") : green("\nAll company pages pass."));
process.exit(failed ? 1 : 0);
