---
title: "Multi-tenancy that doesn't leak — org_id scoping and Postgres RLS"
description: "How CodeLovers implemented bulletproof multi-tenancy for AgroGina using PostgreSQL Row-Level Security, preventing cross-tenant data access even when application code has bugs."
date: "2026-02-15"
author: "CodeLovers"
tags: ["Multi-tenancy", "PostgreSQL", "Security", "SaaS"]
---

Multi-tenant SaaS has one non-negotiable rule: **tenant A must never see tenant B's data**. Application-level filtering (`WHERE org_id = ?`) works until it doesn't — one forgotten clause, one N+1 query optimization gone wrong, and you've got a data breach.

## The AgroGina requirement

We built [AgroGina](https://agrogina.com/), a precision agriculture ERP serving Moroccan cooperatives. Each cooperative (tenant) has:

- Farm parcels with geospatial boundaries
- Crop planting schedules and harvest records
- Teams (agronomists, field agents, admins)
- Satellite-derived NDVI time-series data
- Inventory (fertilizer, equipment) and sales records

**Zero cross-tenant leakage** was the primary architectural constraint. Agricultural cooperatives compete; exposing one coop's farm data to another would destroy trust.

## Why application-level filtering isn't enough

Early prototypes used NestJS query filters:

```typescript
async findFarmsByOrg(orgId: string) {
  return this.farmRepository.find({ where: { orgId } });
}
```

This breaks when:

- A developer forgets `.where({ orgId })` in a new query
- Raw SQL queries bypass the ORM's filters
- Eager-loaded relationships pull in data without scoping
- Performance optimizations (e.g., denormalized views) skip application logic

**You cannot audit every query.** The attack surface is every line of code that touches the database.

## Postgres Row-Level Security to the rescue

Row-Level Security (RLS) moves tenant isolation **into the database**. Every table gets a policy enforced at the Postgres kernel level:

```sql
-- Enable RLS on the farms table
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- Create policy: users only see farms for their org
CREATE POLICY tenant_isolation ON farms
  USING (org_id = current_setting('app.current_org_id')::uuid);
```

Now, **even raw SQL queries** respect tenant boundaries:

```sql
-- This query respects RLS automatically
SELECT * FROM farms WHERE crop_type = 'wheat';
-- Postgres internally adds: AND org_id = current_setting('app.current_org_id')::uuid
```

## Setting the session variable per request

NestJS sets `app.current_org_id` for every HTTP request via a global interceptor:

```typescript
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const orgId = request.user.orgId; // From JWT claims

    await this.dataSource.query(
      `SET LOCAL app.current_org_id = $1`,
      [orgId]
    );

    return next.handle();
  }
}
```

`SET LOCAL` scopes the variable to the current transaction. After the request completes, Postgres automatically clears it.

## Handling multi-tenant foreign keys

Foreign keys across tenants require composite keys:

```sql
CREATE TABLE harvests (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL,
  farm_id UUID NOT NULL,
  harvest_date DATE NOT NULL,
  FOREIGN KEY (org_id, farm_id) REFERENCES farms(org_id, id)
);
```

This prevents a harvest from referencing a farm in another tenant, even if the attacker knows the farm's UUID.

## Testing tenant isolation

We built a penetration testing suite that attempts cross-tenant access:

```typescript
it('blocks cross-tenant farm access via direct query', async () => {
  // User A creates a farm
  const farm = await createFarm(tenantA, 'Farm Alpha');

  // User B attempts raw SQL access
  const result = await queryAsUser(
    tenantB,
    `SELECT * FROM farms WHERE id = $1`,
    [farm.id]
  );

  expect(result.rows).toHaveLength(0); // RLS blocked it
});
```

RLS passed every test. Raw SQL, eager joins, forgot-filters — all blocked.

## Performance considerations

**Does RLS slow queries down?** In practice, no. Postgres query planner treats RLS policies like any other `WHERE` clause. With proper indexes on `org_id`, the overhead is negligible.

**Monitoring:** We log queries slower than 500ms. Adding `org_id` indexes to three tables eliminated 90% of slow queries.

## When RLS isn't the right choice

RLS shines for strict multi-tenancy (B2B SaaS with strong isolation). It's overkill for:

- Single-tenant apps (obviously)
- B2C apps where users share most data (social networks, marketplaces)
- Apps with complex cross-tenant workflows (rare, but exists)

For AgroGina, RLS was non-negotiable. We sleep better knowing tenant isolation lives in the database, not in 10,000 lines of application code.

---

**Building multi-tenant SaaS with strict isolation?** [Let's design your data model](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
