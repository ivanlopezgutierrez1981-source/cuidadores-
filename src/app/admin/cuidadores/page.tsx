import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/server";
import { TIPO_CUIDADO_LABEL, estaDestacado, type Profile } from "@/lib/types";
import EliminarPerfil from "@/components/admin/EliminarPerfil";

export const dynamic = "force-dynamic";

function diasRestantes(hasta: string | null): number {
  if (!hasta) return 0;
  const ms = new Date(hasta).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default async function AdminCuidadores({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || "").trim();
  const supabase = createAdminClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q) query = query.or(`nombre.ilike.%${q}%,zona.ilike.%${q}%`);

  const { data } = await query;
  const cuidadores = (data as Profile[] | null) ?? [];

  // Mapa user_id → email de cuenta (desde Auth).
  const emails = new Map<string, string>();
  const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  usersData?.users?.forEach((u) => {
    if (u.email) emails.set(u.id, u.email);
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Cuidadores</h1>
          <p className="mt-1 text-sm text-brand-600">{cuidadores.length} resultados</p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre o zona…"
            className="w-64 rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          <button className="btn-primary !px-4 !py-2 text-sm">Buscar</button>
          {q && (
            <Link href="/admin/cuidadores" className="btn-secondary !px-4 !py-2 text-sm">
              Limpiar
            </Link>
          )}
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-brand-100 bg-cream/60 text-xs uppercase tracking-wide text-brand-500">
            <tr>
              <th className="px-4 py-3">Cuidador/a</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {cuidadores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-500">
                  No hay cuidadores que coincidan.
                </td>
              </tr>
            ) : (
              cuidadores.map((c) => {
                const dest = estaDestacado(c);
                return (
                  <tr key={c.id} className="hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-100">
                          {c.foto_url ? (
                            <Image src={c.foto_url} alt={c.nombre} fill sizes="36px" className="object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-500">
                              {c.nombre.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-brand-800">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-600">
                      {emails.get(c.user_id) || c.email_contacto || "—"}
                    </td>
                    <td className="px-4 py-3 text-brand-600">{c.zona || "—"}</td>
                    <td className="px-4 py-3 text-brand-600">{TIPO_CUIDADO_LABEL[c.tipo_cuidado]}</td>
                    <td className="px-4 py-3">
                      {dest ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-gold-300/80 bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                          ★ {diasRestantes(c.destacado_hasta)}d
                        </span>
                      ) : (
                        <span className="text-xs text-brand-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-500">{formatearFecha(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/cuidador/${c.id}`}
                          target="_blank"
                          className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                        >
                          Ver ficha
                        </Link>
                        <EliminarPerfil profileId={c.id} nombre={c.nombre} />
                      </div>
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
