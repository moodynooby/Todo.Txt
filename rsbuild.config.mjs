import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { GenerateSW } from "workbox-webpack-plugin";

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
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "T0do.TxT" },
    ],
    manifest: {
      name: "T0do.TxT",
      short_name: "T0do.TxT",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2EC6FE",
      icons: [
        {
          src: "./src/assets/icon192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./src/assets/icon512_rounded.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./src/assets/icon512_maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    icons: [
      { src: "./src/assets/icon192.png", size: 192 },
      { src: "./src/assets/icon512_rounded.png", size: 512 },
    ],
  },
  tools: {
    rspack: {
      plugins: [
        new GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
          swDest: "sw.js",
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
              },
            },
          ],
        }),
      ],
    },
  },
  output: {
    assetPrefix: "/",
    distPath: {
      root: "dist",
      html: "./",
    }
  },
  source: {
    entry: {
      index: "./src/index.jsx",
    },
  },
  server: {
    publicDir: {
      name: "public",
    }
  },
  dev: {
    assetPrefix: "/",
  }
});
