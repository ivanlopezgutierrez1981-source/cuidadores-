// Verificación de reCAPTCHA v3 (server-side). La secret key nunca llega al cliente.
const SECRET = process.env.RECAPTCHA_SECRET_KEY;
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || "0.5");

export function recaptchaConfigurado(): boolean {
  return Boolean(SECRET);
}

interface ResultadoRecaptcha {
  ok: boolean;
  score?: number;
  motivo?: string;
  skipped?: boolean;
}

/**
 * Verifica el token de reCAPTCHA v3 contra Google.
 *
 * Degradación elegante:
 *  - Si no hay RECAPTCHA_SECRET_KEY → skipped (no bloquea, para no romper el
 *    formulario antes de configurar las claves).
 *  - Ante un error de red con Google → fail-open (permite) para no perder
 *    contactos legítimos por una caída puntual del verificador.
 *  - Bloquea de forma explícita: token ausente, respuesta inválida de Google,
 *    acción que no coincide, o score por debajo del umbral.
 */
export async function verificarRecaptcha(
  token: string | undefined,
  accionEsperada: string
): Promise<ResultadoRecaptcha> {
  if (!SECRET) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, motivo: "token ausente" };
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: SECRET, response: token }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return { ok: false, motivo: `Google rechazó: ${(data["error-codes"] || []).join(", ")}` };
    }
    if (accionEsperada && data.action && data.action !== accionEsperada) {
      return { ok: false, score: data.score, motivo: `acción no coincide (${data.action})` };
    }
    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { ok: false, score: data.score, motivo: `score bajo (${data.score} < ${MIN_SCORE})` };
    }
    return { ok: true, score: data.score };
  } catch (e) {
    // Fail-open: no bloqueamos un contacto legítimo si Google no responde.
    console.error(
      "[recaptcha] Error al verificar (se permite por fail-open):",
      e instanceof Error ? e.message : e
    );
    return { ok: true, skipped: true };
  }
}
