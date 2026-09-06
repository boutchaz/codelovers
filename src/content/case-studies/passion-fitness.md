---
title: "Passion Fitness"
category: "SaaS · Martial Arts Gym Platform"
description: "Multi-tenant martial arts gym platform serving BJJ gyms in Morocco. Features class booking, Mon Parcours belt progression tracking, RollMap member connections, web dashboard, and native mobile app."
result: "Production"
metric: "BJJ gym operations in Morocco"
gradient: "from-red-500/20 via-orange-500/10 to-amber-600/20"
stack: ["Next.js", "Supabase", "Expo React Native", "Paddle", "TypeScript", "PostgreSQL"]
date: 2025-07-15
---

## The Challenge

Martial arts gyms, particularly Brazilian Jiu-Jitsu (BJJ) academies, needed a specialized platform to manage class bookings, track member belt progression, and foster community engagement. Generic gym software lacked martial-arts-specific features like technique progression tracking and member roll (sparring) connections.

Key requirements:

- **Class booking** — Schedule management for group classes, open mats, and private sessions
- **Mon Parcours (My Journey)** — Belt progression tracking with technique milestones and instructor evaluations
- **RollMap** — BJJ-specific knowledge graph connecting members by skill level, training partners, and technique exchanges
- **Native mobile app** — Members need on-the-go access to schedules, progression tracking, and training logs
- **Payment integration** — Automated subscription billing with Paddle for international payment support
- **Multi-tenant SaaS** — Support multiple gym locations with isolated data and branding

## Our Approach

We built a dual-platform system—Next.js web dashboard for gym staff and Expo React Native mobile app for members:

### Class Booking & Scheduling

- **Live calendar** — Real-time class availability with capacity limits
- **Automated reminders** — Push notifications 1 hour before scheduled classes
- **Attendance tracking** — Staff mark attendees; system logs training frequency per member

### Mon Parcours — Belt Progression System

- **Technique curriculum** — Define belt requirements (e.g., "Master 5 guard passes for blue belt")
- **Instructor evaluations** — Coaches review member progress and award stripes/belts
- **Progress dashboard** — Members see their journey: techniques learned, rolling hours logged, belt promotion timeline

### RollMap — BJJ Knowledge Graph

- **Training partner network** — Visualize who trains with whom; discover new rolling partners
- **Technique exchange** — Members tag techniques practiced during rolls, building a shared knowledge base
- **Skill-based matching** — Suggest sparring partners based on weight class, experience level, and training goals

### Mobile-First Member Experience

- **Expo React Native** — iOS and Android apps from a single codebase
- **Offline support** — View schedules and progression data without connectivity
- **Push notifications** — Class reminders, belt promotions, and training partner invites

### Payment & Multi-Tenancy

- **Paddle integration** — Handle subscriptions, invoicing, and tax compliance for international gyms
- **Supabase RLS** — Strict data isolation per gym using Row-Level Security policies
- **Custom branding** — Each gym configures logo, colors, and belt system (some gyms use modified stripe progressions)

## The Stack

- **Web Dashboard:** Next.js 14 with App Router, TypeScript, TanStack Query
- **Mobile App:** Expo React Native, TypeScript, Expo Router
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Database:** PostgreSQL with Row-Level Security policies for multi-tenancy
- **Payments:** Paddle for subscription billing and invoicing
- **Infrastructure:** Vercel for web, EAS for mobile builds, Supabase managed backend

## Outcome

Passion Fitness launched in July 2025 and is now in production at BJJ gyms in Morocco:

- **Member engagement** — Training frequency increased as members tracked progression and connected with partners via RollMap
- **Instructor efficiency** — Belt evaluations streamlined from paper logs to digital tracking
- **Mobile adoption** — 80%+ of members use the app weekly for class bookings and progression checks
- **International ready** — Paddle handles multi-currency subscriptions for gyms expanding to Europe

## Engineering Lessons

**Expo simplifies mobile deployment:** EAS builds and over-the-air updates let us ship bug fixes and features without App Store approval delays (critical for early-stage products).

**RollMap graph visualization is the killer feature:** Early versions focused on booking and progression; RollMap's social graph became the most requested feature once members saw training partner connections.

**Supabase Realtime powers collaborative features:** Class capacity updates and instructor evaluations propagate instantly across web and mobile, essential for multi-device workflows.

**Paddle abstracts payment complexity:** Handling VAT, SCA, and multi-currency invoicing would've taken weeks to build; Paddle handled it out of the box.

---

**Building a niche SaaS platform with web + mobile?** [Let's talk](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
