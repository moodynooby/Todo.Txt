/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Zilla Slab", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        'todo-dark': '#121212',
        'todo-card': '#1e1e1e',
        'todo-gray': '#333333',
        'priority-a': '#f87171',
        'priority-b': '#fbbf24',
        'priority-c': '#fde047',
        'project': '#60a5fa',
        'context': '#a78bfa',
        'muted': '#9ca3af',
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
