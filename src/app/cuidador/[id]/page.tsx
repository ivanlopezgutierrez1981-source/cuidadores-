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
          <div className="overflow-hidden rounded-4xl border border-brand-100 bg-white shadow-soft">
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
                <span className="badge-gold absolute left-4 top-4 shadow-sm">
                  <StarIcon /> Destacado
                </span>
              )}
            </div>

            <div className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-semibold text-brand-900">{c.nombre}</h1>
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
                  <span className="rounded-2xl bg-brand-50 px-4 py-2 text-lg font-bold text-brand-700 ring-1 ring-brand-100">
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
                <p className="mt-5 leading-relaxed text-brand-600">{c.descripcion}</p>
              )}
            </div>
          </div>

          {/* Currículum */}
          {c.curriculum && (
            <div className="rounded-4xl border border-brand-100 bg-white p-7 shadow-card">
              <h2 className="text-xl font-semibold text-brand-900">Experiencia y currículum</h2>
              <span className="mt-3 block h-px w-12 bg-gold-400" />
              <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-600">{c.curriculum}</p>
            </div>
          )}
        </div>

        {/* ── Columna lateral: contacto ── */}
        <div className="lg:col-span-1">
          <div id="contactar" className="sticky top-24 rounded-4xl border border-brand-100 bg-white p-7 shadow-soft">
            <h2 className="text-xl font-semibold text-brand-900">Contactar con {c.nombre}</h2>
            <p className="mt-2 text-sm text-brand-500">
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
    <span className="rounded-full bg-cream px-3.5 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100/80">
      {children}
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
