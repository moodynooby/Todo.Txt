import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

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
    favicon: "./public/todotxt2.svg",
    meta: [
      {
        name: "theme-color",
        content: "#2EC6FE",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "T0do.TxT" },
    ],
    icons: [
      { src: "./public/icon192.png", size: 192 },
      { src: "./public/icon512_rounded.png", size: 512 },
    ],
  },
  output: {
    assetPrefix: "/",
    distPath: {
      root: "dist",
      html: "./",
    },
  },
  source: {
    entry: {
      index: "./src/index.jsx",
    },
  },
  server: {
    publicDir: {
      name: "public",
    },
  },
  dev: {
    assetPrefix: "/",
    cache: false,
  },
});
