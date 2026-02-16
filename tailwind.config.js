/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Zilla Slab", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#6965db",
          "primary-content": "#ffffff",
          accent: "#6965db",
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          "base-300": "#e9ecef",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#a9a5ff",
          accent: "#a9a5ff",
          "base-100": "#1a1a1a",
          "base-200": "#2d2d30",
          "base-300": "#3a3a40",
          "base-content": "#e8e8e8",
        },
      },
    ],
    darkTheme: "dark",
  },
};
