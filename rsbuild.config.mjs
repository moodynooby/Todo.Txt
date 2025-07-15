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
    favicon: "public/todotxt2.svg",
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

    tags: [
      {
        tag: "link",
        attrs: { rel: "manifest", href: "/manifest.json" },
      },
    ],
  },
  source: {
    assetsInclude: /\.(png|svg)$/,

    entry: {
      index: "./src/index.jsx",
    },
  },
  output: {
    distPath: {
      media: "public",
    },
  },
});
