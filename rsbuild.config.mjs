import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  module: { rules: [{ test: /\.css$/, use: ["postcss-loader"], type: "css" }] },
  html: {
    title: "Todo.TxT",
    favicon: "./src/assets/todotxt_ico.png",
  },
});
