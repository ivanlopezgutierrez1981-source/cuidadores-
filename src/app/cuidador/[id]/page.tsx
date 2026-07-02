import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/ContactForm";
import { formatearTarifa } from "@/components/CuidadorCard";
import { TIPO_CUIDADO_LABEL, type Profile } from "@/lib/types";

type ProfilePublico = Profile & { destacado_activo: boolean };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getCuidador(id: string): Promise<ProfilePublico | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles_publicos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as ProfilePublico | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const c = await getCuidador(params.id);
  if (!c) return { title: "Cuidador/a no encontrado" };

  const tipo = TIPO_CUIDADO_LABEL[c.tipo_cuidado].toLowerCase();
  const desc =
    c.descripcion?.slice(0, 155) ||
    `${c.nombre}, cuidador/a de ${tipo}${c.zona ? ` en ${c.zona}` : ""}. Contacta gratis en cuidadores.xyz.`;

  return {
    title: `${c.nombre} · Cuidador/a de ${tipo}`,
    description: desc,
    openGraph: {
      title: `${c.nombre} · Cuidador/a de ${tipo}`,
      description: desc,
      images: c.foto_url ? [{ url: c.foto_url }] : undefined,
      type: "profile",
    },
  };
}

export default async function CuidadorPage({ params }: { params: { id: string } }) {
  const c = await getCuidador(params.id);
  if (!c) notFound();

  const destacado = c.destacado_activo;

  return (
    <section className="container-page py-10">
      <Link href="/buscar" className="text-sm font-medium text-brand-500 hover:text-brand-700">
        ← Volver al listado
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        {/* ── Columna principal ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cabecera */}
          <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card">
            <div className="relative aspect-[16/9] w-full bg-brand-100 sm:aspect-[2/1]">
              {c.foto_url ? (
                <Image
                  src={c.foto_url}
                  alt={c.nombre}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-6xl font-bold text-brand-400">
                  {c.nombre.charAt(0).toUpperCase()}
                </span>
              )}
              {destacado && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-soft">
                  ⭐ Destacado
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-brand-900">{c.nombre}</h1>
                  {c.zona && (
                    <p className="mt-1 flex items-center gap-1 text-brand-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 21s-7-5.6-7-11a7 7 0 1114 0c0 5.4-7 11-7 11z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      {c.zona}
                    </p>
                  )}
                </div>
                {c.tarifa_hora != null && (
                  <span className="rounded-2xl bg-brand-50 px-4 py-2 text-lg font-bold text-brand-600">
                    {formatearTarifa(c.tarifa_hora)}/h
                  </span>
                )}
              </div>

              {/* Chips de datos rápidos */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Chip>{TIPO_CUIDADO_LABEL[c.tipo_cuidado]}</Chip>
                {c.experiencia_anios ? (
                  <Chip>
                    {c.experiencia_anios} año{c.experiencia_anios === 1 ? "" : "s"} de experiencia
                  </Chip>
                ) : null}
                {c.disponibilidad && <Chip>{c.disponibilidad}</Chip>}
              </div>

              {c.descripcion && (
                <p className="mt-5 text-brand-700">{c.descripcion}</p>
              )}
            </div>
          </div>

          {/* Currículum */}
          {c.curriculum && (
            <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-brand-800">Experiencia y currículum</h2>
              <p className="mt-3 whitespace-pre-line text-brand-700">{c.curriculum}</p>
            </div>
          )}
        </div>

        {/* ── Columna lateral: contacto ── */}
        <div className="lg:col-span-1">
          <div id="contactar" className="sticky top-20 rounded-3xl border border-brand-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-brand-800">Contactar con {c.nombre}</h2>
            <p className="mt-1 text-sm text-brand-500">
              Envía un mensaje gratis. Sin registro ni comisiones.
            </p>
            <div className="mt-5">
              <ContactForm profileId={c.id} nombreCuidador={c.nombre} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-brand-700">
      {children}
    </span>
  );
}
