---
title: "TanStack by default — we pick the stack for the product"
description: "CodeLovers ships app products on TanStack first: Router, Query, Table with React. Astro or Next when SEO and static win, and domain tools when the problem demands them."
date: "2026-01-18"
author: "CodeLovers"
tags: ["Engineering", "TanStack", "Architecture"]
---

We are not neutral — TanStack (Router, Query, Table) is our default for app products. What is actually agnostic is the decision itself: the product decides the stack, and tells us when the default does not apply.

## App products → TanStack, our default

For dashboards, multi-tenant SaaS, and long-lived SPA-style products we reach for **TanStack** with React first, and it is rare that we regret it. Typed routes, server state that stays honest, and UI that does not fight the framework.

That is how most of our client apps ship: strong client architecture first, hosting and SEO layered only where they earn their keep.

## When we step off the default

Marketing sites, product marketing, and this blog need crawlability and cheap deploys. There we go static-first (this site runs on Astro; Next.js when a client's ecosystem calls for it) — because the job is content and conversion, not app architecture.

Domain stacks also stay domain stacks: headless commerce on Hydrogen, ERP on Frappe, IoT pipelines on FastAPI, mobile on React Native / Expo. We do not force TanStack into a problem it does not own.

## What “default” means in practice

- **A default, not a dogma** — TanStack first for apps, exceptions when the job demands them
- **Contracts over frameworks** — typed APIs, clear tenancy, migrations you can trust
- **One stack per product** — not five half-finished tools in one repo
- **Swap when the job changes** — a marketing site and an ops console rarely share the same constraints

## Shipping with CodeLovers

Need a Morocco-based team that designs the architecture *then* chooses the tools? [Book a working session](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
