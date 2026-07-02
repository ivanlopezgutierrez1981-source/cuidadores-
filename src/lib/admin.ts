import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Lista de emails admin desde la variable de entorno ADMIN_EMAILS.
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function esEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// Verificación en servidor para las páginas/acciones de /admin.
// Redirige si el usuario no es admin. Devuelve el usuario si lo es.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");
  if (!esEmailAdmin(user.email)) redirect("/");

  return user;
}
