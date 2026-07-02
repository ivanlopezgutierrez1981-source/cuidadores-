import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ensureProfile } from "@/lib/profile";
import { estaDestacado, TIPO_CUIDADO_LABEL } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mi panel",
};

// Campos que consideramos necesarios para un perfil "completo".
function calcularCompletado(p: {
  foto_url: string | null;
  descripcion: string | null;
  curriculum: string | null;
  zona: string | null;
  tarifa_hora: number | null;
  telefono: string | null;
}) {
  const campos = [p.foto_url, p.descripcion, p.curriculum, p.zona, p.tarifa_hora, p.telefono];
  const hechos = campos.filter((c) => c !== null && c !== "" && c !== undefined).length;
  return Math.round((hechos / campos.length) * 100);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { pago?: string };
}) {
  const data = await ensureProfile();
  if (!data) redirect("/login");

  const { user, profile } = data;
  const pago = searchParams.pago;
  const destacado = estaDestacado(profile);
  const completado = calcularCompletado(profile);

  // Días restantes de destacado
  let diasRestantes = 0;
  if (destacado && profile.destacado_hasta) {
    const ms = new Date(profile.destacado_hasta).getTime() - Date.now();
    diasRestantes = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  return (
    <section className="container-page py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-brand-900">Hola, {profile.nombre} 👋</h1>
        <p className="text-brand-600">Este es tu panel de cuidador/a. {user.email}</p>
      </div>

      {pago === "ok" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-700">
          <span className="text-lg">✅</span>
          <p>
            <strong>¡Pago completado!</strong> Tu perfil se está destacando. Si los días
            tardan unos segundos en reflejarse, recarga la página (lo confirma el webhook de Stripe).
          </p>
        </div>
      )}
      {pago === "cancelado" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <span className="text-lg">ℹ️</span>
          <p>
            <strong>Pago cancelado.</strong> No se ha realizado ningún cargo. Puedes destacar
            tu perfil cuando quieras.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tarjeta de estado del perfil */}
        <div className="lg:col-span-2 rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-100">
              {profile.foto_url ? (
                <Image
                  src={profile.foto_url}
                  alt={profile.nombre}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-500">
                  {profile.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-brand-800">{profile.nombre}</h2>
              <p className="text-sm text-brand-500">
                {TIPO_CUIDADO_LABEL[profile.tipo_cuidado]}
                {profile.zona ? ` · ${profile.zona}` : ""}
              </p>
            </div>
            <Link href="/dashboard/perfil" className="btn-primary !px-5 !py-2 text-sm">
              Editar perfil
            </Link>
          </div>

          {/* Progreso de completado */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center justify-between text-sm">
              <span className="font-medium text-brand-700">Perfil completado</span>
              <span className="font-serif text-base font-semibold text-brand-800">{completado}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-700 ease-out"
                style={{ width: `${completado}%` }}
              />
            </div>
            {completado < 100 && (
              <p className="mt-2 text-xs text-brand-500">
                Completa tu perfil para aparecer mejor posicionado y generar más confianza.
              </p>
            )}
          </div>
        </div>

        {/* Tarjeta de estado de destacado */}
        <div className="rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="text-sm font-semibold text-brand-800">Estado de destacado</h3>
          {destacado ? (
            <div className="mt-3">
              <span className="badge-gold">
                <StarIcon /> Destacado activo
              </span>
              <p className="mt-4 font-serif text-4xl font-semibold text-brand-900">
                {diasRestantes} <span className="text-base font-sans font-medium text-brand-500">día{diasRestantes === 1 ? "" : "s"}</span>
              </p>
              <p className="text-xs text-brand-500">restantes en primera fila</p>
            </div>
          ) : (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                Sin destacar
              </span>
              <p className="mt-3 text-sm text-brand-600">
                Destaca tu perfil para aparecer en primera fila del listado.
              </p>
            </div>
          )}
          <Link
            href="/destacar"
            className={`mt-5 w-full text-sm ${destacado ? "btn-secondary" : "btn-gold"}`}
          >
            {destacado ? "Renovar destacado" : "Destacar mi perfil"}
          </Link>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <QuickLink href="/dashboard/perfil" title="Editar mi perfil" desc="Foto, CV, tarifa, disponibilidad…" />
        <QuickLink href="/destacar" title="Destacar mi perfil" desc="Aparece en primera fila" />
        <QuickLink href={`/buscar`} title="Ver el listado público" desc="Así te ven las familias" />
      </div>
    </section>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-brand-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <h4 className="font-serif text-lg font-semibold text-brand-900">{title}</h4>
      <p className="mt-1 text-sm text-brand-500">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5">
        Abrir <span className="text-gold-500">→</span>
      </span>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.26L21.6 9l-4.8 4.68L18 21l-6-3.2L6 21l1.2-7.32L2.4 9l6.7-.74L12 2z" />
    </svg>
  );
}
