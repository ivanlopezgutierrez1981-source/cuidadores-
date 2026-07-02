export default function LegalShell({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <span className="block h-px w-12 bg-gold-400" />
        <h1 className="mt-5 text-4xl font-semibold text-brand-900">{titulo}</h1>
        <p className="mt-3 text-sm text-brand-400">Última actualización: {actualizado}</p>
        <div className="legal-content mt-10 space-y-6">{children}</div>
      </div>
    </section>
  );
}
