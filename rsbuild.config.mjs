import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Read package.json to get version
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = pkg.version;

// Update service worker version
const swSrcPath = './public/sw.js';
const swDestPath = './public/service-worker.js';

if (existsSync(swSrcPath)) {
  let swContent = readFileSync(swSrcPath, 'utf-8');
  swContent = swContent.replace(/const CACHE_VERSION = '[^']*'/, `const CACHE_VERSION = '${version}'`);
  
  // Ensure directory exists
  const destDir = join(process.cwd(), 'public');
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  
  writeFileSync(swDestPath, swContent);
  console.log(`Service worker generated with version ${version}`);
}

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
    filename: {
      js: `static/js/[name].${version}.[contenthash:8].js`,
      css: `static/css/[name].${version}.[contenthash:8].css`,
      svg: `static/media/[name].${version}.[contenthash:8][ext]`,
      font: `static/font/[name].${version}.[contenthash:8][ext]`,
      image: `static/image/[name].${version}.[contenthash:8][ext]`,
      media: `static/media/[name].${version}.[contenthash:8][ext]`
    },
    distPath: {
      media: "public",
    },
    copy: [
      { from: './public/service-worker.js', to: 'service-worker.js' },
    ],
    cleanDistPath: true,
  },
});
