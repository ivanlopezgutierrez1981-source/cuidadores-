"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

// Elimina un perfil de cuidador (y en cascada sus subscriptions y contacts).
// Solo ejecutable por un admin verificado en servidor.
export async function eliminarPerfil(formData: FormData) {
  await requireAdmin();

  const profileId = String(formData.get("profileId") || "");
  if (!profileId) return;

  const supabase = createAdminClient();
  await supabase.from("profiles").delete().eq("id", profileId);

  revalidatePath("/admin/cuidadores");
  revalidatePath("/admin");
}
