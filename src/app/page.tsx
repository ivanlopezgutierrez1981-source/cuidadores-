import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Reveal from "@/components/Reveal";
import OrbitDestacados from "@/components/OrbitDestacados";
import { TIPO_CUIDADO_LABEL, PLANES } from "@/lib/types";

const TIPOS = [
  {
    key: "ninos",
    emoji: "🧸",
    desc: "Canguros y niñeras para el cuidado y acompañamiento de los más pequeños.",
  },
  {
    key: "mayores",
    emoji: "🌿",
    desc: "Acompañamiento y atención a personas mayores en su día a día.",
  },
  {
    key: "dependientes",
    emoji: "🤝",
    desc: "Cuidado especializado para personas con dependencia o movilidad reducida.",
  },
] as const;

const PASOS = [
  {
    n: "1",
    titulo: "Busca sin registrarte",
    desc: "Filtra por zona, tipo de cuidado y tarifa. Ver perfiles es totalmente gratis.",
  },
  {
    n: "2",
    titulo: "Compara perfiles",
    desc: "Lee la experiencia, el currículum y la disponibilidad de cada cuidador/a.",
  },
  {
    n: "3",
    titulo: "Contacta directamente",
    desc: "Envía un mensaje desde la ficha. El cuidador/a recibe tu solicitud al instante.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-52 h-72 w-72 rounded-full bg-gold-100/50 blur-3xl" />

        <div className="container-page relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <span className="eyebrow">Cuidado de confianza, cerca de ti</span>
            <h1 className="mt-6 font-serif text-[2.75rem] font-semibold leading-[1.05] text-brand-900 sm:text-6xl">
              La persona <span className="italic text-brand-500">ideal</span> para
              cuidar de quien más quieres
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-600">
              Conectamos familias con cuidadores y cuidadoras de niños, mayores y
              personas dependientes. Buscar y contactar es gratis.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/buscar" className="btn-primary">
                Busco cuidador/a
              </Link>
              <Link href="/registro" className="btn-secondary">
                Soy cuidador/a
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-brand-500">
              <span className="flex items-center gap-2">
                <CheckMark /> Registro gratis
              </span>
              <span className="flex items-center gap-2">
                <CheckMark /> Sin comisiones a familias
              </span>
              <span className="flex items-center gap-2">
                <CheckMark /> Perfiles verificables
              </span>
            </div>
          </Reveal>

          {/* Tarjeta visual del hero */}
          <Reveal delay={120} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-100/60 to-gold-100/40 blur-2xl" />
            <div className="rounded-4xl border border-brand-100 bg-white/90 p-6 shadow-soft backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-brand-900">
                  Cuidadores destacados
                </h3>
                <span className="badge-gold">
                  <StarIcon /> Destacado
                </span>
              </div>
              <OrbitDestacados />
            </div>
          </Reveal>
        </div>

        {/* Buscador */}
        <div className="container-page relative -mt-2 pb-10">
          <SearchBar />
        </div>
      </section>

      {/* ───────────── TIPOS DE CUIDADO ───────────── */}
      <section className="container-page py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Áreas de cuidado</span>
          <h2 className="mt-5 text-3xl font-semibold text-brand-900 sm:text-4xl">
            ¿Qué tipo de cuidado necesitas?
          </h2>
          <p className="mt-4 text-brand-600">
            Profesionales preparados para cada situación familiar.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TIPOS.map((t, i) => (
            <Reveal key={t.key} delay={i * 90}>
              <Link
                href={`/buscar?tipo=${t.key}`}
                className="group flex h-full flex-col rounded-4xl border border-brand-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100/80 transition-colors group-hover:bg-gold-50">
                  {t.emoji}
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold text-brand-900">
                  {TIPO_CUIDADO_LABEL[t.key]}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">{t.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5">
                  Ver cuidadores
                  <span className="text-gold-500">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CÓMO FUNCIONA ───────────── */}
      <section className="border-y border-brand-100 bg-white py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Sencillo y gratuito</span>
            <h2 className="mt-5 text-3xl font-semibold text-brand-900 sm:text-4xl">
              Cómo funciona
            </h2>
            <p className="mt-4 text-brand-600">
              Para las familias, encontrar cuidado es sencillo y gratuito.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <Reveal key={p.n} delay={i * 90} className="relative">
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
        </div>
      </section>

      {/* ───────────── PARA CUIDADORES / DESTACAR ───────────── */}
      <section className="container-page py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 p-8 text-white shadow-soft sm:p-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-700/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-200">
                  Para cuidadores
                </span>
                <h2 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">
                  ¿Eres cuidador o cuidadora?
                </h2>
                <p className="mt-5 max-w-md leading-relaxed text-brand-100">
                  Crea tu perfil <strong className="font-semibold text-white">gratis</strong> y
                  empieza a recibir solicitudes de familias. ¿Quieres más visibilidad?
                  Destaca tu perfil y aparece en primera fila del listado.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/registro" className="btn bg-white text-brand-900 hover:-translate-y-0.5 hover:bg-brand-50">
                    Crear perfil gratis
                  </Link>
                  <Link
                    href="/destacar"
                    className="btn border border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Ver planes de destacado
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.values(PLANES).map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-4xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur transition-colors hover:border-gold-300/30"
                  >
                    <p className="text-sm font-medium text-brand-100">{plan.nombre}</p>
                    <p className="mt-2 font-serif text-4xl font-semibold text-white">
                      {plan.precioLabel}
                    </p>
                    <p className="mt-1 text-xs text-brand-200">{plan.descripcion}</p>
                    <p className="badge-gold mt-4">
                      <StarIcon /> {plan.dias} días destacado
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="container-page pb-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white p-12 text-center shadow-card">
            <span className="mx-auto block h-px w-16 bg-gold-400" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-brand-900">
              Empieza hoy a encontrar el cuidado que tu familia necesita
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-600">
              Sin registro para buscar. Sin comisiones para las familias. Con
              cuidadores reales cerca de ti.
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

function CheckMark() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
