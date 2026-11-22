---
name: company-page
description: Build an unlisted, company-tailored portfolio page (rhaqim.com/company/<company>-<random>) from a job posting link. Researches the role and the company's look, writes a themed page with a tailored résumé drawn only from src/data/resume.ts, checks it, renders the PDFs and pushes a review branch. Use when John shares a job link or says he's applying somewhere and wants a page for it.
---

# Company page

Input: a job posting URL (or pasted job text if the page can't be fetched).
Output: `src/content/companies/<slug>.json`, two PDFs in `public/company/<slug>/`, and a pushed branch `company/<slug>` that John reviews before anything goes live.

## Hard rules

- **Never merge, never push to `main`, never deploy.** Every page goes through John's review on its own branch. Stop after printing the compare URL.
- **Never invent anything.** Every claim must come from `src/data/resume.ts`, the site's own project pages (`src/pages/*.md`, `/demo/*`, `/notes/*`), or the job posting. Résumé bullets are selected, reordered or lightly rephrased **by `ref`**; a rephrasing keeps every fact and number and adds none. If the role asks for something John hasn't done, leave it out (or say honestly in the note that it's new ground). Don't stretch.
- **Inspired by, never impersonating.** No logos, no brand fonts (pick the nearest free font from the `fonts` list in `src/content.config.ts`), no copied taglines. The cloud shape is one of the built-in shapes or ≤6 characters of text, never their logo. The page already says it is independent and unaffiliated: keep that.
- **Unlisted.** The slug is `<company>-<5 random lowercase letters/digits>` (e.g. `deliveroo-k7f3q`). Generate the suffix with `node -e "console.log(Math.random().toString(36).slice(2,7))"`. Never link a company page from anywhere else on the site.
- Keep John's email and personal details out of anything sent to external services (search queries, fetch URLs).
- **Only build for roles John can actually get.** Run the eligibility gate below before any other work. If it fails, don't build: tell John why in a few lines and stop.

## Eligibility gate

Quick rejections usually come from knockout screens (location, work authorization, years), not from résumé wording. A page can't fix those, so check them first. John is based in **Lagos, Nigeria** (`contact.location` in `src/data/resume.ts`), is open to relocating, and has no work authorization outside Nigeria unless `resume.ts` or John says otherwise.

**Build** when at least one of these holds:
- Remote and open to Nigeria: "anywhere", "worldwide", "global", EMEA, Africa, or a time-zone requirement John can meet from Lagos (UTC+1).
- The company offers **relocation** or **visa sponsorship** for the role's country.

**Reject** when any of these holds:
- Location: onsite, hybrid or remote limited to countries or regions John isn't in (e.g. "Canada only", "US-based", "must reside in the EU"), with no relocation or sponsorship offered. "No visa sponsorship" combined with a country restriction is a rejection.
- Authorization: requires citizenship, existing work authorization or security clearance John doesn't have.
- Experience: the stated minimum is more than 2 years above John's (count from the earliest non-opt-in job in `resume.ts`). Within 2 years, build, but tell John it's a stretch.
- Language: requires fluency in a language not in `languages` in `resume.ts`.

**When it's unclear** (e.g. Ashby says "Europe" while the text says "remote in European time zones"), read the posting's own wording. A time zone alone passes; "based in" or "located in" a region fails unless relocation or sponsorship is offered. If it's still ambiguous, ask John before building.

**On rejection**, reply with: the verdict, the exact posting text that fails the gate, and anything that would change it (e.g. "if you have Canadian work authorization, I'll build it"). Build anyway only if John explicitly overrides.

## Workflow

1. **Read the role, then run the eligibility gate.** Fetch the posting. Pull out: company, exact role title, location and remote terms, relocation or sponsorship, minimum years, the 3–6 requirements that matter most (skip boilerplate), and the language they use. If blocked, ask John to paste the text. Stop here if the gate fails.
2. **Read the company's look.** `npm run company:brand -- <company homepage>` prints their colours, CSS variables, theme-color and fonts. Optionally skim the careers/engineering blog for tone. Note what you used in `sources`.
3. **Choose a theme** (`theme` in the JSON): `bg`, `surface`, `fg`, `muted`, `line`, `accent`, `onAccent` as 6-digit hex; `heading`/`body` fonts from the allow-list; `radius` 0–24 matching their corners; `cloud` as `{ "shape": "orb|phone|die|bucket|network|host|link|window" }` or `{ "text": "GO" }`. Pick the accent from their brand, then build neutrals that pass contrast: fg/bg ≥ 7 (min 4.5), muted/bg ≥ 4.5, onAccent/accent ≥ 4.5, accent/bg ≥ 3. A light brand can get a light page.
4. **Map evidence.** For each key requirement write a `matches` item: `requirement` (their words, short), `evidence` (1–2 sentences, John's real work), `refs` (bullet ids that prove it), `links` (site pages: `/noewright`, `/buckt`, `/ussd`, `/demo/...`, `/notes/...`). Prefer things they can click and try.
5. **Tailor the résumé** (`resume`): a `summary` aimed at this role (no new numbers), `jobs` with the most relevant bullets first (`{ "ref": "dgrs-loom" }`, optionally `"text"` for a light rephrase), and `skills` groups with items copied exactly from `resume.ts`. Drop what doesn't help; don't pad. Jobs marked `optIn: true` in `resume.ts` (currently Nirvana Labs) stay off the page unless John asks for them; if one looks relevant, mention it in the hand-over so he can decide.
   **Language experience spans jobs.** John has written Python and Go throughout his career, at work and in projects he still builds daily, not only at the job where a language is most visible: Python at Equity *and* at DGRS Labs (`dgrs-python-agents`), Go at DGRS Labs *and* earlier at Nirvana Labs (`nirvana-go`). Never tie a language to one employer ("my Python is from Equity", "Loom is Go, so…"), and never count a language's years from a single job. When a posting asks for N years of a language, choose bullets from every job that show it, so the span is visible on the résumé.
6. **Write the words.** `headline` (10–110 chars, specific to them, not flattery), `pitch` (2–3 sentences), `note` (a short, plain letter: why this role, what he'd bring first; paragraphs split by blank lines). Use the site's voice: direct, concrete, no buzzwords, no "passionate".
7. **Write the file** to `src/content/companies/<slug>.json`. Shape (see `src/content.config.ts` for the full schema):
   ```json
   {
     "company": "Deliveroo", "role": "Senior Backend Engineer", "roleUrl": "https://...", "location": "London",
     "prepared": "YYYY-MM-DD",
     "theme": { "bg": "#...", "surface": "#...", "fg": "#...", "muted": "#...", "line": "#...", "accent": "#...", "onAccent": "#...", "heading": "Inter", "body": "Inter", "radius": 8, "cloud": { "shape": "phone" } },
     "headline": "...", "pitch": "...",
     "matches": [{ "requirement": "...", "evidence": "...", "refs": ["dgrs-loom"], "links": [{ "label": "Try Noewright", "href": "/demo/noewright" }] }],
     "resume": { "summary": "...", "jobs": [{ "id": "dgrs", "bullets": [{ "ref": "dgrs-loom" }] }], "skills": [{ "id": "languages", "items": ["Golang", "Python"] }] },
     "note": "...",
     "sources": [{ "label": "Job posting", "href": "https://..." }]
   }
   ```
8. **Check.** `npm run company:check -- <slug>`. Fix every ✕. Read every ! and the review sheet (original wording vs tailored wording): would John sign each line?
9. **Build and look.** `npm run build` (schema errors surface here), then `npx astro preview --port 4400` and open `/company/<slug>/`. Don't touch John's own dev server on 4321 or anything else he's running. Check: readable contrast, the cloud colour suits the page, nothing overflows on a phone width, the résumé fits on one or two A4 pages at `/company/<slug>/resume/`.
10. **PDFs.** `npm run company:pdf -- <slug>` writes the styled and ATS PDFs into `public/company/<slug>/`. Rebuild afterwards so the page links to them.
11. **Hand over for review.**
    ```sh
    git switch -c company/<slug> main
    git add src/content/companies/<slug>.json public/company/<slug>/
    git commit -m "company page: <Company>, <Role>"
    git push -u origin company/<slug>
    ```
    Then give John: the compare URL `https://github.com/Rhaqim/portfolio/compare/main...company/<slug>`, the local preview link, the eventual live URL `https://rhaqim.com/company/<slug>/`, the check output's warnings, and any requirement you couldn't back with evidence. Stop there.

## Notes

- If the page needs something the schema doesn't allow, say so to John rather than editing the layout on the company branch.
- To revise after review: edit the JSON on the same branch, re-run steps 8–10, commit and push again.
- To retire a page: delete its JSON and `public/company/<slug>/` on a branch for review.
