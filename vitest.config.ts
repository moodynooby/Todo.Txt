import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	test: {
		environment: "jsdom",
		// The upstream `advancedParser.test.ts` is a top-level assertion
		// script (Jest-style, no describe/it) that vitest reports as a
		// failed suite. Keep it untouched — it still runs via its own
		// console script — and exclude it from the vitest runner.
		exclude: ["**/advancedParser.test.ts"],
	},
});
