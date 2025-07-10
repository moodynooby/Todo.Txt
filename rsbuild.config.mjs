import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { GenerateSW } from "workbox-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginNodePolyfill(),
    {
      name: "workbox",
      setup(api) {
        api.modifyRsbuildConfig((config) => {
          return {
            ...config,
            tools: {
              ...config.tools,
              rspack: (config) => {
                config.plugins = config.plugins || [];
                config.plugins.push(
                  new GenerateSW({
                    clientsClaim: true,
                    skipWaiting: true,
                    swDest: "sw.js",
                    exclude: [/\/404\.html$/],
                    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
                  }),
                );
                return config;
              },
            },
          };
        });
      },
    },
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
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "T0do.TxT" },
    ],
    manifest: {
      name: "T0do.TxT",
      short_name: "todo.txt",
      description: "A simple Todo.txt application.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      display_override: ["window-controls-overlay", "standalone", "fullscreen"],
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
        // Conditionally apply GenerateSW plugin only in production
        isProduction &&
          new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            swDest: "sw.js",
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.mode === "navigate",
                handler: "NetworkFirst",
                options: {
                  cacheName: "html-documents",
                  expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 24 * 60 * 60, // 24 hours
                  },
                },
              },
              {
                urlPattern: /\/api\//,
                handler: "StaleWhileRevalidate",
                options: {
                  cacheName: "api-data",
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 5 * 24 * 60 * 60, // 5 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                handler: "CacheFirst",
                options: {
                  cacheName: "images",
                  expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
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
      ].filter(Boolean), // Filter out false values from the array
    },
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
