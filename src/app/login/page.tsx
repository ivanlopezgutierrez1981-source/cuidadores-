import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de cuidador/a en cuidadores.xyz.",
};

export default function LoginPage() {
  return (
    <AuthShell
      titulo="Bienvenido/a de nuevo"
      subtitulo="Accede a tu panel para gestionar tu perfil."
      footer={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand-600 hover:underline">
            Regístrate gratis
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
