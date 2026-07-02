import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-cream/85 backdrop-blur-md">
      <div className="container-page flex h-[70px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* Isotipo oficial (Brand Guide 1.0) */}
          <span className="block shrink-0 overflow-hidden rounded-[9px] shadow-card transition-transform duration-200 group-hover:-translate-y-0.5">
            <svg width="38" height="38" viewBox="0 0 48 48" fill="none" className="block" aria-hidden>
              <rect width="48" height="48" rx="12" fill="#2D8A79" />
              <path
                d="M24 36C24 36 10 27.5 10 18.5C10 14.1 13.4 11 17.5 11C20.2 11 22.6 12.5 24 14.8C25.4 12.5 27.8 11 30.5 11C34.6 11 38 14.1 38 18.5C38 27.5 24 36 24 36Z"
                fill="white"
              />
            </svg>
          </span>
          <span className="text-xl tracking-tight">
            <span className="font-bold text-brand-900">cuidadores</span>
            <span className="font-normal text-brand-500">.xyz</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-700 md:flex">
          <Link href="/buscar" className="link-underline">
            Buscar cuidador/a
          </Link>
          <Link href="/destacar" className="link-underline">
            Destaca tu perfil
          </Link>
          <Link href="/como-funciona" className="link-underline">
            Cómo funciona
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm font-medium text-brand-700 link-underline sm:inline"
              >
                Mi panel
              </Link>
              <form action="/logout" method="post">
                <button type="submit" className="btn-secondary !px-5 !py-2 text-sm">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-brand-700 link-underline sm:inline"
              >
                Entrar
              </Link>
              <Link href="/registro" className="btn-primary !px-5 !py-2 text-sm">
                Soy cuidador/a
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
