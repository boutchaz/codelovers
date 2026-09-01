---
title: "Dual-backend architecture — when one API isn't enough"
description: "Why AgroGina splits business logic (NestJS) and satellite processing (FastAPI) into separate backends, and when you should do the same."
date: "2026-03-02"
author: "CodeLovers"
tags: ["Architecture", "NestJS", "FastAPI", "Microservices"]
---

Most SaaS apps get by with one backend. AgroGina has two: **NestJS for business logic**, **FastAPI for satellite data**. This isn't microservices for the sake of it — it's a domain-driven boundary that pays for itself.

## The problem: mixed workloads

[AgroGina](https://agrogina.com/) is a precision agriculture platform. The frontend needs:

1. **Fast CRUD** — Fetch farm parcels, edit planting schedules, update team roles (sub-50ms response times)
2. **Heavy geospatial processing** — Compute NDVI vegetation indices from Google Earth Engine (300–2000ms, CPU-bound)

Shoving both into one monolith creates problems:

- **Resource contention** — GEE queries block the event loop, slowing CRUD endpoints
- **Deployment coupling** — Restarting the backend for a CRUD fix kills in-flight satellite jobs
- **Scaling asymmetry** — Business API needs low-latency horizontal scaling; satellite processing needs worker queues

## The split: NestJS vs FastAPI

### Business API (NestJS + PostgreSQL)

Handles everything that isn't satellite data:

- User auth (JWT, Clerk integration)
- Farm CRUD (parcels, crops, planting schedules)
- Team management (agronomists, field agents, admins)
- Inventory & sales (fertilizer stock, crop sales)
- Real-time updates (WebSocket for dashboard notifications)

**Why NestJS?** TypeScript end-to-end, mature ecosystem, GraphQL + REST out of the box, excellent ORM (TypeORM/Drizzle).

### Satellite API (Python FastAPI + Google Earth Engine)

Handles compute-heavy geospatial tasks:

- **Google Earth Engine integration** — Fetch Sentinel-2 imagery, compute NDVI
- **Batch processing** — Celery workers process 100+ parcels per night
- **PostGIS queries** — Polygon intersection, buffer zones, area calculations
- **NDVI caching** — Redis stores time-series to avoid redundant GEE calls (quota optimization)

**Why FastAPI?** Google Earth Engine SDK is Python-only. GeoPandas, Rasterio, and GEE's Python API are the de facto stack for satellite analysis. FastAPI gives us async endpoints with Pydantic validation.

## Communication between backends

The frontend talks to **both** APIs directly:

```typescript
// Fast CRUD → NestJS
const farms = await graphqlClient.query({
  query: GET_FARMS,
  variables: { orgId },
});

// Heavy processing → FastAPI
const ndvi = await fetch(
  `https://satellite-api.agrogina.com/ndvi/parcel/${parcelId}`
).then((r) => r.json());
```

No backend-to-backend calls. The frontend orchestrates.

**Why not have NestJS call FastAPI?**

- **Latency:** Adding a hop costs 20–50ms
- **Coupling:** NestJS deployment now depends on FastAPI uptime
- **Complexity:** Retries, timeouts, circuit breakers — all shifted to the frontend's TanStack Query layer, which already handles this well

Backend-to-backend communication is reserved for **async workflows** (e.g., NestJS triggers a Celery job via Redis queue when a new parcel is added).

## Deployment independence

Each backend deploys separately:

- **NestJS:** DigitalOcean App Platform, autoscales based on HTTP requests
- **FastAPI:** Docker on a compute-optimized Droplet, Celery workers scale via supervisor

When we optimize a GEE query, we redeploy FastAPI. Business logic keeps running. When we add a new ERP feature, we redeploy NestJS. Satellite processing keeps running.

## Shared data via PostgreSQL

Both APIs connect to the same PostgreSQL database. They share:

- **Tenant schema** (`organizations`, `users`)
- **Farm data** (`parcels`, `crops`) — NestJS writes, FastAPI reads
- **NDVI results** — FastAPI writes, NestJS reads

**Ownership rules:**

- NestJS **owns** business tables (farms, teams, inventory)
- FastAPI **owns** satellite tables (ndvi_time_series, sentinel_metadata)
- Shared tables use **events** (Postgres NOTIFY/LISTEN) to sync cache invalidation

No distributed transactions. Each API validates its own domain.

## When to use dual backends

**Use one backend if:**

- Your domain is homogenous (pure CRUD, or pure batch processing)
- Scaling patterns align (e.g., both CPU-bound or both I/O-bound)
- Team velocity benefits from monolithic simplicity

**Use dual backends if:**

- You have fundamentally different workload types (real-time + batch, or fast CRUD + slow compute)
- One domain uses a language-specific SDK (e.g., Python for ML/GIS, Rust for embedded systems)
- You need independent scaling/deployment for business-critical paths

For AgroGina, the split was mandatory: Google Earth Engine's Python SDK decided it for us. The performance and operational wins validated the choice.

## What we'd do differently

**We should have split sooner.** Early prototypes ran GEE queries inside NestJS via `child_process.spawn('python')`. It worked but was a mess (IPC overhead, error handling, no streaming).

**Avoid premature splitting.** We've seen teams split backends for "clean architecture" when a modular monolith would've sufficed. Start monolithic, split when pain is real.

---

**Designing backend architecture for a domain-heavy SaaS?** [Let's talk](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
