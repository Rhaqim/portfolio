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
│   ├── site.ts       Identity, links, nav, capability strip
│   ├── projects.ts   Systems (libraries) + products, keyed by slug
│   ├── work.ts       Employment history
│   └── research.ts   Hardware/research direction
├── layouts/
│   ├── Base.astro    Head, SEO, JSON-LD, header, footer, reveal observer
│   └── Doc.astro     Project page shell: masthead, TOC, prose, next link
├── components/    Homepage sections + the shared project row
├── pages/
│   ├── index.astro   The index
│   ├── 404.astro
│   ├── buckt.md      Library docs
│   ├── ussd.md
│   ├── loom.md
│   ├── conexus.md    Product case studies
│   ├── brisa.md
│   └── eriife.md
└── styles/
    ├── global.css    Tokens, layout primitives, type scale
    └── prose.css     Markdown documentation styles
```

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
