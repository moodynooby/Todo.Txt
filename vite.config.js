import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    basicSsl(),
  ],
  css: {
    postcss: './postcss.config.mjs',
  },
  publicDir: 'public',
  server: {
    open: true,
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
