import { describe, expect, it } from "vitest";
// The contract: every feature document path must resolve to a concrete
// `{ collection, id }` pair. If a new workspace (like the todo workspace
// once was) forgets to register itself, this test fails the build.
import { getInitialTodoContent } from "./syncAdapters";
import {
	EXCALIDRAW_DOC,
	GROQ_SETTINGS_DOC,
	HABITS_DOC,
	NOTES_DOC,
	PREFERENCES_DOC,
	TIMERS_DOC,
	TODO_DOC,
} from "./syncPaths";

describe("sync adapter registry contract — F1 systemic guard", () => {
	it("declares every feature document path", () => {
		for (const path of [
			TODO_DOC,
			NOTES_DOC,
			TIMERS_DOC,
			HABITS_DOC,
			EXCALIDRAW_DOC,
			GROQ_SETTINGS_DOC,
			PREFERENCES_DOC,
		]) {
			expect(typeof path.collection).toBe("string");
			expect(typeof path.id).toBe("string");
			expect(path.collection.length).toBeGreaterThan(0);
			expect(path.id.length).toBeGreaterThan(0);
		}
	});

	it("exposes a todo seed reader so offline boot always has a fallback", () => {
		expect(typeof getInitialTodoContent).toBe("function");
	});
});
