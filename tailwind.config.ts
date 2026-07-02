import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta suave, cálida y de confianza
        brand: {
          50: "#f0f9f7",
          100: "#d9f0ea",
          200: "#b4e1d6",
          300: "#85cbbc",
          400: "#56ad9d",
          500: "#3a9183", // verde principal
          600: "#2c746a",
          700: "#265d56",
          800: "#224b46",
          900: "#1f3f3b",
        },
        sky: {
          50: "#f0f7fb",
          100: "#dceef6",
          200: "#bcdeee",
          300: "#8ec5e0",
          400: "#59a6cd",
          500: "#3889b6", // azul suave
          600: "#2c6e98",
          700: "#27597b",
          800: "#254b66",
          900: "#234057",
        },
        cream: "#fbf8f3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -2px rgba(38, 93, 86, 0.10)",
        card: "0 2px 12px -2px rgba(38, 93, 86, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
