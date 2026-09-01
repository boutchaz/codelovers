# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Astro 7** static website for **wearecodelovers**, a web agency. Built with:
- Astro 7.2 with static output (zero-JS by default)
- Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`)
- Bun as package manager and script runner
- Content collections for the markdown blog
- GSAP + ScrollTrigger for the hero canvas scroll animation and design reveal
- PostHog analytics (proxied through nginx `/ingest`)

## Development Commands

**Start development server:**
```bash
bun run dev
```
Server runs at http://localhost:4321.

**Build for production:**
```bash
bun run build
```
Outputs a fully static site to `dist/`.

**Preview the production build:**
```bash
bun run preview
```

**Extract frames from video (for scroll animations):**
```bash
bun run extract-frames
```
Extracts frames from `public/animate.mp4` to `public/frames/` for the GSAP scroll animation. See [scripts/README.md](scripts/README.md) for details.

## Architecture

**Directory structure:**
- `src/pages/` - File-based routes (`.astro` pages). Blog lives in `src/pages/blog/`.
- `src/layouts/BaseLayout.astro` - HTML head: SEO/meta, Open Graph, fonts, JSON-LD slot
- `src/layouts/SiteShell.astro` - Page shell: header, footer, skip link, reveal script
- `src/components/` - `.astro` components (server-rendered, zero client JS)
- `src/components/sections/` - Homepage sections
- `src/scripts/` - Client-side TS: `hero.ts` (GSAP canvas), `design.ts` (GSAP reveal), `reveal.ts` (IntersectionObserver), `posthog.ts` (analytics)
- `src/content/blog/` - Markdown blog posts (frontmatter: title, description, date, author, tags)
- `src/content.config.ts` - Content collection schema (glob loader)
- `src/data/constants.ts` - Shared content data (services, case studies, nav, etc.)
- `src/styles/global.css` - Tailwind v4 + custom CSS (reveal animations, hero cards)
- `public/` - Static assets (frames, videos, fonts fallback, og-image)
- `deploy/nginx.conf` - Production nginx config (clean URLs, gzip, PostHog proxy)

**Path Aliases:**
- `@/*` maps to `src/` (e.g. `@/components/Header.astro`)

**TypeScript:**
- Strict mode via `astro/tsconfigs/strict`

## Key Technical Details

- **Rendering:** Fully static (`output: "static"`). No server runtime; nginx serves `dist/`.
- **Interactivity:** Only three small scripts ship to the client: GSAP hero/design animations, IntersectionObserver reveals, and PostHog. Everything else is pure HTML/CSS.
- **GSAP sections:** Markup lives in `.astro` components with `data-*` hooks; animation logic lives in `src/scripts/`. Scripts are imported from the component's `<script>` tag (bundled, deduped by Astro).
- **Blog:** Content collections with the glob loader. New post = add `.md` file to `src/content/blog/`. Slugs come from filenames.
- **SEO:** Sitemap via `@astrojs/sitemap` (`/sitemap-index.xml`), `robots.txt` from `src/pages/robots.txt.ts`, JSON-LD injected through the `head` slot.
- **Fonts:** Geist Variable + Geist Mono Variable self-hosted via Fontsource.
- **PostHog:** Requires `PUBLIC_POSTHOG_KEY` in `.env` (see `.env.example`). Without it, analytics are silently disabled. Events proxy through `/ingest` → `eu.posthog.com` (configured in `deploy/nginx.conf`).
- **Docker:** Multi-stage `Dockerfile` — Bun builds, nginx serves. `docker compose up --build` for production parity.

## Migration Note

This project was migrated from Next.js 15 to Astro 7 (branch `astro-migration`). The old `app/` directory (React Server/Client Components) was converted to idiomatic `.astro` components — no React runtime ships to the browser anymore.
