import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { PLANES, type PlanDestacado } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMetricas() {
  const supabase = createAdminClient();
  const ahora = new Date().toISOString();
  const hace7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const head = { count: "exact" as const, head: true };

  const [
    totalCuidadores,
    completos,
    destacados,
    totalContactos,
    contactos7,
    subs,
  ] = await Promise.all([
    supabase.from("profiles").select("*", head),
    supabase
      .from("profiles")
      .select("*", head)
      .not("foto_url", "is", null)
      .neq("foto_url", "")
      .not("descripcion", "is", null)
      .neq("descripcion", ""),
    supabase.from("profiles").select("*", head).gt("destacado_hasta", ahora),
    supabase.from("contacts").select("*", head),
    supabase.from("contacts").select("*", head).gte("created_at", hace7),
    supabase.from("subscriptions").select("plan"),
  ]);

  const total = totalCuidadores.count ?? 0;
  const nCompletos = completos.count ?? 0;

  // Ingresos estimados = suma de los precios de cada suscripción registrada.
  const ingresos = (subs.data ?? []).reduce((acc, s) => {
    const plan = s.plan as PlanDestacado;
    return acc + (PLANES[plan]?.precio ?? 0);
  }, 0);

  return {
    total,
    completos: nCompletos,
    incompletos: Math.max(0, total - nCompletos),
    destacados: destacados.count ?? 0,
    contactosTotal: totalContactos.count ?? 0,
    contactos7: contactos7.count ?? 0,
    ingresos,
    nPagos: subs.data?.length ?? 0,
  };
}

export default async function AdminHome() {
  const m = await getMetricas();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Resumen</h1>
      <p className="mt-1 text-sm text-brand-600">Métricas generales de cuidadores.xyz.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica titulo="Cuidadores registrados" valor={m.total} />
        <Metrica
          titulo="Perfiles completos"
          valor={m.completos}
          sub={`${m.incompletos} incompletos`}
        />
        <Metrica titulo="Destacados activos" valor={m.destacados} acento="amber" />
        <Metrica
          titulo="Ingresos estimados"
          valor={formatearEuros(m.ingresos)}
          sub={`${m.nPagos} pago${m.nPagos === 1 ? "" : "s"}`}
          acento="brand"
        />
        <Metrica
          titulo="Contactos recibidos"
          valor={m.contactosTotal}
          sub={`${m.contactos7} en los últimos 7 días`}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <AccesoRapido href="/admin/cuidadores" titulo="Gestionar cuidadores" desc="Ver, moderar y eliminar perfiles" />
        <AccesoRapido href="/admin/contactos" titulo="Ver contactos" desc="Mensajes de familias" />
        <AccesoRapido href="/admin/suscripciones" titulo="Ver suscripciones" desc="Pagos de destacado" />
      </div>
    </div>
  );
}

function Metrica({
  titulo,
  valor,
  sub,
  acento,
}: {
  titulo: string;
  valor: number | string;
  sub?: string;
  acento?: "amber" | "brand";
}) {
  const color =
    acento === "amber" ? "text-amber-600" : acento === "brand" ? "text-brand-600" : "text-brand-900";
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
      <p className="text-sm text-brand-500">{titulo}</p>
      <p className={`mt-2 text-3xl font-extrabold ${color}`}>{valor}</p>
      {sub && <p className="mt-1 text-xs text-brand-400">{sub}</p>}
    </div>
  );
}

function AccesoRapido({ href, titulo, desc }: { href: string; titulo: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <h3 className="font-semibold text-brand-800">{titulo}</h3>
      <p className="mt-1 text-sm text-brand-500">{desc}</p>
    </Link>
  );
}

function formatearEuros(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}
