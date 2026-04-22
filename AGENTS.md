# AGENTS.md

## Stack

- Single-package Astro 6 static site. Use `npm`; the repo is pinned by `package-lock.json`.
- Required Node version is `>=22.12.0` in `package.json`. CI uses Node 22.

## Verified Commands

- Install: `npm ci`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview built site: `npm run preview`
- Astro CLI passthrough: `npm run astro -- <args>`

## Verification

- The only non-interactive verification currently wired in the repo is `npm run build`.
- `npm run astro check` is not ready out of the box here: it prompts to install `@astrojs/check` and `typescript`. Do not assume typecheck exists unless those deps are added first.
- There are no `test`, `lint`, or formatter scripts in `package.json`.

## Site Structure

- Blog content lives in `src/content/blog/*.md` and is registered by `src/content.config.ts`.
- Main entrypoints are:
  - `src/pages/index.astro`: homepage, shows the 8 newest posts.
  - `src/pages/posts/index.astro`: full archive.
  - `src/pages/[...slug].astro`: builds individual post pages from the blog collection.
  - `src/pages/tags/[tag].astro`: builds tag archive pages.
  - `src/layouts/BaseLayout.astro`: shared shell and global styles.

## Content Gotchas

- Post URLs come from the content entry ID (`post.id`), which in this repo is derived from the markdown filename under `src/content/blog`. The `slug:` frontmatter present in posts is not used by the routes.
- Tag URLs are always lowercased by the page code. Preserve that behavior when adding tag links or tag pages.
- Math rendering is enabled globally through `remark-math` and `rehype-katex` in `astro.config.mjs`; `BaseLayout.astro` imports KaTeX CSS.
- Some posts use fenced code blocks labeled `systemverilog`. Astro builds successfully, but Shiki currently falls back to `plaintext` and prints warnings during `npm run build`.

## Assets And Output

- Post images live under `public/assets/images/posts/...`; site-wide images are under `public/assets/images/site/...`.
- Builds output static files to `dist/`.

## Deploy

- GitHub Pages deploy is defined in `.github/workflows/deploy.yml`.
- CI runs `npm ci` then `npm run build`, uploads `dist/`, and deploys on pushes to `master`.

## Existing Drift Worth Noticing

- `README.md` is still Astro starter boilerplate and is not a reliable project guide.
- `src/pages/about.md` still says the site is published with Jekyll, but the live repo is Astro + GitHub Pages workflow.
