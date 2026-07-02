import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// Devuelve el perfil del usuario autenticado, creándolo vacío si aún no existe.
// Respeta RLS: solo opera sobre el perfil del propio usuario.
export async function ensureProfile(): Promise<{
  user: { id: string; email: string | null };
  profile: Profile;
} | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // ¿Ya tiene perfil?
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { user: { id: user.id, email: user.email ?? null }, profile: existing as Profile };
  }

  // Crear fila vacía vinculada al user_id (nombre desde los metadatos).
  const nombre =
    (user.user_metadata?.nombre as string | undefined)?.trim() || "Mi perfil";

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      nombre,
      email_contacto: user.email ?? null,
      tipo_cuidado: "mayores",
    })
    .select("*")
    .single();

  if (error || !created) {
    // Carrera: si otro request lo creó primero, volver a leer.
    const { data: again } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (again) {
      return { user: { id: user.id, email: user.email ?? null }, profile: again as Profile };
    }
    return null;
  }

  return { user: { id: user.id, email: user.email ?? null }, profile: created as Profile };
}
