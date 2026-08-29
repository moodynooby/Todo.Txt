import { afterEach, describe, expect, it, vi } from "vitest";
import { readTodoBackup, TODO_BACKUP_KEY, writeTodoBackup } from "./todoBackup";

const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
	getItem: (k: string) => {
		const v = store.get(k);
		return v === undefined ? null : v;
	},
	setItem: (k: string, v: string) => store.set(k, v),
	removeItem: (k: string) => store.delete(k),
} as unknown as Storage);

afterEach(() => store.clear());

describe("todo backup — F1 data-loss guard", () => {
	it("round-trips content with a monotonic timestamp", () => {
		const before = Date.now();
		writeTodoBackup("-[ ] buy milk");
		const after = Date.now();
		const backup = readTodoBackup();
		expect(backup?.content).toBe("-[ ] buy milk");
		expect(backup?.updatedAt ?? 0).toBeGreaterThanOrEqual(before);
		expect(backup?.updatedAt ?? 0).toBeLessThanOrEqual(after);
	});

	it("reads the legacy plain-string format instead of losing it", () => {
		store.set(TODO_BACKUP_KEY, "plain string legacy backup");
		const backup = readTodoBackup();
		expect(backup?.content).toBe("plain string legacy backup");
		expect(backup?.updatedAt).toBe(0);
	});

	it("returns null for an empty store rather than throwing", () => {
		expect(readTodoBackup()).toBeNull();
	});

	it("never requires an explicit delete: reads are idempotent and cheap", () => {
		writeTodoBackup("line 1\nline 2");
		expect(readTodoBackup()?.content).toBe("line 1\nline 2");
		expect(readTodoBackup()?.content).toBe("line 1\nline 2");
	});
});
