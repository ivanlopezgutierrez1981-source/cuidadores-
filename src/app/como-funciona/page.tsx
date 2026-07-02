import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PLANES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Así funciona cuidadores.xyz: las familias buscan y contactan gratis, sin registro; los cuidadores crean su perfil gratis y pueden destacar. Descúbrelo en el vídeo.",
};

// ─────────────────────────────────────────────────────────────────────
//  VÍDEO EXPLICATIVO
//  Pega aquí la URL *embed* de tu vídeo de YouTube y aparecerá solo.
//  Cómo obtenerla: en YouTube → Compartir → Insertar → copia el enlace
//  del atributo src (tiene la forma https://www.youtube.com/embed/XXXXXXXX).
//  Déjalo como "" para mostrar el marcador "vídeo próximamente".
//  (Si prefieres un MP4 propio, mira la nota al pie de este archivo.)
// ─────────────────────────────────────────────────────────────────────
const VIDEO_EMBED_URL = "";

const PASOS_FAMILIAS = [
  {
    n: "1",
    titulo: "Busca sin registrarte",
    desc: "Filtra por zona, tipo de cuidado y tarifa. Ver perfiles es totalmente gratis y no necesitas crear ninguna cuenta.",
  },
  {
    n: "2",
    titulo: "Compara perfiles",
    desc: "Lee la experiencia, el currículum, la disponibilidad y la tarifa de cada cuidador/a. Los perfiles destacados aparecen primero.",
  },
  {
    n: "3",
    titulo: "Contacta directamente",
    desc: "Envía un mensaje desde la ficha. El cuidador/a recibe tu solicitud al instante y se pone en contacto contigo. Sin comisiones.",
  },
];

