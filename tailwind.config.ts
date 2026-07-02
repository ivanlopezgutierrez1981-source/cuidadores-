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
        /* ─────────────────────────────────────────────────────────
           MARCA — Verde profundo bosque / petróleo.
           Tonos medios desaturados y cálidos (grises verdosos) para
           que sirvan como texto de cuerpo; extremos oscuros para
           titulares y botones primarios; claros para fondos y bordes.
           ───────────────────────────────────────────────────────── */
        brand: {
          50: "#f4f7f5",
          100: "#e5ece8",
          200: "#c9d8d0",
          300: "#a3bcb0",
          400: "#74968a", // muted / placeholders
          500: "#517263", // acentos, iconos
          600: "#3f5a4e", // texto de cuerpo (gris cálido verdoso)
          700: "#314a3f", // texto fuerte / navegación
          800: "#263b32", // botón primario (verde profundo)
          900: "#1b2b24", // titulares (casi negro bosque)
        },
        /* ACENTO PREMIUM — Dorado tenue / champán. Úsese con moderación:
           CTA estrella, badges de "Destacado", líneas de acento. */
        gold: {
          50: "#faf6ea",
          100: "#f2e7c9",
          200: "#e6d1a0",
          300: "#d7b878",
          400: "#c9a961", // champán principal
          500: "#b8935a",
          600: "#9a7947",
          700: "#786037",
        },
        /* Azul suave heredado — apenas usado, se mantiene por compatibilidad */
        sky: {
          50: "#f0f7fb",
          100: "#dceef6",
          200: "#bcdeee",
          300: "#8ec5e0",
          400: "#59a6cd",
          500: "#3889b6",
          600: "#2c6e98",
          700: "#27597b",
          800: "#254b66",
          900: "#234057",
        },
        /* Fondos crema / hueso */
        cream: "#faf8f3", // fondo de página (hueso claro)
        bone: "#f3efe6", // sección alterna, un punto más profundo
      },
      fontFamily: {
        // Cuerpo: sans limpia y legible
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Titulares: serif moderna con carácter premium
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        // Sombras suaves y en capas (nada de sombras duras)
        soft: "0 14px 40px -12px rgba(28,45,38,0.14), 0 4px 12px -6px rgba(28,45,38,0.08)",
        card: "0 6px 20px -10px rgba(28,45,38,0.12), 0 2px 6px -4px rgba(28,45,38,0.06)",
        lift: "0 24px 56px -16px rgba(28,45,38,0.22), 0 10px 24px -12px rgba(28,45,38,0.10)",
        gold: "0 12px 32px -10px rgba(184,147,90,0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
