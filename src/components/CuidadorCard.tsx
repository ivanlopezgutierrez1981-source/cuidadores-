import Link from "next/link";
import Image from "next/image";
import { TIPO_CUIDADO_LABEL, type Profile } from "@/lib/types";

// Tarjeta de cuidador para el listado público (/buscar).
// `destacado` viene calculado desde la vista profiles_publicos.
export default function CuidadorCard({
  cuidador,
  destacado,
}: {
  cuidador: Profile;
  destacado: boolean;
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft ${
        destacado ? "border-amber-200 ring-1 ring-amber-100" : "border-brand-100"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
        {cuidador.foto_url ? (
          <Image
            src={cuidador.foto_url}
            alt={cuidador.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-brand-400">
            {cuidador.nombre.charAt(0).toUpperCase()}
          </span>
        )}
        {destacado && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow-soft">
            ⭐ Destacado
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {TIPO_CUIDADO_LABEL[cuidador.tipo_cuidado]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-brand-800">{cuidador.nombre}</h3>
          {cuidador.tarifa_hora != null && (
            <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600">
              {formatearTarifa(cuidador.tarifa_hora)}/h
            </span>
          )}
        </div>

        {cuidador.zona && (
          <p className="mt-1 flex items-center gap-1 text-sm text-brand-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 21s-7-5.6-7-11a7 7 0 1114 0c0 5.4-7 11-7 11z" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            {cuidador.zona}
          </p>
        )}

        {cuidador.descripcion && (
          <p className="mt-3 line-clamp-2 text-sm text-brand-600">{cuidador.descripcion}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-brand-500">
          {cuidador.experiencia_anios ? (
            <span className="rounded-full bg-cream px-2.5 py-1">
              {cuidador.experiencia_anios} año{cuidador.experiencia_anios === 1 ? "" : "s"} exp.
            </span>
          ) : null}
          {cuidador.disponibilidad && (
            <span className="rounded-full bg-cream px-2.5 py-1">{cuidador.disponibilidad}</span>
          )}
        </div>

        <Link
          href={`/cuidador/${cuidador.id}`}
          className="btn-primary mt-5 w-full text-sm"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}

export function formatearTarifa(n: number): string {
  // 12 → "12 €", 12.5 → "12,50 €"
  const esEntero = Number.isInteger(n);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: esEntero ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}
