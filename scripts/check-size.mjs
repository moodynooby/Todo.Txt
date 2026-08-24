import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Startup performance guard: the eager (index) chunk is what blocks first
// paint, so it gets its own hard budget — far stricter than workbox's
// per-file 2 MiB precache limit, which this also protects.
const INDEX_BUDGET_KB = Number(process.env.INDEX_BUDGET_KB ?? 600);
const PRECACHE_TOTAL_BUDGET_MB = Number(process.env.PRECACHE_BUDGET_MB ?? 14);

const assetsDir = join(process.cwd(), "dist", "assets");
const files = readdirSync(assetsDir);

const indexFile = files.find((f) => /^index-.*\.js$/.test(f));
if (!indexFile) {
	console.error("size-check: no index-*.js found in dist/assets");
	process.exit(1);
}
const indexKb = statSync(join(assetsDir, indexFile)).size / 1024;

const totalMb =
	files
		.filter((f) => /\.(js|css|html)$/.test(f))
		.reduce((sum, f) => sum + statSync(join(assetsDir, f)).size, 0) /
	(1024 * 1024);

console.log(
	`size-check: eager index ${indexKb.toFixed(0)} KB / ${INDEX_BUDGET_KB} KB budget, ` +
		`precache payload ~${totalMb.toFixed(1)} MB / ${PRECACHE_TOTAL_BUDGET_MB} MB`,
);

let failed = false;
if (indexKb > INDEX_BUDGET_KB) {
	console.error(
		`size-check FAIL: index bundle ${indexKb.toFixed(0)} KB exceeds ${INDEX_BUDGET_KB} KB. ` +
			"Move heavy imports behind dynamic import() instead of raising the budget.",
	);
	failed = true;
}
if (totalMb > PRECACHE_TOTAL_BUDGET_MB) {
	console.error(
		`size-check FAIL: precache payload ${totalMb.toFixed(1)} MB exceeds ${PRECACHE_TOTAL_BUDGET_MB} MB.`,
	);
	failed = true;
}
process.exit(failed ? 1 : 0);