const PASOS_CUIDADORES = [
  {
    n: "1",
    titulo: "Crea tu perfil gratis",
    desc: "Regístrate y completa tu ficha: foto, experiencia, zona, tarifa y disponibilidad. Cuanto más completo, más confianza generas.",
  },
  {
    n: "2",
    titulo: "Recibe solicitudes",
    desc: "Las familias te encuentran en el listado y te escriben directamente. Gestionas todo desde tu panel.",
  },
  {
    n: "3",
    titulo: "Destaca si quieres más visibilidad",
    desc: "Con un pago único apareces en primera fila del listado con un badge dorado, durante 7 días o un mes.",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta para las familias?",
    a: "Nada. Buscar cuidadores y contactar con ellos es completamente gratis y no requiere registro.",
  },
  {
    q: "¿Cuánto cuesta para los cuidadores?",
    a: "Crear el perfil y recibir solicitudes es gratis. Solo se paga (una vez, sin suscripción) si decides destacar tu perfil.",
  },
  {
    q: "¿cuidadores.xyz contrata a los cuidadores?",
    a: "No. Somos una plataforma de contacto: ponemos en comunicación a familias y cuidadores/as. El acuerdo de cuidado lo cierran directamente las partes.",
  },
  {
    q: "¿Mis datos de contacto son públicos?",
    a: "No. Tu teléfono y email no se muestran en el listado público; las familias te escriben a través del formulario de contacto.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-52 h-72 w-72 rounded-full bg-gold-100/50 blur-3xl" />

        <div className="container-page relative py-16 lg:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Cómo funciona</span>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-brand-900 sm:text-5xl">
              Cuidado de confianza, en tres pasos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-600">
              Conectamos familias con cuidadores y cuidadoras de niños, mayores y
              personas dependientes. Las familias buscan y contactan gratis; los
              cuidadores crean su perfil sin coste.
            </p>
          </Reveal>

          {/* Vídeo explicativo */}
          <Reveal delay={120} className="mx-auto mt-12 max-w-4xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-900 shadow-soft">
              <div className="relative aspect-video w-full">
                {VIDEO_EMBED_URL ? (
                  <iframe
                    src={VIDEO_EMBED_URL}
                    title="Cómo funciona cuidadores.xyz"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <VideoPlaceholder />
                )}
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-brand-500">
              Un vistazo rápido a cómo encontrar (o convertirte en) cuidador/a de confianza.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── PARA FAMILIAS ───────────── */}
      <section className="border-y border-brand-100 bg-white py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Para familias</span>
            <h2 className="mt-5 text-3xl font-semibold text-brand-900 sm:text-4xl">
              Encontrar cuidado es sencillo y gratuito
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PASOS_FAMILIAS.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
                <div className="h-full rounded-4xl bg-cream p-8 ring-1 ring-brand-100/70">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 font-serif text-lg font-semibold text-white shadow-card">
                    {p.n}
                  </span>
                  <h3 className="mt-6 font-serif text-xl font-semibold text-brand-900">{p.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-600">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex justify-center">
            <Link href="/buscar" className="btn-primary">
              Buscar cuidador/a
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────── PARA CUIDADORES ───────────── */}
      <section className="container-page py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Para cuidadores</span>
          <h2 className="mt-5 text-3xl font-semibold text-brand-900 sm:text-4xl">
            Crea tu perfil y empieza a recibir solicitudes
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {PASOS_CUIDADORES.map((p, i) => (
            <Reveal key={p.n} delay={i * 90}>
              <div className="h-full rounded-4xl border border-brand-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 font-serif text-lg font-semibold text-white shadow-card">
                  {p.n}
                </span>
                <h3 className="mt-6 font-serif text-xl font-semibold text-brand-900">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-600">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Planes de destacado */}
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-4xl border border-brand-100 bg-cream/60 p-8 text-center">
            <h3 className="font-serif text-xl font-semibold text-brand-900">
              Planes de destacado
            </h3>
            <p className="mt-2 text-sm text-brand-600">
              Pago único, sin suscripción. Aparece en primera fila con badge dorado.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.values(PLANES).map((plan) => (
                <span
                  key={plan.id}
                  className="rounded-full border border-brand-100 bg-white px-5 py-2 text-sm font-medium text-brand-700 shadow-sm"
                >
                  {plan.nombre} · <span className="font-semibold text-brand-900">{plan.precioLabel}</span>
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/registro" className="btn-primary">
                Crear perfil gratis
              </Link>
              <Link href="/destacar" className="btn-secondary">
                Ver planes de destacado
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="border-t border-brand-100 bg-white py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="mt-5 text-3xl font-semibold text-brand-900 sm:text-4xl">
              Todo lo que necesitas saber
            </h2>
          </Reveal>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <details className="group rounded-3xl border border-brand-100 bg-cream/50 p-6 [&_summary]:cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 font-serif text-lg font-semibold text-brand-900 marker:content-['']">
                    {f.q}
                    <span className="shrink-0 text-gold-500 transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-600">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="container-page pb-12 pt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white p-12 text-center shadow-card">
            <span className="mx-auto block h-px w-16 bg-gold-400" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-brand-900">
              ¿List@ para empezar?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-600">
              Encuentra al cuidador/a ideal o crea tu perfil hoy mismo. Sin comisiones
              para las familias, sin suscripciones para los cuidadores.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/buscar" className="btn-primary">Buscar cuidador/a</Link>
              <Link href="/registro" className="btn-secondary">Soy cuidador/a</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function VideoPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-gold-300" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <p className="relative font-serif text-lg font-semibold text-white">Vídeo explicativo próximamente</p>
      <p className="relative max-w-xs text-sm text-brand-200">
        Aquí irá un vídeo corto mostrando cómo funciona la plataforma.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  NOTA — Vídeo alojado por ti (MP4) en lugar de YouTube:
//  1) Copia tu archivo a /public/videos/como-funciona.mp4
//  2) Sustituye el bloque {VIDEO_EMBED_URL ? <iframe/> : <VideoPlaceholder/>}
//     por:  <video src="/videos/como-funciona.mp4" controls poster="/videos/poster.jpg"
//                  className="absolute inset-0 h-full w-full object-cover" />
// ─────────────────────────────────────────────────────────────────────
