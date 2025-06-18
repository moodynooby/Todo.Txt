import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  module: {    rules: [      {        test: /\.css$/,        use: ["postcss-loader"],        type: "css",      },       ],  },
  html: {
    title: 'Todo.TxT',
    favicon: './src/assets/todotxt_ico.png',
  },
});
