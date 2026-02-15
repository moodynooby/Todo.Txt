import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  publicDir: "public",
  server: {
    open: true,
    port: 5173,
    strictPort: true,
    middlewareMode: false,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    sourcemap: false,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
