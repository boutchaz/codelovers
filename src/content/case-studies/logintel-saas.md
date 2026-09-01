---
title: "LoginTel SaaS"
category: "IoT · Cold Chain Monitoring"
description: "Comprehensive cold chain monitoring platform with real-time IoT tracking, alerting systems, and compliance reporting for temperature-sensitive logistics."
result: "99.9%"
metric: "Uptime with real-time alerts"
gradient: "from-blue-500/20 via-cyan-500/10 to-indigo-600/20"
stack: ["Next.js", "Strapi CMS", "Python FastAPI", "MQTT", "TCP/IP", "Prometheus", "Grafana", "PostgreSQL"]
date: 2025-06-15
---

## The Challenge

LoginTel approached us with a critical problem: pharmaceutical and food distributors were losing millions due to temperature excursions during transport. They needed a robust IoT platform that could monitor cold chain conditions in real-time, trigger instant alerts, and generate compliance reports for regulatory bodies.

The key challenges were:

- **Real-time reliability** — IoT devices must stream temperature, humidity, and location data 24/7 without gaps
- **Protocol complexity** — Devices communicate via MQTT, TCP/IP, and proprietary binary formats
- **Alert latency** — Temperature violations must trigger SMS/email alerts within seconds, not minutes
- **Compliance reporting** — Detailed audit trails required for FDA, HACCP, and ISO certifications
- **Multi-tenant architecture** — Each logistics company needs isolated data, dashboards, and alert rules

## Our Approach

We designed a three-tier architecture optimizing for both real-time data ingestion and user-facing performance:

### IoT Data Pipeline (Python FastAPI)

- **TCP parser service** — Custom binary protocol decoder for legacy IoT devices
- **MQTT broker integration** — Sub-second ingestion from modern sensor nodes
- **Time-series database** — PostgreSQL with TimescaleDB extension for efficient historical queries
- **Alert engine** — Rule-based threshold monitoring with Prometheus AlertManager

### Web Platform (Next.js + Strapi)

- **Multi-tenant SaaS** — Organization-scoped data isolation with role-based access control
- **Real-time dashboard** — WebSocket connections for live sensor updates
- **Content management** — Strapi headless CMS for device catalog, documentation, and compliance templates
- **Report generation** — Automated PDF exports with time-stamped temperature graphs and chain-of-custody logs

### Observability Stack

- **Prometheus** — Metrics collection from IoT gateway, FastAPI workers, and Next.js server
- **Grafana** — Operational dashboards tracking ingestion rates, alert response times, and system health
- **PagerDuty integration** — Critical alerts escalate to on-call engineers automatically

## The Stack

- **Frontend:** Next.js 14 with App Router, TanStack Query, Recharts for data visualization
- **Backend API:** Python FastAPI with async workers, Celery for background jobs
- **CMS:** Strapi v4 with PostgreSQL, custom content types for device profiles
- **IoT Layer:** MQTT broker (Mosquitto), custom TCP server for binary protocols
- **Database:** PostgreSQL with TimescaleDB for time-series data
- **Monitoring:** Prometheus, Grafana, AlertManager
- **Infrastructure:** Docker Compose for staging, Kubernetes for production, DigitalOcean managed PostgreSQL

## Outcome

The platform launched in Q2 2024 and has since monitored over **2 million shipments** across Morocco, France, and Spain:

- **99.9% uptime** — Zero critical incidents in 18 months of production
- **Sub-5-second alerts** — Average alert delivery time of 3.2 seconds from threshold violation to SMS
- **100% audit compliance** — All clients passed FDA and HACCP audits using LoginTel-generated reports
- **40% cost reduction** — Clients reduced spoilage-related losses by eliminating undetected temperature excursions

## Engineering Lessons

**Protocol abstraction pays off:** By decoupling device protocols (MQTT, TCP) from the business logic layer, we onboarded three new device models in under a week each.

**Time-series matters at scale:** TimescaleDB's hypertable partitioning kept query response times under 200ms even with 6 months of sensor data per device.

**Alert fatigue is real:** We added smart throttling rules (e.g., "Only alert once per hour for non-critical thresholds") after clients complained about notification overload during the first month.

---

**Ready to build mission-critical IoT systems?** [Book a working session with CodeLovers](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
