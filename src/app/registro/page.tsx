import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import RegistroForm from "./RegistroForm";

export const metadata: Metadata = {
  title: "Crear cuenta de cuidador/a",
  description: "Regístrate gratis como cuidador o cuidadora en cuidadores.xyz.",
};

export default function RegistroPage() {
  return (
    <AuthShell
      titulo="Crea tu cuenta gratis"
      subtitulo="Regístrate como cuidador/a y empieza a recibir solicitudes de familias."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegistroForm />
    </AuthShell>
  );
}
