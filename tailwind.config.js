/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--ink-muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        accent: "var(--accent)",
        "on-accent": "var(--on-accent)",
        "accent-2": "var(--accent-2)",
        "on-accent-2": "var(--on-accent-2)",
        scrim: "var(--scrim)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        card: "var(--radius-card)",
        control: "var(--radius-control)",
      },
      borderWidth: {
        DEFAULT: "var(--bw)",
      },
      fontFamily: {
        ui: "var(--font-ui)",
        display: "var(--font-display)",
        num: "var(--font-num)",
      },
      boxShadow: {
        pop: "var(--shadow-pop)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
