/** Field Notes Ritual: generic startup conflict resolution.
 *
 * Previously the local-vs-remote startup decision lived only for the todo
 * document in `SyncContext.connect()` — notes, habits, and every other
 * feature implicitly lost local offline edits at connect time (the remote
 * snapshot won by arrival). This module generalizes that decision into a
 * small pure function any feature can use: given a remote snapshot
 * (timestamped) and a local offline seed (timestamped), decide whether the
 * local edits should win and be re-queued, or whether the remote snapshot
 * should seed the device.
 *
 * Rules (fixes S3):
 *   - Both timestamps are *server-side* origin: the local seed's timestamp
 *     is the last time this device's mirror was written by a *synced*
 *     (remote-received) snapshot, so the comparison never mixes clocks.
 *   - Local wins only when its timestamp strictly beats the remote one AND
 *     the content differs — same content never triggers a push.
 *   - Otherwise the remote wins: the device seeds from the snapshot and its
 *     local mirror is re-aligned so future offline edits build on it.
 *
 * The result is consumed by `SyncContext.connect()`; the engine's outbox
 * (syncOutbox) guarantees re-queued local content survives teardown.
 */
import type { DocSnapshot, UserDocPath } from "@/lib/firestoreClient";

type AnyRecord = Record<string, unknown>;

export interface ReconcileSeed {
	/** Last synced snapshot this device saw (value + server timestamp). */
	localSeed: { value: unknown; updatedAt: number } | null;
}

export type ReconcileDecision =
	| { action: "push"; value: unknown }
	| { action: "pull"; value: unknown }
	| { action: "none" };

export interface DecideReconcileOptions {
	/** Which field holds this document's value in Firestore (`value`, `content`, `habits`, ...). */
	valueKey: string;
	/** Seed: last synced local snapshot (value + its server timestamp). */
	seed: ReconcileSeed | null;
}

/** Pure decision — no storage access, fully testable. */
export function decideReconcile(
	remote: DocSnapshot<AnyRecord>,
	opts: DecideReconcileOptions,
): ReconcileDecision {
	const remoteValue = remote.data?.[opts.valueKey];
	const remoteTs = remote.updatedAt;
	const localValue = opts.seed?.localSeed?.value;
	const localTs = opts.seed?.localSeed?.updatedAt ?? 0;

	const hasLocal =
		localValue !== undefined && localValue !== null && localValue !== "";
	const hasRemote = remote.exists && remoteValue !== undefined;

	if (!hasLocal) {
		// Nothing local to defend — always seed from remote when present.
		return hasRemote
			? { action: "pull", value: remoteValue }
			: { action: "none" };
	}
	if (!hasRemote) {
		// No remote document (new user, deleted cloud record) — local wins
		// and will be re-queued by the caller.
		return { action: "push", value: localValue };
	}
	const contentEqual =
		JSON.stringify(localValue) === JSON.stringify(remoteValue);
	if (contentEqual) return { action: "none" };

	// Server-clock-only comparison: the local seed's timestamp came from a
	// previously received remote snapshot, so both sides are server time.
	// Local offline edits are only promoted when the local mirror is newer
	// than the authoritative remote — exactly the legacy todo rule,
	// generalized to every mirrored document.
	return localTs > remoteTs
		? { action: "push", value: localValue }
		: { action: "pull", value: remoteValue };
}

/** Apply a reconciliation decision through the engine for a given document.
 *
 *  `pull` seeds local state and re-aligns the offline mirror; `push`
 *  re-queues the local content as the outgoing write so it becomes the
 *  authoritative snapshot instead of vanishing. `none` does nothing. */
export function applyReconcile(opts: {
	engine: import("@/lib/useSyncedDocument").SyncEngine;
	path: UserDocPath;
	decision: ReconcileDecision;
	/** Seed local state from the pulled snapshot. */
	onPull?: (value: unknown) => void;
	/** Encode the value into Firestore fields for the outgoing write. */
	encode?: (value: unknown) => AnyRecord;
}): void {
	const { engine, path, decision, onPull, encode } = opts;
	if (decision.action === "none") return;
	if (decision.action === "pull") {
		onPull?.(decision.value);
		return;
	}
	// push — re-queue the local value with a fresh server-relative timestamp
	// (the server stamps the authoritative `updatedAt`; the client field only
	// needs to be newer than the rejected snapshot's timestamp).
	engine.enqueue({
		path,
		data: {
			...(encode?.(decision.value) ?? { value: decision.value }),
			updatedAt: Date.now(),
		},
	});
}
