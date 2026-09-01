# wearecodelovers

Agency website for [wearecodelovers](https://wearecodelovers.com) — built with **Astro 7**, Tailwind CSS v4, GSAP, and Bun. Fully static output served by nginx.

## Quick start

```bash
bun install
bun run dev       # dev server at http://localhost:4321
bun run build     # static build to dist/
bun run preview   # preview the production build
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Astro dev server |
| `bun run build` | Build the static site to `dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run extract-frames` | Extract video frames for the hero scroll animation |

## Deployment

```bash
docker compose up --build
```

Multi-stage Docker build: Bun builds the site, nginx serves it with clean URLs, gzip, immutable asset caching, and a reverse proxy for PostHog analytics (`/ingest` → `eu.posthog.com`).

## Analytics

PostHog is optional. Copy `.env.example` to `.env` and set `PUBLIC_POSTHOG_KEY` (EU project key from PostHog settings). Without a key the site works normally with analytics disabled.

## Blog

Posts are markdown files in `src/content/blog/`. Frontmatter:

```yaml
---
title: "Post title"
description: "Short description"
date: 2025-01-15
author: "CodeLovers"
tags: ["SaaS", "Engineering"]
---
```

The slug is the filename. New posts appear automatically on `/blog` and in the sitemap.
