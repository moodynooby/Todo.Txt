# Adding a New Synced Feature (e.g. Habits)

Syncing a new feature is now a **single hook call** with a few plain mapping
functions. The sync engine, write queue, retries, and live updates are all
handled in exactly one place, so there is nothing to get wrong per feature.

## Steps

### 1. Register the document path

Add to `src/lib/syncPaths.ts`:

```ts
export const HABITS_DOC: UserDocPath = { collection: "habits", id: "main" };
```

### 2. Mount `useSyncedDocument`

Anywhere inside `<SyncProvider>` (typically a small `useSyncedHabits()` hook
added to `SyncFeatures` in `src/lib/syncAdapters.ts`):

```ts
import { useSyncedDocument } from "@/lib/useSyncedDocument";
import { HABITS_DOC } from "@/lib/syncPaths";

export function useSyncedHabits() {
	const { state, dispatchHabits } = useHabitsContext();

	useSyncedDocument<HabitsData>({
		path: HABITS_DOC,
		value: state.habits,
		applyRemote: (habits) =>
			dispatchHabits({ type: "SET_HABITS", payload: habits }),
		localKey: "habits_backup", // optional: offline backup + instant startup
		encode: (habits) => ({ habits }), // optional: custom Firestore shape
		decode: (record) =>
			Array.isArray(record.habits)
				? (record.habits as unknown as HabitsData)
				: undefined,
	});
}
```

That's the entire integration. Options available on every feature:

| Option | Purpose |
|--------|---------|
| `path` | Firestore document (`users/{uid}/{collection}/{id}`) |
| `value` | The feature's current local state |
| `applyRemote` | Replace local state with a newer server value |
| `localKey` | Mirror to localStorage for offline/instant startup |
| `encode` / `decode` | Custom Firestore field mapping (default `{ value }`) |
| `beforeWrite` | Mutate before upload — e.g. drop per-device runtime state |
| `afterRead` | Normalize values arriving from other devices |

### 3. Wire it into `SyncFeatures`

Append the hook call to `SyncFeatures` in `src/lib/syncAdapters.ts` so it
mounts under the shared engine. No other file changes.

## Security rules

`firestore.rules` already allows any document under `/users/{userId}/{document=**}`.
As features grow, tighten per-collection validation, e.g.:

```
match /habits/{docId} {
	allow read, write: if request.auth.uid == userId
		&& request.resource.data.updatedAt is timestamp;
}
```

## Design guarantees

Writes for **all** features merge into one atomic batched commit per
debounce window (one round trip total, never per-feature). Remote snapshots
are version-aware: older server values are ignored automatically, so
cross-device races cannot corrupt state. Retries with exponential backoff
apply to the whole engine, not per feature.
