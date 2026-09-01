---
title: "Framework-agnostic by default — we pick the stack for the product"
description: "Why CodeLovers stays stack-flexible: TanStack for app-heavy products, Next when SEO and static win, and domain tools when the problem demands them."
date: "2026-01-18"
author: "CodeLovers"
tags: ["Engineering", "TanStack", "Architecture"]
---

We are framework-agnostic. The product decides the stack — not our habits, and not a single “house framework.”

## App products → TanStack

For dashboards, multi-tenant SaaS, and long-lived SPA-style products we often reach for **TanStack** (Router, Query, Table) with React. Typed routes, server state that stays honest, and UI that does not fight the framework.

That is how several of our client apps ship: strong client architecture first, hosting and SEO layered only where they earn their keep.

## Marketing + content → static-friendly stacks

Agency sites, product marketing, and this blog need crawlability and cheap deploys. There we use App Router / static generation (this site runs on Next.js) — because the job is content and conversion, not because every app should look the same.

## Domain stacks stay domain stacks

Headless commerce on Hydrogen, ERP on Frappe, IoT pipelines on FastAPI, mobile on React Native / Expo. We do not force a web meta-framework into a problem it does not own.

## What “agnostic” means in practice

- **Contracts over frameworks** — typed APIs, clear tenancy, migrations you can trust
- **One stack per product** — not five half-finished tools in one repo
- **Swap when the job changes** — a marketing site and an ops console rarely share the same constraints

## Shipping with CodeLovers

Need a Morocco-based team that designs the architecture *then* chooses the tools? [Book a working session](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
