"use client";

import { useEffect, useState } from "react";

/**
 * Explainer animado (no es un vídeo real): recorre en bucle los 3 pasos de
 * la plataforma con movimiento suave, dentro del hueco de vídeo de
 * /como-funciona. Respeta prefers-reduced-motion (no autoavanza; se navega
 * con los puntos). Solo capa visual, sin dependencias externas.
 */

const TITULOS = [
  "1 · Busca sin registrarte",
  "2 · Compara perfiles",
  "3 · Contacta directamente",
];

const N = TITULOS.length;
const INTERVALO = 3400;

export default function ExplainerAnimado() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAuto(false);
      return;
    }
    if (!auto) return;
    const id = setInterval(() => setI((p) => (p + 1) % N), INTERVALO);
    return () => clearInterval(id);
  }, [auto]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Halos de fondo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Escenas apiladas */}
      <Escena activa={i === 0}>
        <EscenaBuscar />
      </Escena>
      <Escena activa={i === 1}>
        <EscenaComparar />
      </Escena>
      <Escena activa={i === 2}>
        <EscenaContactar />
      </Escena>

      {/* Etiqueta del paso */}
      <div className="pointer-events-none absolute left-0 right-0 top-5 flex justify-center">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-200 backdrop-blur">
          {TITULOS[i]}
        </span>
      </div>

      {/* Puntos de navegación */}
      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
        {Array.from({ length: N }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Ir al paso ${idx + 1}`}
            onClick={() => {
              setAuto(false);
              setI(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === i ? "w-7 bg-gold-400" : "w-2 bg-white/25 hover:bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Escena({ activa, children }: { activa: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center px-6 transition-all duration-700 ease-out ${
        activa ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/* ── Escena 1: buscador ─────────────────────────────────────────────── */
function EscenaBuscar() {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/95 p-2.5 shadow-soft sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cream px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-400" aria-hidden>
            <path d="M12 21s-7-5.6-7-11a7 7 0 1114 0c0 5.4-7 11-7 11z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-sm font-medium text-brand-800">
            Barcelona
            <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-brand-500 align-middle" />
          </span>
        </div>
        <span className="btn-primary pointer-events-none !py-3 text-sm">Buscar</span>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {["Niños", "Personas mayores", "Dependientes"].map((t, k) => (
          <span
            key={t}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              k === 1
                ? "bg-gold-400 text-brand-900"
                : "border border-white/15 bg-white/5 text-brand-100"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-brand-200">Sin registro · totalmente gratis</p>
    </div>
  );
}

/* ── Escena 2: comparar perfiles ────────────────────────────────────── */
function EscenaComparar() {
  const filas = [
    { n: "María G.", z: "Centro · Mayores", p: "12 €/h", dest: true },
    { n: "Lucía R.", z: "Eixample · Niños", p: "10 €/h", dest: false },
    { n: "Andrés P.", z: "Gràcia · Dependientes", p: "14 €/h", dest: false },
  ];
  return (
    <div className="w-full max-w-md space-y-2.5">
      {filas.map((c, k) => (
        <div
          key={c.n}
          className={`flex items-center gap-3 rounded-2xl border bg-white/95 p-3 shadow-card ${
            c.dest ? "border-gold-300 ring-1 ring-gold-200/70" : "border-white/10"
          }`}
          style={{ animation: `explainerIn 0.6s cubic-bezier(0.22,1,0.36,1) ${k * 0.12}s both` }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-serif text-base font-semibold text-brand-700">
            {c.n.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-brand-800">{c.n}</p>
              {c.dest && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold-300/80 bg-gradient-to-r from-gold-100 to-gold-200 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                  ★ Destacado
                </span>
              )}
            </div>
            <p className="text-xs text-brand-500">{c.z}</p>
          </div>
          <span className="text-sm font-semibold text-brand-700">{c.p}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Escena 3: contactar ────────────────────────────────────────────── */
function EscenaContactar() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-white/95 p-5 shadow-soft">
        <p className="text-xs font-medium text-brand-500">Mensaje a María G.</p>
        <div className="mt-3 rounded-2xl rounded-tl-sm bg-cream px-4 py-3 text-sm text-brand-800">
          «Hola, busco a alguien para acompañar a mi madre por las mañanas…»
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
            style={{ animation: "explainerIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Enviado
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-brand-200">Sin comisiones · el cuidador/a te responde</p>
    </div>
  );
}
