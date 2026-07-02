import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { enviarAvisoContacto } from "@/lib/email";
import { verificarRecaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición no válida." }, { status: 400 });
  }

  const profileId = String(body.profileId ?? "").trim();
  const nombre = String(body.nombre ?? "").trim();
  const email = String(body.email ?? "").trim();
  const telefonoRaw = String(body.telefono ?? "").trim();
  const telefono = telefonoRaw || null;
  const mensaje = String(body.mensaje ?? "").trim();

  // ── Validación ──────────────────────────────────────────────
  if (!UUID_RE.test(profileId)) {
    return NextResponse.json({ error: "Cuidador no válido." }, { status: 400 });
  }
  if (nombre.length < 2) {
    return NextResponse.json({ error: "Introduce tu nombre." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
  }
  if (mensaje.length < 10) {
    return NextResponse.json(
      { error: "Escribe un mensaje un poco más detallado (mínimo 10 caracteres)." },
      { status: 400 }
    );
  }

  // ── Anti-spam: reCAPTCHA v3 (antes de guardar/enviar nada) ──
  const captcha = await verificarRecaptcha(String(body.recaptchaToken ?? ""), "contacto");
  if (!captcha.ok) {
    console.warn(
      `[contacto] reCAPTCHA bloqueó el envío: ${captcha.motivo} (score=${captcha.score ?? "?"})`
    );
    return NextResponse.json(
      {
        error:
          "No hemos podido verificar que eres una persona. Recarga la página e inténtalo de nuevo.",
      },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // ── 1) Guardar el contacto (lo prioritario) ─────────────────
  const { error: insErr } = await supabase.from("contacts").insert({
    profile_id: profileId,
    nombre_familia: nombre,
    email,
    telefono,
    mensaje,
  });

  if (insErr) {
    console.error("[contacto] Error al guardar el contacto:", insErr.message);
    return NextResponse.json(
      { error: "No se ha podido enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  // ── 2) Aviso por email (best-effort, no rompe el flujo) ─────
  // El contacto YA está guardado; a partir de aquí respondemos siempre OK.
  try {
    const { data: perfil, error: perfilErr } = await supabase
      .from("profiles")
      .select("nombre, email_contacto, user_id")
      .eq("id", profileId)
      .maybeSingle();

    if (perfilErr) {
      console.error(`[contacto] Error leyendo el perfil ${profileId}:`, perfilErr.message);
    }

    // Email destino: email_contacto del perfil o, en su defecto, el de la cuenta.
    let destino = perfil?.email_contacto?.trim() || "";
    let origen = destino ? "profiles.email_contacto" : "";
    if (!destino && perfil?.user_id) {
      const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(
        perfil.user_id
      );
      if (userErr) {
        console.error("[contacto] Error leyendo auth.users:", userErr.message);
      }
      destino = userData?.user?.email ?? "";
      origen = destino ? "auth.users (cuenta)" : "";
    }

    console.log(
      `[contacto] Contacto GUARDADO para perfil=${profileId}. ` +
        `Destino aviso="${destino || "(vacío)"}"${origen ? ` [origen: ${origen}]` : ""}. ` +
        `email_contacto=${perfil?.email_contacto ? "sí" : "no"}, user_id=${perfil?.user_id ? "sí" : "no"}.`
    );

    if (destino && EMAIL_RE.test(destino)) {
      const res = await enviarAvisoContacto({
        para: destino,
        nombreCuidador: perfil?.nombre || "cuidador/a",
        nombreFamilia: nombre,
        emailFamilia: email,
        telefonoFamilia: telefono,
        mensaje,
      });
      if (!res.ok) {
        console.error("[contacto] No se pudo enviar el aviso por email:", res.error);
      }
    } else {
      console.warn(
        `[contacto] El cuidador ${profileId} no tiene email de aviso válido ("${destino}"); se omite el envío.`
      );
    }
  } catch (e) {
    // Cualquier fallo en el aviso se registra pero NO afecta a la respuesta.
    console.error(
      "[contacto] Fallo inesperado enviando el aviso:",
      e instanceof Error ? e.message : e
    );
  }

  return NextResponse.json({ ok: true });
}
