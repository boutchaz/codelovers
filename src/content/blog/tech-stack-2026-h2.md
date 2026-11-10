---
title: "Our tech stack in 2026 H2: web, mobile and agent harnesses"
description: "The tools behind AgroGina, Passion Fitness and Snookly, and why our AI workflow centers on a shared agent harness."
date: "2026-11-10"
author: "CodeLovers"
tags: ["Engineering", "TypeScript", "AI workflow"]
---

At CodeLovers, our stack spans web apps, mobile clients, business APIs and specialized data processing. Here is the short version of what we are working with in the second half of 2026.

![CodeLovers tech stack for 2026 H2, including web, mobile, backend, shipping and a vendor-neutral agent harness.](/images/blog/tech-stack-2026-h2.png)

## The product stack

**Web:** React, Tailwind CSS and Radix UI form a common UI foundation. Our app projects use Vite and Next.js, with TanStack Query for server data, TanStack Router for routing and Zustand where client state needs it. This website runs on Astro.

**Mobile:** React Native, Expo and Expo Router support our mobile work. Shared TypeScript and React concepts help across platforms; offline behavior, notifications and native integrations still need their own attention.

**Backend and data:** NestJS handles business APIs in AgroGina, while Python/FastAPI services handle specialized processing such as satellite analysis and computer vision. PostgreSQL and Supabase appear across projects, with MinIO for object storage in Passion Fitness.

**Shipping and quality:** Docker, Dokploy and GitHub Actions support delivery. Vitest, Jest and Playwright provide checks at different levels, alongside mobile build and release tooling.

## AI workflow: the agent harness

We currently use Codex, Claude, Cursor and Grok. The shared foundation is the **agent harness**: the project context, instructions, tools, permissions and verification steps around an agent's work.

That means keeping repository guidance clear, making relevant context easy to find, scoping changes and checking the result. Different tools can participate in the workflow. The output still needs to fit the codebase and pass the checks that matter for the change.

For us, this makes the harness an engineering concern alongside the application stack. Clear boundaries and repeatable verification remain useful as the tools change.

## See the products

- [AgroGina](https://agrogina.com/) — farm management, satellite analytics and IoT.
- [Passion Fitness](https://passionfitness.thebzlab.online/) — martial arts gym management, bookings and member progression.
- [Snookly](https://www.snookly.ma/) — snooker club operations, live scoring and point of sale.

Explore our [case studies](/case-studies/) for more context on the products behind these choices.
