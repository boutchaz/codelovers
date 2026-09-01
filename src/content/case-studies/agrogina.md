---
title: "AgroGina"
category: "Agriculture · Satellite Analytics"
description: "Precision agriculture platform combining satellite imagery analysis, Google Earth Engine NDVI monitoring, and multi-tenant geospatial ERP for Moroccan farms."
result: "Real-time"
metric: "Vegetation monitoring & insights"
gradient: "from-emerald-500/20 via-teal-500/10 to-green-600/20"
externalUrl: "https://agrogina.com/"
stack: ["React", "NestJS", "FastAPI", "Google Earth Engine", "PostgreSQL + PostGIS", "Leaflet", "Redis"]
date: 2025-09-10
---

## The Problem

Moroccan agricultural cooperatives needed a way to monitor crop health across hundreds of distributed farms, many in rural areas with unreliable internet. Traditional scouting methods were slow, subjective, and expensive. AgroGina's vision: **satellite-driven agronomy insights accessible to smallholder farmers**, combined with ERP tools for inventory, sales, and workforce management.

Key challenges:

- **Satellite data integration** — Process multi-spectral imagery from Sentinel-2 to compute NDVI (vegetation health index)
- **Geospatial complexity** — Manage thousands of farm parcels with polygon boundaries, crop rotation history, and yield forecasts
- **Multi-tenancy** — Each cooperative sees only their farms, teams, and agronomic data (strict `org_id` isolation)
- **Offline-first UX** — Field agents need to record observations and interventions without connectivity, syncing later
- **Dual domain architecture** — Business logic (ERP) and satellite processing (Google Earth Engine) require different tech stacks

## Our Approach

We split the platform into two specialized backends with a unified React frontend:

### Business API (NestJS + PostgreSQL)

- **Multi-tenant ERP** — Every query filtered by `org_id` at the database level (Postgres RLS policies)
- **Farm management** — CRUD for parcels, crops, planting schedules, harvest records
- **Team & roles** — Org-scoped user accounts with agronomist, field-agent, and admin roles
- **Inventory & sales** — Track fertilizer stock, equipment, and crop sales per cooperative
- **REST + GraphQL** — NestJS provides both interfaces; frontend uses GraphQL for complex nested queries

### Satellite Processing API (Python FastAPI + Google Earth Engine)

- **GEE integration** — Server-side Earth Engine Python SDK for NDVI computation, time-series analysis
- **Batch processing** — Celery workers fetch new Sentinel-2 imagery weekly, compute vegetation indices per parcel
- **Geospatial queries** — PostGIS extensions for polygon intersection, area calculations, buffer zones
- **Caching layer** — Redis caches NDVI time-series to avoid redundant GEE API calls (quota optimization)

### Frontend (React SPA)

- **Leaflet maps** — Interactive farm boundary editing, NDVI heatmap overlays
- **Offline sync** — IndexedDB caches farm data; service worker queues mutations for later sync
- **TanStack Query** — Optimistic updates with retry logic for flaky rural connectivity
- **PWA support** — Installable on Android tablets used by field agents

### Multi-Tenancy Architecture

Every database table includes `org_id` (UUID). Postgres Row-Level Security (RLS) policies enforce:

```sql
CREATE POLICY tenant_isolation ON farms
  USING (org_id = current_setting('app.current_org_id')::uuid);
```

NestJS sets the session variable on every request via a global interceptor. This guarantees **zero cross-tenant leakage** even if application code has bugs.

## The Stack

- **Frontend:** React 18, TanStack Router + Query, Leaflet + React-Leaflet, IndexedDB, Service Worker
- **Business Backend:** NestJS, TypeORM, PostgreSQL 15 with PostGIS, GraphQL (Apollo)
- **Satellite Backend:** Python FastAPI, Google Earth Engine Python API, Celery + Redis, GeoPandas
- **Database:** PostgreSQL with PostGIS extension, RLS policies, TimescaleDB for time-series NDVI
- **Infrastructure:** Docker Compose, nginx reverse proxy, DigitalOcean Droplets, automated backups

## Outcome

AgroGina launched in September 2025 and now serves **12 cooperatives managing 4,200 hectares** across Morocco:

- **8,500+ NDVI analyses** — Automated weekly vegetation health reports for every enrolled parcel
- **Offline-first proven** — Field agents in rural Chefchaouen and Ouarzazate record data during week-long trips, syncing when back in town
- **Zero tenant data leaks** — RLS policies passed penetration testing; no cross-org access incidents
- **40% faster anomaly detection** — Satellite alerts flag irrigation issues or pest infestations 2-3 weeks earlier than manual scouting

## Engineering Lessons

**Dual backends > monolith for this domain:** Keeping NestJS (business rules, fast CRUD) separate from FastAPI (CPU-heavy GEE processing) let us scale and deploy them independently. The GEE API is slow (300-2000ms per query), so caching is mandatory.

**RLS is the right tool for strict multi-tenancy:** Row-Level Security moved tenant isolation from application code (error-prone) to the database (enforced). We sleep better knowing a forgotten `.where('org_id', ...)` clause won't leak data.

**Offline-first is non-negotiable for rural Morocco:** Early beta users abandoned the app when they couldn't record field observations offline. Adding IndexedDB + service worker sync turned NPS from 6 to 9.

**NDVI alone isn't enough:** Farmers requested prescriptive recommendations ("apply 20kg/ha nitrogen") based on NDVI trends. We added a rules engine that interprets satellite data through agronomic models, which became the platform's killer feature.

---

**Need multi-tenant SaaS with complex domain logic?** [Let's talk](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
