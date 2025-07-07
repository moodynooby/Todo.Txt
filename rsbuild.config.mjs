import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { InjectManifest } from "@aaroon/workbox-rspack-plugin";
import path from "path";

// 👉 Rspack-style plugin to inject manifest
const RspackManifestPlugin = () => ({
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("RspackManifestPlugin", (compilation) => {
      const manifest = {
        name: "T0do.TxT",
        short_name: "todo",
        start_url: "/index.html",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "./assets/icon512_maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./assets/icon512_rounded.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./assets/icon192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      };

      compilation.emitAsset(
        "manifest.webmanifest",
        new compiler.webpack.sources.RawSource(JSON.stringify(manifest, null, 2))
      );
    });
  },
});

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginNodePolyfill(),
  ],
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
    icons: [
      { src: "./src/assets/icon192.svg", size: 192 },
      { src: "./src/assets/icon512_rounded.svg", size: 512 },
    ]
  },
  tools: {
    rspack: {
      plugins: [
        new InjectManifest({
          swSrc: path.resolve(__dirname, "src/sw.js"),
          swDest: "sw.js",
        }),
        RspackManifestPlugin(), // 👈 here's the magic
      ],
    },
  },
});
