"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cuidadores_cookies_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function decide(value: "accept" | "reject") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="container-page rounded-2xl border border-brand-100 bg-white p-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm text-brand-700">
          Usamos cookies propias y de terceros para mejorar tu experiencia. Puedes
          aceptarlas o rechazar las no esenciales. Más info en nuestra{" "}
          <Link href="/cookies" className="font-semibold text-brand-600 underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
          <button onClick={() => decide("reject")} className="btn-secondary !px-4 !py-2 text-sm">
            Rechazar
          </button>
          <button onClick={() => decide("accept")} className="btn-primary !px-4 !py-2 text-sm">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
