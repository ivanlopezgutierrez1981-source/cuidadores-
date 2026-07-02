import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { estaDestacado } from "@/lib/types";
import DestacarPlanes from "./DestacarPlanes";

export const metadata: Metadata = {
  title: "Destaca tu perfil",
  description:
    "Aparece en primera fila del listado de cuidadores y recibe más solicitudes. Planes desde 9 €.",
};

export default async function DestacarPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let yaDestacado = false;
  let diasRestantes = 0;
  let tienePerfil = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, destacado_hasta")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      tienePerfil = true;
      yaDestacado = estaDestacado(profile);
      if (yaDestacado && profile.destacado_hasta) {
        const ms = new Date(profile.destacado_hasta).getTime() - Date.now();
        diasRestantes = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
      }
    }
  }

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-brand-900 sm:text-5xl">
          Destaca tu perfil y aparece en primera fila
        </h1>
        <p className="mt-4 text-brand-600">
          Los perfiles destacados se muestran arriba del todo en el listado, con un
          badge visible. Es un pago único: cuando caduca, decides si renuevas.
        </p>
      </div>

      {user && yaDestacado && (
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-brand-50 px-5 py-4 text-center text-sm text-brand-700">
          ⭐ Ya tienes el destacado activo. Te quedan{" "}
          <strong>{diasRestantes} día{diasRestantes === 1 ? "" : "s"}</strong>. Si compras
          ahora, los días se <strong>suman</strong> a los que ya tienes.
        </div>
      )}

      {!user ? (
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-card">
          <p className="text-brand-700">
            Para destacar tu perfil primero necesitas una cuenta de cuidador/a.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/registro" className="btn-primary text-sm">
              Crear cuenta gratis
            </Link>
            <Link href="/login?redirect=/destacar" className="btn-secondary text-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      ) : !tienePerfil ? (
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-card">
          <p className="text-brand-700">Completa antes tu perfil para poder destacarlo.</p>
          <Link href="/dashboard/perfil" className="btn-primary mt-5 text-sm">
            Completar mi perfil
          </Link>
        </div>
      ) : (
        <DestacarPlanes />
      )}

      {/* Ventajas */}
      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
        {[
          { e: "🔝", t: "Primera fila", d: "Tu perfil aparece arriba, antes que el resto." },
          { e: "⭐", t: "Badge destacado", d: "Un distintivo que genera más confianza." },
          { e: "📈", t: "Más solicitudes", d: "Mayor visibilidad = más familias te contactan." },
        ].map((v) => (
          <div key={v.t} className="rounded-4xl border border-brand-100 bg-white p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100/80">
              {v.e}
            </div>
            <h3 className="mt-5 font-serif text-lg font-semibold text-brand-900">{v.t}</h3>
            <p className="mt-1.5 text-sm text-brand-600">{v.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
