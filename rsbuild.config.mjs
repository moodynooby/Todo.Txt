import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';


export default defineConfig({
  plugins: [pluginReact(), pluginSass(), pluginNodePolyfill()],
  module: { rules: [{ test: /\.css$/, use: ["postcss-loader"], type: "css" }] },
  html: {
    title: "T0do.TxT",
    favicon: "./src/assets/todotxt2.svg",
    appIcon: {
      name: "T0do.TxT",
      short_name: "T0do",
      orientation: "portrait",
      display: "standalone",
      background_color: "#2EC6FE",
      theme_color: "#605dff",
      icons: [
        { src: "./src/assets/todotxt2.svg", size: 192 },
        { src: "./src/assets/todotxt2.svg", size: 512 },
      ],
    },
  },
});
