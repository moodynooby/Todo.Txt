import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
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
