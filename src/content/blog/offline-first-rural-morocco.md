---
title: "Offline-first for rural Morocco — syncing farm data over flaky 3G"
description: "How AgroGina's field agents record crop observations during week-long trips without connectivity, syncing when they return to town. Lessons from building a true offline-first SaaS."
date: "2026-03-20"
author: "CodeLovers"
tags: ["Offline-first", "PWA", "IndexedDB", "SaaS"]
---

[AgroGina](https://agrogina.com/) serves Moroccan agricultural cooperatives. Our users — agronomists and field agents — spend days in rural Chefchaouen, Ouarzazate, and the Atlas foothills. Connectivity is flaky 3G at best, often nonexistent.

The app had to work **100% offline**. Not "graceful degradation." Full CRUD, map interactions, and photo uploads — all while disconnected for a week.

## The requirement: record observations offline, sync later

A typical workflow:

1. Field agent drives to a farm (2 hours from Rabat, no signal)
2. Opens the AgroGina PWA on an Android tablet
3. Pulls up the parcel on a Leaflet map (boundaries, crop type, last NDVI reading)
4. Records an observation: "Pest detected on sector 3, applied fungicide"
5. Takes 3 photos of affected leaves
6. Repeats for 20 parcels across 5 farms
7. Drives back to the cooperative office (3 days later)
8. Opens the app, which syncs 60 observations and 180 photos to the server

If the app required connectivity, field agents would carry paper notebooks and manually transcribe data later — defeating the purpose of a digital tool.

## Architecture: IndexedDB + Service Worker + Optimistic UI

### 1. IndexedDB as the source of truth

The frontend treats **IndexedDB** as the primary database. All reads go to IndexedDB first:

```typescript
// Fetch farms from local storage
const farms = await db.farms.where({ orgId }).toArray();

// If stale, fetch from server in the background
if (isStale(farms)) {
  fetch('/api/farms').then(syncToIndexedDB);
}
```

When offline, the server fetch fails silently. The UI shows cached data. When online, the server fetch succeeds and updates IndexedDB.

### 2. Write operations queue mutations

Every create/update/delete writes to IndexedDB **and** queues a sync operation:

```typescript
async function createObservation(obs: Observation) {
  // 1. Write to local DB immediately
  await db.observations.add({ ...obs, status: 'pending' });

  // 2. Update UI instantly
  updateUI(obs);

  // 3. Queue sync operation
  await syncQueue.enqueue({
    type: 'CREATE_OBSERVATION',
    payload: obs,
  });

  // 4. Try to sync now (no-op if offline)
  await syncQueue.process();
}
```

The UI updates **instantly** — no loading spinner, no "waiting for server" delay. If the device is offline, the sync simply fails and retries later.

### 3. Service Worker handles background sync

When the device comes back online, the service worker processes the queue:

```typescript
// service-worker.ts
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-observations') {
    event.waitUntil(syncObservations());
  }
});

async function syncObservations() {
  const pending = await db.observations
    .where('status')
    .equals('pending')
    .toArray();

  for (const obs of pending) {
    try {
      await fetch('/api/observations', {
        method: 'POST',
        body: JSON.stringify(obs),
      });
      await db.observations.update(obs.id, { status: 'synced' });
    } catch (err) {
      // Retry later
    }
  }
}
```

The Sync API automatically retries when connectivity returns. The field agent doesn't need to manually "push" data.

### 4. Photo uploads via Blob storage in IndexedDB

Photos are stored as Blobs in IndexedDB (not base64 strings — 33% smaller):

```typescript
async function capturePhoto(observationId: string) {
  const blob = await camera.takePhoto();

  // Store locally
  await db.photos.add({
    id: uuid(),
    observationId,
    blob,
    status: 'pending',
  });

  // Queue for upload
  await syncQueue.enqueue({
    type: 'UPLOAD_PHOTO',
    photoId: id,
  });
}
```

When syncing, the service worker uploads photos to S3 (via presigned URLs from the backend), then updates the observation record with the S3 URL.

## Conflict resolution: last-write-wins with timestamps

When the field agent syncs after a week, their local changes might conflict with server-side changes (e.g., the agronomist edited the parcel from the office).

Our strategy: **last-write-wins** based on `updated_at` timestamps:

```typescript
async function syncObservation(localObs: Observation) {
  const serverObs = await fetch(`/api/observations/${localObs.id}`);

  if (serverObs.updated_at > localObs.updated_at) {
    // Server is newer, overwrite local
    await db.observations.put(serverObs);
  } else {
    // Local is newer, push to server
    await fetch(`/api/observations/${localObs.id}`, {
      method: 'PUT',
      body: JSON.stringify(localObs),
    });
  }
}
```

For AgroGina, conflicts are rare (field agents and office staff edit different parcels). When conflicts do occur, the latest change wins — good enough for our use case.

**More complex scenarios** (e.g., collaborative editing) would need CRDTs (Conflict-free Replicated Data Types). We avoided that complexity.

## Debugging sync issues in production

Early beta users reported "lost" observations. Investigation revealed:

1. **Service worker didn't wake up** — iOS Safari aggressively kills service workers. Solution: add a "Manual Sync" button that explicitly calls `syncQueue.process()`.
2. **Photos too large** — 4K photos from high-end tablets exceeded IndexedDB quotas (50MB on some Android browsers). Solution: compress photos to 1920x1080 JPEG before storing.
3. **Retry storms** — 100 failed syncs retrying simultaneously after reconnection overloaded the server. Solution: exponential backoff with jitter.

## The user experience win

Before offline-first: field agents would abandon the app mid-trip, reverting to paper notebooks. After offline-first: **92% of observations are recorded in the app**, synced later.

The key UX win: **instant feedback**. When a field agent taps "Save Observation," the UI updates immediately. No spinner. No "waiting for network." The observation appears in the list, and they move on. Sync happens invisibly, in the background, when connectivity returns.

## When offline-first is overkill

Offline-first adds complexity:

- IndexedDB APIs are verbose and error-prone
- Sync logic requires careful testing (state machines, retry queues, conflict resolution)
- Service workers have subtle bugs (especially on iOS)

**Use offline-first when:**

- Your users are **often offline** (field work, travel, rural areas)
- Your app's **core value** depends on offline access (e.g., note-taking, task management, field data collection)

**Don't use offline-first when:**

- Your app is primarily online (social feeds, real-time collaboration)
- Users rarely lose connectivity (office workers, urban environments)

For AgroGina, offline-first was the difference between "nice to have" and "actually used."

---

**Building SaaS for field workers or rural markets?** [Let's make it offline-ready](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
