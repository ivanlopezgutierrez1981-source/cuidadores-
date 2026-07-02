"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TIPO_CUIDADO_LABEL, type TipoCuidado } from "@/lib/types";

export default function SearchBar() {
  const router = useRouter();
  const [zona, setZona] = useState("");
  const [tipo, setTipo] = useState<TipoCuidado | "">("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (zona.trim()) params.set("zona", zona.trim());
    if (tipo) params.set("tipo", tipo);
    router.push(`/buscar${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-3 shadow-soft sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand-400" aria-hidden>
          <path d="M12 21s-7-5.6-7-11a7 7 0 1114 0c0 5.4-7 11-7 11z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          type="text"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          placeholder="¿En qué zona? (ciudad, barrio…)"
          className="w-full bg-transparent text-sm text-brand-800 placeholder:text-brand-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5 sm:w-56">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand-400" aria-hidden>
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
          <path d="M5 20a7 7 0 0114 0" stroke="currentColor" strokeWidth="2" />
        </svg>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoCuidado | "")}
          className="w-full bg-transparent text-sm text-brand-800 focus:outline-none"
        >
          <option value="">Tipo de cuidado</option>
          {(Object.keys(TIPO_CUIDADO_LABEL) as TipoCuidado[]).map((t) => (
            <option key={t} value={t}>
              {TIPO_CUIDADO_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary sm:!px-8">
        Buscar
      </button>
    </form>
  );
}
