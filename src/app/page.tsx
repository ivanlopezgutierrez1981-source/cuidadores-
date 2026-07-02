import Link from "next/link";
import SearchBar from "@/components/SearchBar";
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
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              ✨ Cuidado de confianza, cerca de ti
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-brand-900 sm:text-5xl">
              Encuentra a la persona{" "}
              <span className="text-brand-500">ideal para cuidar</span> de quien
              más quieres
            </h1>
            <p className="mt-5 max-w-lg text-lg text-brand-600">
              Conectamos familias con cuidadores y cuidadoras de niños, mayores y
              personas dependientes. Buscar y contactar es gratis.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buscar" className="btn-primary">
                Busco cuidador/a
              </Link>
              <Link href="/registro" className="btn-secondary">
                Soy cuidador/a
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-brand-500">
              <span className="flex items-center gap-2">
                <span className="text-brand-500">✓</span> Registro gratis
              </span>
              <span className="flex items-center gap-2">
                <span className="text-brand-500">✓</span> Sin comisiones a familias
              </span>
            </div>
          </div>

          {/* Tarjeta visual del hero */}
          <div className="relative">
            <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-brand-800">Cuidadores destacados</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  ⭐ Destacado
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  { n: "María G.", z: "Madrid · Centro", t: "Personas mayores", p: "12 €/h" },
                  { n: "Lucía R.", z: "Barcelona · Eixample", t: "Niños", p: "10 €/h" },
                  { n: "Andrés P.", z: "Valencia", t: "Dependientes", p: "14 €/h" },
                ].map((c) => (
                  <li
                    key={c.n}
                    className="flex items-center gap-3 rounded-2xl border border-brand-50 bg-cream/60 p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-600">
                      {c.n.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-brand-800">{c.n}</p>
                      <p className="text-xs text-brand-500">{c.z} · {c.t}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-600">{c.p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="container-page relative -mt-4 pb-6">
          <SearchBar />
        </div>
      </section>

      {/* ───────────── TIPOS DE CUIDADO ───────────── */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-900">¿Qué tipo de cuidado necesitas?</h2>
          <p className="mt-3 text-brand-600">
            Profesionales preparados para cada situación familiar.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TIPOS.map((t) => (
            <Link
              key={t.key}
              href={`/buscar?tipo=${t.key}`}
              className="group rounded-3xl border border-brand-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {t.emoji}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-brand-800">
                {TIPO_CUIDADO_LABEL[t.key]}
              </h3>
              <p className="mt-2 text-sm text-brand-600">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 group-hover:gap-2">
                Ver cuidadores →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────── CÓMO FUNCIONA ───────────── */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-brand-900">Cómo funciona</h2>
            <p className="mt-3 text-brand-600">
              Para las familias, encontrar cuidado es sencillo y gratuito.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PASOS.map((p) => (
              <div key={p.n} className="relative rounded-3xl bg-cream p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                  {p.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-brand-800">{p.titulo}</h3>
                <p className="mt-2 text-sm text-brand-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PARA CUIDADORES / DESTACAR ───────────── */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-8 text-white sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">¿Eres cuidador o cuidadora?</h2>
              <p className="mt-4 max-w-md text-brand-50">
                Crea tu perfil <strong>gratis</strong> y empieza a recibir solicitudes
                de familias. ¿Quieres más visibilidad? Destaca tu perfil y aparece en
                primera fila del listado.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/registro" className="btn bg-white text-brand-700 hover:bg-brand-50">
                  Crear perfil gratis
                </Link>
                <Link href="/destacar" className="btn bg-brand-700/40 text-white ring-1 ring-white/40 hover:bg-brand-700/60">
                  Ver planes de destacado
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {Object.values(PLANES).map((plan) => (
                <div key={plan.id} className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur">
                  <p className="text-sm font-medium text-brand-50">{plan.nombre}</p>
                  <p className="mt-2 text-3xl font-extrabold">{plan.precioLabel}</p>
                  <p className="mt-1 text-xs text-brand-100">{plan.descripcion}</p>
                  <p className="mt-3 inline-flex rounded-full bg-amber-300/90 px-3 py-1 text-xs font-semibold text-amber-900">
                    ⭐ Badge destacado · {plan.dias} días
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="container-page pb-8">
        <div className="rounded-3xl border border-brand-100 bg-white p-10 text-center shadow-card">
          <h2 className="text-2xl font-bold text-brand-900">
            Empieza hoy a encontrar el cuidado que tu familia necesita
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-600">
            Sin registro para buscar. Sin comisiones para las familias. Con
            cuidadores reales cerca de ti.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/buscar" className="btn-primary">Buscar cuidador/a</Link>
            <Link href="/registro" className="btn-secondary">Soy cuidador/a</Link>
          </div>
        </div>
      </section>
    </>
  );
}
