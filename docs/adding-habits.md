# Adding a New Synced Feature (e.g. Habits)

This document explains how to wire a new feature into the Firebase backend
using the cleaned-up data layer, without touching the sync loop.

## Overview

The persistence layer is now split into three files:

| File | Responsibility |
|------|----------------|
| `src/lib/firebase.ts` | Initializes Firebase app/auth/firestore; exports `getFirestoreDb()` and auth helpers |
| `src/lib/firestoreClient.ts` | Typed Firestore operations: `getDocWithRetry`, `subscribeDoc`, `writeDocs` (batch), `getDocsForCollection`, `userDocRef`, `UserDocPath`, `DocUpdate` |
| `src/lib/syncPaths.ts` | Central registry of synced document paths (`TODO_DOC`, `EXCALIDRAW_DOC`, `GROQ_SETTINGS_DOC`) |
| `src/context/SyncContext.tsx` | Owns the sync lifecycle + a `syncStores` array; each store maps one synced document |

## Steps to add Habits

### 1. Register the path

Add to `src/lib/syncPaths.ts`:

```ts
export const HABITS_DOC: UserDocPath = { collection: "habits", id: "main" };
```

### 2. Add a store entry

Append an entry to the `syncStores` array in `SyncProvider`
(`src/context/SyncContext.tsx`). Only four small functions per store:

```ts
{
  path: HABITS_DOC,
  setLocal: (data) => dispatchHabits({ type: "SET_HABITS", payload: data as HabitsData }),
  fromQueue: (item) => item.habitsData,
  toFields: (data) => ({ habits: data }),
  fromFields: (data) =>
    data.habits !== undefined ? (data.habits as HabitsData) : undefined,
},
```

### 3. Feed it into the queue

Extend `SaveQueueItem` in `SyncContext.tsx` with the habits payload and push it
from a `useEffect` that tracks your habits state (same pattern as
`writeDoc` currently uses for content/excalidraw/groqApiKey).

### 4. Security rules (optional but recommended)

`firestore.rules` currently allows any document under
`/users/{userId}/{document=**}`. You can keep this, or add per-collection
validation as features grow:

```
match /habits/{docId} {
  allow read, write: if request.auth.uid == userId
    && request.resource.data.updatedAt is timestamp;
}
```

## Design notes

- All reads and writes go through `firestoreClient.ts` — no raw
  `doc(db, "users", uid, ...)` strings anywhere else in the app.
- Writes are batched (`writeBatch`) so N stores cost one round trip and stay
  atomic.
- `subscribeDoc` keeps the "ignore older versions" contract and handles
  retries via the passed `onError`; `SyncContext` re-subscribes only after
  tearing down the previous listener, avoiding the duplicate-listener bug.
- `getDocsForCollection` is ready for multi-document collections (e.g. one
  doc per habit, rather than one big `habits/main` blob).
