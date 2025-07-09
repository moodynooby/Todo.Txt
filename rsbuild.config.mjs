import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { InjectManifest } from "@aaroon/workbox-rspack-plugin";
import path from "path";

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
  output: {
    copy: [
      {
        from: './public', // Source directory (contains manifest.webmanifest)
        to: './',         // Target directory in the build output (e.g., dist/)
      },
    ],
  },
  html: {
    title: "T0do.TxT",
    favicon: "./src/assets/todotxt2.svg",
    meta: [
      {
        name: "theme-color",
        content: "#000000",
      },
    ],
    icons: [
      { src: "./src/assets/icon192.svg", size: 192 },
      { src: "./src/assets/icon512_rounded.svg", size: 512 },
    ],
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'manifest',
          href: 'manifest.webmanifest', // Changed: Path relative to output root, no leading slash
        },
        head: true, // Inject in the <head>
      },
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
        // RspackManifestPlugin removed
      ],
    },
  },
});
