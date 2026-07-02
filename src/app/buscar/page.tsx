import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FiltrosBusqueda from "@/components/FiltrosBusqueda";
import CuidadorCard from "@/components/CuidadorCard";
import { TIPO_CUIDADO_LABEL, type Profile, type TipoCuidado } from "@/lib/types";

export const metadata: Metadata = {
  title: "Buscar cuidador/a",
  description:
    "Encuentra cuidadores y cuidadoras de niños, mayores y personas dependientes cerca de ti. Filtra por zona, tipo de cuidado y tarifa. Buscar y contactar es gratis.",
};

// Cada perfil de la vista incluye el flag destacado_activo.
type ProfilePublico = Profile & { destacado_activo: boolean };

const TIPOS_VALIDOS: TipoCuidado[] = ["ninos", "mayores", "dependientes"];

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const zona = typeof searchParams.zona === "string" ? searchParams.zona : "";
  const tipoRaw = typeof searchParams.tipo === "string" ? searchParams.tipo : "";
  const tipo = TIPOS_VALIDOS.includes(tipoRaw as TipoCuidado) ? (tipoRaw as TipoCuidado) : "";
  const tarifaMaxRaw =
    typeof searchParams.tarifaMax === "string" ? searchParams.tarifaMax : "";
  const disponibilidad =
    typeof searchParams.disponibilidad === "string" ? searchParams.disponibilidad : "";

  const tarifaMax = tarifaMaxRaw ? Number(tarifaMaxRaw.replace(",", ".")) : NaN;

  const supabase = createClient();

  // Solo perfiles con datos mínimos: foto + nombre + descripción.
  let query = supabase
    .from("profiles_publicos")
    .select("*")
    .not("foto_url", "is", null)
    .neq("foto_url", "")
    .not("descripcion", "is", null)
    .neq("descripcion", "")
    // ORDEN CLAVE: destacados primero, y entre ellos los más recientes.
    .order("destacado_activo", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);

  if (zona) query = query.ilike("zona", `%${zona}%`);
  if (tipo) query = query.eq("tipo_cuidado", tipo);
  if (!Number.isNaN(tarifaMax)) query = query.lte("tarifa_hora", tarifaMax);
  if (disponibilidad) query = query.ilike("disponibilidad", `%${disponibilidad}%`);

  const { data, error } = await query;
  const cuidadores = (data as ProfilePublico[] | null) ?? [];

  const hayFiltros = Boolean(zona || tipo || tarifaMaxRaw || disponibilidad);

  return (
    <section className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-900">
          {tipo ? `Cuidadores de ${TIPO_CUIDADO_LABEL[tipo].toLowerCase()}` : "Encuentra a tu cuidador/a"}
        </h1>
        <p className="mt-2 text-brand-600">
          Busca y contacta gratis, sin registro. Los perfiles{" "}
          <span className="font-semibold text-amber-600">⭐ destacados</span> aparecen primero.
        </p>
      </div>

      <FiltrosBusqueda inicial={{ zona, tipo, tarifaMax: tarifaMaxRaw, disponibilidad }} />

      {/* Resultados */}
      <div className="mt-8">
        {error ? (
          <EstadoVacio
            titulo="No se han podido cargar los cuidadores"
            texto="Ha ocurrido un problema al consultar la base de datos. Inténtalo de nuevo en unos segundos."
          />
        ) : cuidadores.length === 0 ? (
          <EstadoVacio
            titulo={hayFiltros ? "No hay cuidadores con esos filtros" : "Aún no hay cuidadores publicados"}
            texto={
              hayFiltros
                ? "Prueba a ampliar la búsqueda: quita algún filtro o aumenta la tarifa máxima."
                : "Vuelve pronto: cada día se incorporan nuevos cuidadores y cuidadoras."
            }
            mostrarReset={hayFiltros}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-brand-500">
              {cuidadores.length} cuidador{cuidadores.length === 1 ? "" : "es"} encontrad
              {cuidadores.length === 1 ? "o" : "os"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cuidadores.map((c) => (
                <CuidadorCard key={c.id} cuidador={c} destacado={c.destacado_activo} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function EstadoVacio({
  titulo,
  texto,
  mostrarReset,
}: {
  titulo: string;
  texto: string;
  mostrarReset?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-brand-200 bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">
        🔎
      </div>
      <h2 className="mt-5 text-xl font-semibold text-brand-800">{titulo}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-600">{texto}</p>
      {mostrarReset && (
        <Link href="/buscar" className="btn-primary mt-6 text-sm">
          Ver todos los cuidadores
        </Link>
      )}
    </div>
  );
}
