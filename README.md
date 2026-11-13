# rhaqim.com

Personal site and project documentation. Static Astro build, no client framework.

## Commands

Use the Node version in `.nvmrc` (`nvm use`). It matches the Cloudflare build
image, and it matters: `sharp` pulls in `@napi-rs/wasm-runtime`, whose engine
range is `^20.19.0 || ^22.13.0 || >=23.5.0`. On a Node version outside that
range, `npm install` silently omits its peer dependencies from the lockfile and
`npm ci` then fails on the build machine.

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the production build locally |

## Structure

```
src/
├── data/          Single source of truth for everything the site renders
│   ├── site.ts       Identity, links, nav, capability strip, demo API + live flag
│   ├── projects.ts   Systems (libraries) + products, keyed by slug
│   ├── demos.ts      Live demos, in pager order
│   ├── notes.ts      Engineering notes (write-ups)
│   ├── work.ts       Employment history
│   └── research.ts   Hardware/research direction
├── layouts/
│   ├── Base.astro    Head, SEO, JSON-LD, header, footer, point cloud, reveal observer
│   ├── Doc.astro     Project page shell: masthead, TOC, prose, next link
│   └── Note.astro    Notes page shell
├── components/    Homepage sections, the shared project row, DemoNav, Cloud
├── pages/
│   ├── index.astro   The index
│   ├── 404.astro
│   ├── buckt.md      Library docs
│   ├── ussd.md
│   ├── loom.md
│   ├── conexus.md    Product case studies
│   ├── brisa.md
│   ├── eriife.md
│   ├── notes/        Notes (markdown, Note layout)
│   └── demo/         Live demos: index, ussd, buckt, loom, forecast
├── scripts/demo/  Browser code for the demos (talks to the demo API)
├── scripts/cloud/ The red point cloud: engine (cloud.js) + shape library (shapes.js)
└── styles/
    ├── global.css    Tokens, layout primitives, type scale
    ├── prose.css     Markdown documentation styles
    └── demo.css      Demo pages, scoped under .demo
```

## Live demos

The `/demo` pages are static; their backend is the separate
[portfolio-demo](../portfolio-demo) repo (an API on Hetzner behind Cloudflare at
`api.rhaqim.com`). To work on them locally, run `make up` in `../portfolio-demo`,
then `make site` there (or `PUBLIC_DEMO_API=http://localhost:8080 npm run dev`
here).

Links into the demos (nav, hero, project rows, docs pages) follow `demo.live`
in `src/data/site.ts`. A project gets a "Try it" link when its entry in
`projects.ts` has `demo: "/<slug>"`; to add a demo, also add it to
`src/data/demos.ts` (for the pager) and a card on `src/pages/demo/index.astro`.

## The point cloud

A fixed canvas behind every page (`components/Cloud.astro`). Any element can
claim it:

```html
<section data-cloud="phone" data-cloud-size="0.8" data-cloud-x="0.64">
```

The claiming element nearest the middle of the screen wins, so the cloud
follows the reader and carries its last shape across page loads. Shapes live in
`scripts/cloud/shapes.js` as small canvas drawings (white = filled), sampled
into points with extra weight on edges. `data-cloud="text:404"` spells text.

From script, `window.rhaqimCloud.morph(spec)` takes a shape name,
`{ svg: "<path d>", viewBox }`, `{ text }`, `{ image: url }` or `{ draw }`, and
holds it until `release()`. That's the seam for agents: anything that can
return an SVG path, a word or an image can shape the cloud. It respects
`prefers-reduced-motion` (static, no physics) and pauses in background tabs.

## Adding a project page

1. Add an entry to `systems` or `products` in `src/data/projects.ts`. The `slug`
   is the route.
2. Create `src/pages/<slug>.md` with this frontmatter:

   ```yaml
   ---
   layout: ../layouts/Doc.astro
   slug: <slug>
   description: "Meta description for search and social cards."
   ---
   ```

`Doc.astro` pulls the title, status, language, install command, star count and
outbound links from the data entry, and builds the table of contents from the
page's `##` headings. It throws at build time if the `slug` has no matching data
entry, so the two can't drift apart.

Slugs are top-level routes (`/buckt`, `/ussd`) so each one maps cleanly to a
subdomain later without changing any links on the page.

## Notes

- Markdown tables are wrapped in a scroll container by a small rehype plugin in
  `astro.config.mjs` so wide API tables never scroll the page body sideways.
- Use a bare code fence for ASCII diagrams. Tagging them `sh` makes Shiki
  syntax-colour the box-drawing characters.
- `public/og.png` is rendered from `public/og.svg`. Regenerate after editing:

  ```sh
  node -e "require('sharp')('public/og.svg').resize(1200,630).png().toFile('public/og.png')"
  ```
