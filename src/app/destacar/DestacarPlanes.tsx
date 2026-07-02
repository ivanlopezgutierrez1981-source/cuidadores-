"use client";

import { useState } from "react";
import { PLANES, type PlanDestacado } from "@/lib/types";

export default function DestacarPlanes() {
  const [cargando, setCargando] = useState<PlanDestacado | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pagar(plan: PlanDestacado) {
    setError(null);
    setCargando(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "No se ha podido iniciar el pago.");
        setCargando(null);
        return;
      }
      // Redirigir a Stripe Checkout.
      window.location.href = data.url as string;
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setCargando(null);
    }
  }

  const planes = Object.values(PLANES);

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {planes.map((plan) => {
          const destacado = plan.id === "mensual"; // resaltamos el mensual
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-4xl border bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                destacado ? "border-gold-300 ring-2 ring-gold-200/70" : "border-brand-100"
              }`}
            >
              {destacado && (
                <span className="badge-gold absolute -top-3 left-1/2 -translate-x-1/2 shadow-sm">
                  <StarIcon /> Más elegido
                </span>
              )}
              <h3 className="font-serif text-xl font-semibold text-brand-900">{plan.nombre}</h3>
              <p className="mt-3">
                <span className="font-serif text-5xl font-semibold text-brand-900">{plan.precioLabel}</span>
                <span className="ml-2 text-sm text-brand-500">pago único</span>
              </p>
              <p className="mt-2 text-sm text-brand-600">{plan.descripcion}</p>

              <ul className="mt-6 space-y-2.5 text-sm text-brand-700">
                <li className="flex items-center gap-2.5">
                  <Check /> {plan.dias} días en primera fila
                </li>
                <li className="flex items-center gap-2.5">
                  <Check /> Badge Destacado dorado
                </li>
                <li className="flex items-center gap-2.5">
                  <Check /> Más visibilidad ante las familias
                </li>
              </ul>

              <button
                onClick={() => pagar(plan.id)}
                disabled={cargando !== null}
                className={`mt-7 w-full ${destacado ? "btn-gold" : "btn-secondary"} disabled:opacity-60`}
              >
                {cargando === plan.id ? "Redirigiendo a Stripe…" : `Destacar por ${plan.precioLabel}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-7 text-center text-xs text-brand-400">
        Pago seguro procesado por Stripe. No se trata de una suscripción: solo se cobra una vez.
      </p>
    </div>
  );
}

function Check() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.26L21.6 9l-4.8 4.68L18 21l-6-3.2L6 21l1.2-7.32L2.4 9l6.7-.74L12 2z" />
    </svg>
  );
}
