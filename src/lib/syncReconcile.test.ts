/** Behavioral tests for startup reconciliation (fix S3).
 *
 * The rule: server-clock-only comparison between the last synced local
 * mirror and the remote snapshot. Local offline edits win only when the
 * local seed's recorded server timestamp beats the remote's; identical
 * content never triggers a push. Both sides missing or empty produces
 * `none`.
 */
import { describe, expect, it } from "vitest";
import type { DocSnapshot } from "@/lib/firestoreClient";
import { decideReconcile } from "@/lib/syncReconcile";

const snap = (
	exists: boolean,
	value: unknown,
	updatedAt: number,
): DocSnapshot<{ value?: unknown; content?: unknown; habits?: unknown }> => ({
	exists,
	data: exists ? { value, content: value, habits: value } : undefined,
	updatedAt,
});

describe("decideReconcile", () => {
	it("pulls when there is no local seed", () => {
		expect(
			decideReconcile(snap(true, "remote", 500), {
				valueKey: "content",
				seed: null,
			}),
		).toEqual({
			action: "pull",
			value: "remote",
		});
	});

	it("pulls when the remote beats the local server timestamp", () => {
		expect(
			decideReconcile(snap(true, "remote", 900), {
				valueKey: "content",
				seed: { localSeed: { value: "local", updatedAt: 800 } },
			}),
		).toEqual({ action: "pull", value: "remote" });
	});

	it("pushes local offline edits when the local seed beats the remote", () => {
		expect(
			decideReconcile(snap(true, "remote", 700), {
				valueKey: "content",
				seed: { localSeed: { value: "local-edits", updatedAt: 800 } },
			}),
		).toEqual({ action: "push", value: "local-edits" });
	});

	it("returns none when content is identical", () => {
		expect(
			decideReconcile(snap(true, "same", 700), {
				valueKey: "content",
				seed: { localSeed: { value: "same", updatedAt: 800 } },
			}),
		).toEqual({ action: "none" });
	});

	it("returns none when neither side exists", () => {
		expect(
			decideReconcile(snap(false, undefined, 0), {
				valueKey: "content",
				seed: null,
			}),
		).toEqual({
			action: "none",
		});
	});

	it("pushes local content when there is no remote document (new user)", () => {
		expect(
			decideReconcile(snap(false, undefined, 0), {
				valueKey: "content",
				seed: { localSeed: { value: "offline-content", updatedAt: 100 } },
			}),
		).toEqual({ action: "push", value: "offline-content" });
	});

	it("treats empty string local as having nothing to defend", () => {
		expect(
			decideReconcile(snap(true, "remote", 500), {
				valueKey: "content",
				seed: { localSeed: { value: "", updatedAt: 999 } },
			}),
		).toEqual({ action: "pull", value: "remote" });
	});

	it("equal server timestamps resolve to the remote (stable tie-break)", () => {
		expect(
			decideReconcile(snap(true, "remote", 500), {
				valueKey: "content",
				seed: { localSeed: { value: "local", updatedAt: 500 } },
			}),
		).toEqual({ action: "pull", value: "remote" });
	});

	it("uses the configured valueKey to read the remote value", () => {
		expect(
			decideReconcile(
				{
					exists: true,
					data: { habits: [{ id: "h1" }], value: "other" },
					updatedAt: 100,
				},
				{
					valueKey: "habits",
					seed: null,
				},
			),
		).toEqual({ action: "pull", value: [{ id: "h1" }] });
	});
});
