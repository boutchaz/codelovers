---
title: "Snookly"
category: "SaaS · Snooker Club Operations"
description: "Multi-tenant snooker club management system with RFID member cards, live table scoring, café/billiard POS, and administrative dashboard."
result: "Production"
metric: "Live club operations platform"
gradient: "from-purple-500/20 via-indigo-500/10 to-violet-600/20"
stack: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "RFID Integration"]
date: 2025-08-20
---

## The Challenge

Snooker club owners needed a unified system to manage member access, track table occupancy in real-time, process café and billiard sales, and oversee operations across multiple locations. Existing solutions were fragmented—separate systems for POS, access control, and table management—creating operational bottlenecks and poor member experience.

Key requirements:

- **RFID member access** — Contactless cards for entry and table assignment
- **Live table scoring** — Real-time occupancy tracking and automated billing per table/hour
- **Integrated POS** — Single checkout for café orders, billiard table fees, and retail items
- **Multi-tenant architecture** — Each club location operates independently with isolated data
- **Admin dashboard** — Centralized reporting for revenue, member activity, and inventory

## Our Approach

We built a full-stack SaaS platform with three core modules:

### Member & Access Control

- **RFID integration** — Members tap cards at entrance; system logs check-ins and assigns available tables
- **Membership tiers** — Configure hourly rates, package deals, and loyalty discounts per club
- **Digital profiles** — Member history, balance tracking, and automated renewals

### Live Table Management

- **Real-time scoring** — Staff mark tables occupied/available; system calculates fees automatically
- **Timer-based billing** — Hourly rates with minute-accurate tracking; prorated charges for partial sessions
- **Automated notifications** — Alert members when pre-paid time is ending

### Café & Billiard POS

- **Unified checkout** — Combine table fees, café orders, and retail purchases in one transaction
- **Inventory sync** — Real-time stock updates; low-stock alerts for popular items
- **Split payments** — Support cash, card, and member account balance

### Multi-Tenancy & Admin Dashboard

- **Org-level isolation** — Each club's data is strictly separated using Supabase Row-Level Security
- **Revenue analytics** — Daily/weekly/monthly reports on table utilization, café sales, and membership trends
- **Staff roles** — Permissions for cashiers, managers, and club owners

## The Stack

- **Frontend:** Next.js 14 with App Router, TypeScript, TanStack Query
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Database:** PostgreSQL with Row-Level Security policies for multi-tenancy
- **Integrations:** RFID card reader API, payment processing
- **Infrastructure:** Vercel hosting, Supabase managed backend

## Outcome

Snookly launched in August 2025 and is now in production at multiple snooker club locations:

- **Streamlined operations** — Staff process member check-ins and payments 3x faster than manual systems
- **Real-time accuracy** — Automated table billing eliminated manual calculation errors
- **Member satisfaction** — RFID cards reduced entry friction; members appreciate transparent per-minute billing
- **Multi-location ready** — Architecture supports onboarding new clubs without code changes

## Engineering Lessons

**Supabase RLS is the right choice for strict multi-tenancy:** Row-Level Security policies enforce data isolation at the database level, eliminating the risk of cross-tenant data leaks.

**Real-time matters for table management:** Supabase Realtime subscriptions keep staff dashboards synced instantly when tables open/close, critical for busy weekend operations.

**RFID integration required hardware abstraction:** We built a thin API layer to handle different card reader vendors, making future hardware upgrades seamless.

---

**Building a multi-tenant SaaS platform?** [Let's talk](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
