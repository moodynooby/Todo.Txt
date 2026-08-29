import { describe, expect, it } from "vitest";
import { chooseForeground, contrastRatio } from "./contrast";

describe("dynamic contrast", () => {
	it("chooses AA-readable text for light and dark surfaces", () => {
		const lightText = chooseForeground("#fff475");
		const darkText = chooseForeground("#1e1e1e");
		expect(contrastRatio("#fff475", lightText)).toBeGreaterThanOrEqual(4.5);
		expect(contrastRatio("#1e1e1e", darkText)).toBeGreaterThanOrEqual(4.5);
	});

	it("supports short hex values and rejects malformed colors", () => {
		expect(contrastRatio("#fff", "#111827")).not.toBeNull();
		expect(contrastRatio("#fff", "zzzz")).toBeNull();
		expect(chooseForeground("not-a-color")).toBe("#111827");
	});
});
