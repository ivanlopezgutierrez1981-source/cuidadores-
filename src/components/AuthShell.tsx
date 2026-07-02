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
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-gold-100/40 blur-3xl" />

      <div className="container-page relative flex min-h-[74vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="rounded-4xl border border-brand-100 bg-white/90 p-9 shadow-soft backdrop-blur">
            <span className="block h-px w-12 bg-gold-400" />
            <h1 className="mt-5 text-3xl font-semibold text-brand-900">{titulo}</h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-600">{subtitulo}</p>
            <div className="mt-7">{children}</div>
          </div>
          <p className="mt-6 text-center text-sm text-brand-600">{footer}</p>
          <p className="mt-2 text-center text-xs text-brand-400">
            Al continuar aceptas nuestros{" "}
            <Link href="/terminos" className="underline decoration-gold-300 underline-offset-2 hover:text-brand-600">
              Términos
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="underline decoration-gold-300 underline-offset-2 hover:text-brand-600">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
