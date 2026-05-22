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
	background_color: "#ffffff",
	theme_color: "#2EC6FE",
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
};

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["**/*.{png,svg,ttf}"],
			manifest,
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
			},
		}),
	],
	publicDir: "public",
	server: {
		port: 5173,
		strictPort: false,
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		emptyOutDir: true,
		cssCodeSplit: true,
	},
	preview: {
		port: 4173,
		strictPort: false,
	},
});
