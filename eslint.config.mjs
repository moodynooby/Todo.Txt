import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import react from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: "detect" },
      },
    },
    reactJsx,
  ]),
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-undef": "off",
    },
  },
  { ignores: ["dist/", "src/sw.js"] },
];
