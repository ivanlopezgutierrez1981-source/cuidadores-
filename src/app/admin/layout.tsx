import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/cuidadores", label: "Cuidadores" },
  { href: "/admin/contactos", label: "Contactos" },
  { href: "/admin/suscripciones", label: "Suscripciones" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-brand-100 bg-white">
        <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-brand-800 px-2.5 py-1 text-xs font-bold tracking-wide text-white">
              ADMIN
            </span>
            <span className="text-sm text-brand-600">{user.email}</span>
          </div>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-page py-8">{children}</div>
    </div>
  );
}
