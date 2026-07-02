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
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-900">{titulo}</h1>
        <p className="mt-2 text-sm text-brand-400">Última actualización: {actualizado}</p>
        <div className="legal-content mt-8 space-y-6 text-brand-700">{children}</div>
      </div>
    </section>
  );
}
