import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { InjectManifest } from "@aaroon/workbox-rspack-plugin";
import WebpackPwaManifest from "webpack-pwa-manifest";
import path from "path";

// Resolve __dirname for ES modules
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

export default defineConfig({
  plugins: [pluginReact(), pluginSass(), pluginNodePolyfill()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
      },
    ],
  },
  // output.copy section removed as WebpackPwaManifest will handle manifest generation
  html: {
    title: "T0do.TxT",
    favicon: "./src/assets/todotxt2.svg", // This is for the HTML favicon link, not PWA icons
    meta: [
      {
        name: "theme-color",
        content: "#000000", // Must match WebpackPwaManifest theme_color
      },
    ],
    // html.icons is for favicons, apple-touch-icon etc., not directly for PWA manifest icons handled by WebpackPwaManifest
    icons: [
      { src: "./src/assets/icon192.svg", size: 192 }, // Example, adjust if these are your primary favicons
      { src: "./src/assets/icon512_rounded.svg", size: 512 },
    ],
    // html.tags for manifest link removed, WebpackPwaManifest will inject it
  },
  tools: {
    rspack: {
      plugins: [
        new InjectManifest({
          swSrc: path.resolve(__dirname, "src/sw.js"),
          swDest: "sw.js",
          maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
        }),
        new WebpackPwaManifest({
          name: "T0do.TxT",
          short_name: "todo",
          description: "A modern Todo.txt editor and viewer",
          start_url: ".", // Typically '.' or '/' - plugin handles publicPath context
          display: "standalone",
          orientation: "portrait",
          background_color: "#ffffff",
          theme_color: "#000000", // Must match html.meta theme-color
          categories: ["productivity", "utilities"],
          icons: [
            {
              src: path.resolve(__dirname, "src/assets/icon512_maskable.png"),
              sizes: [96, 128, 192, 256, 384, 512],
              purpose: "maskable",
              destination: path.join('assets', 'icons_pwa') // Keep PWA icons separate if needed
            },
            {
              src: path.resolve(__dirname, "src/assets/icon512_rounded.png"),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join('assets', 'icons_pwa')
            },
            {
              src: path.resolve(__dirname, "src/assets/icon192.png"), // if this is a distinct source
              sizes: [192], // or multiple: [72, 96, 128, 192, 256, 384, 512]
              destination: path.join('assets', 'icons_pwa')
            }
          ],
          filename: "manifest.webmanifest", // Output filename
          inject: true, // Critical: Injects <link rel="manifest"> into HTML
          fingerprints: false, // Recommended: false for manifest.webmanifest
          publicPath: '/', // Adjust if your app is not served from the root. Often 'auto' or null works.
        }),
      ],
    },
  },
});
