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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-white shadow-card ring-1 ring-inset ring-white/10 transition-transform duration-200 group-hover:-translate-y-0.5">
            {/* corazón / cuidado */}
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21s-7.5-4.6-10-9.2C.7 9 1.6 5.7 4.6 4.7c2-.7 3.9.2 4.9 1.7C10.5 4.9 12.4 4 14.4 4.7c3 1 3.9 4.3 2.6 7.1C19.5 16.4 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-brand-900">
            cuidadores<span className="text-gold-500">.xyz</span>
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
