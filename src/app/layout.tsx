import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Serif moderna con carácter para los titulares (aire clínica premium)
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cuidadores.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "cuidadores.xyz — Encuentra cuidadores de confianza",
    template: "%s · cuidadores.xyz",
  },
  description:
    "Marketplace que conecta familias con cuidadores y cuidadoras de niños, mayores y personas dependientes. Busca y contacta gratis.",
  keywords: [
    "cuidadores",
    "cuidadoras",
    "cuidado de mayores",
    "canguro",
    "cuidado de niños",
    "personas dependientes",
  ],
  openGraph: {
    title: "cuidadores.xyz — Encuentra cuidadores de confianza",
    description:
      "Conectamos familias con cuidadores y cuidadoras de confianza. Busca y contacta gratis.",
    url: siteUrl,
    siteName: "cuidadores.xyz",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
