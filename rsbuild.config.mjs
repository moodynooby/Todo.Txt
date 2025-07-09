import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { InjectManifest } from "@aaroon/workbox-rspack-plugin";
import path from "path";

// 👉 Rspack-style plugin to inject manifest - REMOVED

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
  html: {
    title: "T0do.TxT",
    favicon: "./src/assets/todotxt2.svg",
    meta: [
      {
        name: "theme-color",
        content: "#2EC6FE",
      },
    ],
    links: [
      {
        rel: "manifest",
        href: "manifest.json", // Link to the manifest file in public
      },
    ],
    icons: [
      { src: "./src/assets/icon192.svg", size: 192 },
      { src: "./src/assets/icon512_rounded.svg", size: 512 },
    ],
  },
  tools: {
    rspack: {
      plugins: [
        new InjectManifest({
          swSrc: path.resolve(__dirname, "src/sw.js"),
          swDest: "sw.js",

          maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
        }),
        // RspackManifestPlugin(), // 👈 Removed this plugin
      ],
    },
  },
});
