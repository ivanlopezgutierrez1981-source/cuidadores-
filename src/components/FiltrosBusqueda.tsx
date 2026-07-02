"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TIPO_CUIDADO_LABEL, type TipoCuidado } from "@/lib/types";

export interface FiltrosValores {
  zona?: string;
  tipo?: string;
  tarifaMax?: string;
  disponibilidad?: string;
}

const DISPONIBILIDAD_OPCIONES = [
  "Mañanas",
  "Tardes",
  "Noches",
  "Fines de semana",
  "Jornada completa",
  "Por horas",
  "Interna",
  "Externa",
];

export default function FiltrosBusqueda({ inicial }: { inicial: FiltrosValores }) {
  const router = useRouter();
  const [zona, setZona] = useState(inicial.zona ?? "");
  const [tipo, setTipo] = useState(inicial.tipo ?? "");
  const [tarifaMax, setTarifaMax] = useState(inicial.tarifaMax ?? "");
  const [disponibilidad, setDisponibilidad] = useState(inicial.disponibilidad ?? "");

  function aplicar(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (zona.trim()) params.set("zona", zona.trim());
    if (tipo) params.set("tipo", tipo);
    if (tarifaMax) params.set("tarifaMax", tarifaMax);
    if (disponibilidad.trim()) params.set("disponibilidad", disponibilidad.trim());
    router.push(`/buscar${params.toString() ? `?${params}` : ""}`);
  }

  function limpiar() {
    setZona("");
    setTipo("");
    setTarifaMax("");
    setDisponibilidad("");
    router.push("/buscar");
  }

  const hayFiltros = zona || tipo || tarifaMax || disponibilidad;

  return (
    <form
      onSubmit={aplicar}
      className="rounded-4xl border border-brand-100 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">Zona</label>
          <input
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Ciudad, barrio…"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">Tipo de cuidado</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            {(Object.keys(TIPO_CUIDADO_LABEL) as TipoCuidado[]).map((t) => (
              <option key={t} value={t}>
                {TIPO_CUIDADO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">Tarifa máx. (€/h)</label>
          <input
            inputMode="numeric"
            value={tarifaMax}
            onChange={(e) => setTarifaMax(e.target.value)}
            placeholder="Ej. 15"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">Disponibilidad</label>
          <input
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
            placeholder="Mañanas, fines de semana…"
            className={inputClass}
            list="filtro-disponibilidad"
          />
          <datalist id="filtro-disponibilidad">
            {DISPONIBILIDAD_OPCIONES.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="btn-primary !px-7 text-sm">
          Aplicar filtros
        </button>
        {hayFiltros && (
          <button type="button" onClick={limpiar} className="text-sm font-medium text-brand-500 hover:text-brand-700">
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass = "field";
