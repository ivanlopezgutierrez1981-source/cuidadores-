import { createAdminClient } from "@/lib/supabase/server";
import { PLANES, type Subscription, type PlanDestacado } from "@/lib/types";

export const dynamic = "force-dynamic";

type SubConCuidador = Subscription & { profiles: { nombre: string } | null };

export default async function AdminSuscripciones() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*, profiles(nombre)")
    .order("created_at", { ascending: false })
    .limit(300);

  const subs = (data as SubConCuidador[] | null) ?? [];
  const totalIngresos = subs.reduce(
    (acc, s) => acc + (PLANES[s.plan as PlanDestacado]?.precio ?? 0),
    0
  );

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Suscripciones / pagos</h1>
          <p className="mt-1 text-sm text-brand-600">{subs.length} pagos de destacado.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-500">Ingresos totales</p>
          <p className="font-serif text-3xl font-semibold text-brand-800">{formatearEuros(totalIngresos)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-brand-100 bg-cream/60 text-xs uppercase tracking-wide text-brand-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cuidador/a</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Importe</th>
              <th className="px-4 py-3">Destacado hasta</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Pago (Stripe)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {subs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-500">
                  Todavía no hay pagos registrados.
                </td>
              </tr>
            ) : (
              subs.map((s) => {
                const plan = PLANES[s.plan as PlanDestacado];
                const activoAhora =
                  s.activo && new Date(s.destacado_hasta).getTime() > Date.now();
                return (
                  <tr key={s.id} className="hover:bg-cream/40">
                    <td className="whitespace-nowrap px-4 py-3 text-brand-500">
                      {formatearFecha(s.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-800">
                      {s.profiles?.nombre || "—"}
                    </td>
                    <td className="px-4 py-3 text-brand-600">{plan?.nombre ?? s.plan}</td>
                    <td className="px-4 py-3 font-semibold text-brand-700">
                      {formatearEuros(plan?.precio ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-brand-600">{formatearFecha(s.destacado_hasta)}</td>
                    <td className="px-4 py-3">
                      {activoAhora ? (
                        <span className="rounded-full border border-gold-300/80 bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                          Activo
                        </span>
                      ) : (
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-500">
                          Caducado
                        </span>
                      )}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-xs text-brand-400">
                      {s.stripe_payment_id || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearEuros(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}
