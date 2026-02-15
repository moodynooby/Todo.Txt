/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Architects Daughter", "cursive"],
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
          "base-100": "#121212",
          "base-200": "#1e1e1e",
          "base-300": "#2d2d2d",
        },
      },
    ],
    darkTheme: "dark",
  },
};
