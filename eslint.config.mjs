import { fixupConfigRules } from "@eslint/compat";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import react from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: ["dist/", "public/", "node_modules/"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
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
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "warn",
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unresolved": "off",
      "import/named": "warn",
      "import/default": "off",
      "import/namespace": "off",
    },
  },
];
