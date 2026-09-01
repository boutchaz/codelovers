---
title: "WhatsApp Reservation Bot"
category: "Automation · SaaS"
description: "Multi-tenant WhatsApp Business API integration enabling businesses to automate bookings with webhook integrations, real-time updates, and N8N workflow automation."
result: "Automated"
metric: "Booking process via WhatsApp"
gradient: "from-rose-500/20 via-fuchsia-500/10 to-purple-600/20"
stack: ["React", "Express.js", "Drizzle ORM", "PostgreSQL", "N8N", "WhatsApp Business API", "WebSocket"]
date: 2026-01-20
---

## The Challenge

Moroccan SMBs — restaurants, beauty salons, medical clinics — were drowning in WhatsApp booking requests. Staff spent hours manually confirming appointments, checking availability, and sending reminders. Our client wanted a **SaaS platform** where businesses could automate WhatsApp conversations using the official Business API, without hiring developers.

Core requirements:

- **Multi-tenant SaaS** — Each business gets an isolated WhatsApp number, booking calendar, and customer database
- **Conversational booking** — Parse natural language ("table for 4 tomorrow at 8pm"), check availability, confirm or suggest alternatives
- **Calendar integration** — Sync with Google Calendar, block time slots, prevent double-bookings
- **Workflow automation** — Send reminders 24h before appointments, ask for feedback post-visit, escalate no-shows
- **No-code customization** — Business owners should edit conversation flows, reminder templates, and CRM rules without touching code

## Our Approach

We built a three-layer architecture optimizing for **conversational UX** and **workflow flexibility**:

### WhatsApp Gateway (Express.js + Webhooks)

- **Official Business API** — Integrated Meta's Cloud API for verified business messaging (green checkmark)
- **Webhook handler** — Express server receives inbound WhatsApp messages, validates signatures, queues for processing
- **Message parser** — NLP module extracts booking intent (date, time, party size, service type) from free-text messages
- **Context management** — Redis stores conversation state (e.g., "awaiting date confirmation") per user session

### Booking Engine (Node.js + Drizzle ORM)

- **Multi-tenant data model** — PostgreSQL with `tenant_id` scoping: businesses, locations, services, bookings, customers
- **Availability logic** — Check time slot conflicts, business hours, staff capacity before confirming
- **Confirmation flow** — Send structured WhatsApp messages with interactive buttons (Confirm / Reschedule / Cancel)
- **Real-time updates** — WebSocket pushes booking notifications to the business dashboard instantly

### Workflow Automation (N8N + Custom Nodes)

- **Visual workflow builder** — Business owners design automation flows via N8N's drag-and-drop UI (hosted within the platform)
- **Triggers:** New booking, 24h before appointment, 1h after appointment, customer replies with keyword
- **Actions:** Send WhatsApp message, update Google Calendar, log to CRM, notify staff via Slack
- **Custom N8N nodes** — We built WhatsApp Business API nodes for advanced message types (templates, interactive lists, media)

### Admin Dashboard (React SPA)

- **Multi-location management** — Chains (e.g., salon with 3 branches) manage all locations from one dashboard
- **Calendar view** — Day/week/month views with drag-to-reschedule, color-coded by service type
- **Customer CRM** — Conversation history, booking history, tags, notes
- **Analytics** — Booking conversion rate, average response time, no-show rate, revenue per channel

## The Stack

- **Frontend:** React 18, TanStack Router + Query, Tailwind CSS, FullCalendar.js
- **Backend:** Express.js, Drizzle ORM, PostgreSQL, Redis for session/cache
- **WhatsApp:** Meta Cloud API (Business Platform), Webhook verification, Template messages
- **Automation:** Self-hosted N8N (workflow engine), custom WhatsApp nodes
- **Real-time:** WebSocket (Socket.io) for live dashboard updates
- **Infrastructure:** Docker Compose, nginx reverse proxy, Let's Encrypt SSL, DigitalOcean Droplets

## Outcome

The platform launched in January 2026 and onboarded **47 businesses** in the first 8 weeks:

- **12,000+ automated bookings** — Zero-touch reservation flow from customer inquiry to calendar confirmation
- **83% automation rate** — Only 17% of conversations required human escalation (unclear requests, special cases)
- **4.2 hours saved per day** — Average time saved per business (vs. manual WhatsApp management)
- **92% customer satisfaction** — Post-booking survey NPS averaged 9.2/10 for response speed and clarity

### Real-World Impact

**Restaurant use case:** A Casablanca restaurant with 45 tables automated Friday/Saturday peak bookings. Before: 2 staff members handling WhatsApp 6pm-midnight. After: Bot handles 90% of bookings, staff only intervene for large groups or special requests.

**Beauty salon use case:** A Rabat salon chain (3 locations, 12 stylists) integrated staff calendars. Customers book specific stylists via WhatsApp; bot checks stylist availability across locations, suggests alternatives if fully booked.

## Engineering Lessons

**NLP is hard, structured fallback is essential:** Early versions tried pure NLP parsing ("I want a haircut next Tuesday"). Accuracy was 60%. We added quick-reply buttons ("Choose a date: [Tomorrow] [This Weekend] [Next Week]") as fallback, boosting successful bookings to 83%.

**Multi-tenancy must extend to N8N workflows:** Each business's automation workflows are scoped by `tenant_id` in N8N's database. This prevents cross-tenant workflow triggers (e.g., Salon A's reminder sent to Salon B's customer).

**WhatsApp rate limits are strict:** Meta's API allows 1,000 messages per day per business phone number (without approval). We built queue throttling to stay under limits, prioritize urgent messages (confirmations) over marketing (reminders), and alert businesses when approaching quota.

**Template messages require pre-approval:** Meta mandates pre-approved message templates for certain flows (e.g., appointment reminders). We built a template library with 20 pre-approved templates in Arabic, French, and English, covering 95% of use cases.

---

**Want to automate customer interactions at scale?** [Let's build it together](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
