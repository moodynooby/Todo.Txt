import { spawnSync } from "node:child_process";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const native = resolve(root, "native");
const source = resolve(native, "app/build/dist/wasmJs/productionExecutable");
const destination = resolve(root, "dist");

const gradle = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const result = spawnSync(
	gradle,
	[
		":app:wasmJsBrowserDistribution",
		"--no-daemon",
					"--max-workers=1",
			"-Dkotlin.compiler.execution.strategy=in-process",
			"-Dkotlin.daemon.jvmargs=-Xmx768m",
			"--console=plain",

	],
	{ cwd: native, stdio: "inherit", shell: process.platform === "win32" },
);

if (result.status !== 0) {
	process.exit(result.status ?? 1);
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });

const htmlPath = resolve(destination, "index.html");
const html = readFileSync(htmlPath, "utf8")
	.replaceAll(
		"%TODO_TXT_FIREBASE_API_KEY%",
		JSON.stringify(
			process.env.FIREBASE_API_KEY ?? process.env.PUBLIC_FIREBASE_API_KEY ?? "",
		),
	)
	.replaceAll(
		"%TODO_TXT_FIREBASE_PROJECT_ID%",
		JSON.stringify(
			process.env.FIREBASE_PROJECT_ID ??
				process.env.PUBLIC_FIREBASE_PROJECT_ID ??
				"",
		),
	);
writeFileSync(htmlPath, html);

// Source maps are useful for local debugging but should not be transferred to
// users or exposed in the public production directory.
rmSync(resolve(destination, "app.js.map"), { force: true });
console.log(`KMP/Wasm web distribution copied to ${destination}`);
