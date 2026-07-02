import Link from "next/link";

// Contenedor visual común para las páginas de login y registro.
export default function AuthShell({
  titulo,
  subtitulo,
  children,
  footer,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="container-page relative flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
            <h1 className="text-2xl font-bold text-brand-900">{titulo}</h1>
            <p className="mt-2 text-sm text-brand-600">{subtitulo}</p>
            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-6 text-center text-sm text-brand-600">{footer}</p>
          <p className="mt-2 text-center text-xs text-brand-400">
            Al continuar aceptas nuestros{" "}
            <Link href="/terminos" className="underline">
              Términos
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="underline">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
