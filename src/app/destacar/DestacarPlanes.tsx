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
    <div className="mx-auto mt-10 max-w-3xl">
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
              className={`relative flex flex-col rounded-3xl border bg-white p-7 shadow-card ${
                destacado ? "border-amber-300 ring-2 ring-amber-100" : "border-brand-100"
              }`}
            >
              {destacado && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                  Más elegido
                </span>
              )}
              <h3 className="text-lg font-semibold text-brand-800">{plan.nombre}</h3>
              <p className="mt-3">
                <span className="text-4xl font-extrabold text-brand-900">{plan.precioLabel}</span>
                <span className="ml-2 text-sm text-brand-500">pago único</span>
              </p>
              <p className="mt-2 text-sm text-brand-600">{plan.descripcion}</p>

              <ul className="mt-5 space-y-2 text-sm text-brand-700">
                <li className="flex items-center gap-2">
                  <Check /> {plan.dias} días en primera fila
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Badge ⭐ Destacado
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Más visibilidad ante las familias
                </li>
              </ul>

              <button
                onClick={() => pagar(plan.id)}
                disabled={cargando !== null}
                className={`mt-6 w-full ${destacado ? "btn-primary" : "btn-secondary"} disabled:opacity-60`}
              >
                {cargando === plan.id ? "Redirigiendo a Stripe…" : `Destacar por ${plan.precioLabel}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-brand-400">
        Pago seguro procesado por Stripe. No se trata de una suscripción: solo se cobra una vez.
      </p>
    </div>
  );
}

function Check() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-600">
      ✓
    </span>
  );
}
