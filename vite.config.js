import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
	name: "T0do.TxT",
	short_name: "todo.txt",
	description: "A simple Todo.txt application.",
	start_url: ".",
	scope: ".",
	display: "standalone",
	display_override: ["window-controls-overlay", "standalone", "fullscreen"],
	background_color: "#1a1b1e",
	theme_color: "#2EC6FE",
	categories: ["productivity", "utilities"],
	orientation: "portrait-primary",
	// Long-press app shortcuts (installed PWA) — deep-link via ?view= which
	// ViewContext reads once at startup.
	shortcuts: [
		{
			name: "New task",
			short_name: "New task",
			url: "/?view=todo",
		},
		{
			name: "Habits",
			url: "/?view=habits",
		},
		{
			name: "Notes",
			url: "/?view=notes",
		},
	],
	icons: [
		{
			src: "icon192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "icon512_rounded.png",
			sizes: "512x512",
			type: "image/png",
		},
		{
			src: "icon512_maskable.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable",
		},
	],
	// Fix F10: the share target previously POSTed to `/`, which a static SPA
	// cannot handle — shared text and files vanished silently in web builds.
	// A GET share target delivers the payload as query parameters
	// (`?title=...&text=...&url=...`), which the app reads from the URL at
	// load and can act on (handled by the share-import flow). File sharing is
	// a multipart-only capability and is therefore no longer advertised; text
	// and URL shares remain fully supported.
	share_target: {
		action: "/",
		method: "GET",
		params: {
			title: "title",
			text: "text",
			url: "url",
		},
	},
};

// The Tauri CLI exports TAURI_ENV_* for beforeBuild/beforeDev commands. The
// service worker is web-host only: inside Tauri the custom protocol already
// serves assets from disk, so precaching ~10 MB on every launch is pure
// startup overhead with no offline benefit.
const isTauri = Boolean(process.env.TAURI_ENV_PLATFORM);

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "src"),
		},
	},
	plugins: [
		react(),
		...(isTauri
			? []
			: [
					VitePWA({
						registerType: "autoUpdate",
						includeAssets: ["**/*.{png,svg,ttf}"],
						manifest,
						workbox: {
							globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
						},
					}),
				]),
	],
	publicDir: "public",
	server: {
		host: true,
		port: 5173,
		strictPort: true,
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		emptyOutDir: true,
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				// The Kotlin/JS core bundle (~1 MB) is now used by the main app
				// (parsing, streaks), not just the lazy sync page. Keep it in its
				// own chunk so neither it nor index crosses workbox's 2 MiB
				// per-file precache limit.
				manualChunks(id) {
					const path = id.replaceAll("\\", "/");
					if (path.includes("/@todotxt/")) {
						return "todotxt-core";
					}
					// Firebase lives in its own chunk: local-only sessions (no .env
					// configured) never execute it, and signed-in sessions get stable
					// caching across app releases.
					if (
						path.includes("/node_modules/@firebase/") ||
						path.includes("/node_modules/firebase/")
					) {
						return "firebase";
					}
					return undefined;
				},
			},
		},
	},
	preview: {
		port: 4173,
		strictPort: false,
	},
});
