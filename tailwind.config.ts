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
           MARCA — Verde teal / salvia (Brand Guide 1.0).
           "El verde como señal de vida y cuidado." Vivo en 500 para
           logo/acentos, salvia en 600 para cuerpo y botón primario,
           profundo en 700-900 para titulares y fondos oscuros.
           ───────────────────────────────────────────────────────── */
        brand: {
          50: "#eaf4f0",
          100: "#d3e8e1",
          200: "#aed6ca",
          300: "#82bbac",
          400: "#4ba394", // verde claro
          500: "#2d8a79", // verde principal (logo, .xyz, acentos, enlaces)
          600: "#2f6f5f", // salvia — texto de cuerpo y botón primario
          700: "#1f5748", // verde profundo (hover, texto fuerte)
          800: "#17463a",
          900: "#1a3530", // titulares / fondos oscuros (overlay de marca)
        },
        /* ACENTO CÁLIDO — Tierra / caramelo. "Tierra para calidez."
           Badges de Destacado/Premium, líneas de acento, CTA estrella.
           (Mantiene el nombre `gold` por compatibilidad de clases.) */
        gold: {
          50: "#f7efe4",
          100: "#efe0cc",
          200: "#e2c9a8",
          300: "#d3ac7f",
          400: "#c4956a", // tierra
          500: "#b07f52",
          600: "#946843",
          700: "#6f4e33",
        },
        /* ACENTO CORAL — Destructivo / errores / puntos de energía. */
        coral: {
          50: "#fdeeeb",
          100: "#f9d6cf",
          200: "#f2ab9e",
          300: "#e58270",
          400: "#d05a4a", // coral principal
          500: "#bd4636",
          600: "#9e3729",
          700: "#7c2c22",
        },
        /* Fondos crema / hueso */
        cream: "#fdfaf5", // blanco cálido (fondo de página)
        bone: "#ede8df", // beige (sección alterna)
      },
      fontFamily: {
        // Cuerpo / interfaz: DM Sans
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        // Display / titulares: DM Serif Display
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 14px 40px -12px rgba(26,53,48,0.16), 0 4px 12px -6px rgba(26,53,48,0.08)",
        card: "0 6px 20px -10px rgba(26,53,48,0.13), 0 2px 6px -4px rgba(26,53,48,0.06)",
        lift: "0 24px 56px -16px rgba(26,53,48,0.24), 0 10px 24px -12px rgba(26,53,48,0.10)",
        gold: "0 12px 32px -10px rgba(196,149,106,0.45)",
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
