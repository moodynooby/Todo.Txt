import { describe, expect, it } from "vitest";
import { validateAiTodoOutput } from "./aiPrompts";

describe("validateAiTodoOutput", () => {
	it("accepts Todo.Txt lines and normalizes CRLF", () => {
		const result = validateAiTodoOutput(
			"(A) ship release +work @office due:2026-08-30\r\nx review notes",
		);

		expect(result.valid).toBe(true);
		expect(result.normalized).toBe(
			"(A) ship release +work @office due:2026-08-30\nx review notes",
		);
	});

	it("rejects an empty response", () => {
		const result = validateAiTodoOutput(" \n\t ");

		expect(result.valid).toBe(false);
		expect(result.error).toBe("The result is empty.");
	});

	it("rejects Markdown fences", () => {
		const result = validateAiTodoOutput("```\nbuy milk\n```");

		expect(result.valid).toBe(false);
		expect(result.error).toContain("code fences");
	});

	it("rejects Markdown headings even when the line otherwise looks task-like", () => {
		const result = validateAiTodoOutput("# Today\nbuy milk");

		expect(result.valid).toBe(false);
		expect(result.error).toContain("headings");
	});
});
