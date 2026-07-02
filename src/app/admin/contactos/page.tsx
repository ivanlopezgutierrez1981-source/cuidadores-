import { createAdminClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types";

export const dynamic = "force-dynamic";

type ContactConCuidador = Contact & { profiles: { nombre: string } | null };

export default async function AdminContactos() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contacts")
    .select("*, profiles(nombre)")
    .order("created_at", { ascending: false })
    .limit(300);

  const contactos = (data as ContactConCuidador[] | null) ?? [];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand-900">Contactos recibidos</h1>
      <p className="mt-1 text-sm text-brand-600">
        {contactos.length} mensajes de familias (solo lectura).
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-card">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-brand-100 bg-cream/60 text-xs uppercase tracking-wide text-brand-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Para (cuidador/a)</th>
              <th className="px-4 py-3">Familia</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {contactos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-brand-500">
                  Todavía no se han recibido mensajes.
                </td>
              </tr>
            ) : (
              contactos.map((c) => (
                <tr key={c.id} className="align-top hover:bg-cream/40">
                  <td className="whitespace-nowrap px-4 py-3 text-brand-500">
                    {formatearFechaHora(c.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-800">
                    {c.profiles?.nombre || "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-700">{c.nombre_familia}</td>
                  <td className="px-4 py-3 text-brand-600">
                    <a href={`mailto:${c.email}`} className="text-brand-600 underline">
                      {c.email}
                    </a>
                    {c.telefono && <div className="text-xs text-brand-400">{c.telefono}</div>}
                  </td>
                  <td className="max-w-md px-4 py-3 text-brand-600">
                    <p className="whitespace-pre-line">{c.mensaje}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
