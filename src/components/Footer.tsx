import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-brand-100 bg-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <span className="flex items-center gap-2.5">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none" className="block shrink-0 rounded-[8px] shadow-card" aria-hidden>
              <rect width="48" height="48" rx="12" fill="#2D8A79" />
              <path
                d="M24 36C24 36 10 27.5 10 18.5C10 14.1 13.4 11 17.5 11C20.2 11 22.6 12.5 24 14.8C25.4 12.5 27.8 11 30.5 11C34.6 11 38 14.1 38 18.5C38 27.5 24 36 24 36Z"
                fill="white"
              />
            </svg>
            <span className="text-xl tracking-tight">
              <span className="font-bold text-brand-900">cuidadores</span>
              <span className="font-normal text-brand-500">.xyz</span>
            </span>
          </span>
          <p className="mt-4 text-sm leading-relaxed text-brand-600">
            Conectamos familias con cuidadores y cuidadoras de confianza para
            niños, mayores y personas dependientes. Cuidado cercano, tratado con
            seriedad.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">
            Cuidadores
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-600">
            <li><Link href="/registro" className="link-underline">Crear perfil</Link></li>
            <li><Link href="/destacar" className="link-underline">Destacar perfil</Link></li>
            <li><Link href="/login" className="link-underline">Acceder</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">
            Familias
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-600">
            <li><Link href="/buscar" className="link-underline">Buscar cuidador/a</Link></li>
            <li><Link href="/como-funciona" className="link-underline">Cómo funciona</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">
            Legal
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-600">
            <li><Link href="/aviso-legal" className="link-underline">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="link-underline">Privacidad</Link></li>
            <li><Link href="/cookies" className="link-underline">Cookies</Link></li>
            <li><Link href="/terminos" className="link-underline">Términos de uso</Link></li>
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
