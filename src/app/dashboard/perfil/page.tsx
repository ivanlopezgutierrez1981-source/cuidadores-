import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureProfile } from "@/lib/profile";
import PerfilForm from "./PerfilForm";

export const metadata: Metadata = {
  title: "Editar mi perfil",
};

export default async function PerfilPage() {
  const data = await ensureProfile();
  if (!data) redirect("/login");

  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm font-medium text-brand-500 hover:text-brand-700">
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-900">Editar mi perfil</h1>
        <p className="mt-1 text-brand-600">
          Esta es la información que verán las familias en el listado y en tu ficha.
        </p>
      </div>

      <PerfilForm initial={data.profile} userId={data.user.id} />
    </section>
  );
}
