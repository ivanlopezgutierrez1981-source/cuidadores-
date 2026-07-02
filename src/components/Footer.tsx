import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg font-bold text-brand-800">
            cuidadores<span className="text-brand-400">.xyz</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-brand-600">
            Conectamos familias con cuidadores y cuidadoras de confianza para
            niños, mayores y personas dependientes.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-800">Cuidadores</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li><Link href="/registro" className="hover:text-brand-900">Crear perfil</Link></li>
            <li><Link href="/destacar" className="hover:text-brand-900">Destacar perfil</Link></li>
            <li><Link href="/login" className="hover:text-brand-900">Acceder</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-800">Familias</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li><Link href="/buscar" className="hover:text-brand-900">Buscar cuidador/a</Link></li>
            <li><Link href="/como-funciona" className="hover:text-brand-900">Cómo funciona</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-brand-800">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-600">
            <li><Link href="/aviso-legal" className="hover:text-brand-900">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="hover:text-brand-900">Privacidad</Link></li>
            <li><Link href="/cookies" className="hover:text-brand-900">Cookies</Link></li>
            <li><Link href="/terminos" className="hover:text-brand-900">Términos de uso</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-brand-500 sm:flex-row">
          <p>© {new Date().getFullYear()} cuidadores.xyz · Todos los derechos reservados.</p>
          <p>Hecho con cuidado en España 🇪🇸</p>
        </div>
      </div>
    </footer>
  );
}
