import { Resend } from "resend";

// Cliente de Resend para uso EXCLUSIVO en el servidor.
// La API key nunca debe llegar al cliente.
const apiKey = process.env.RESEND_API_KEY;

// "from" configurable. Fallback a onboarding@resend.dev para poder probar
// antes de verificar el dominio en Resend.
const EMAIL_FROM = process.env.EMAIL_FROM || "cuidadores.xyz <onboarding@resend.dev>";

if (!apiKey) {
  console.warn("[email] Falta RESEND_API_KEY: los avisos por email quedan desactivados.");
}

const resend = apiKey ? new Resend(apiKey) : null;

export function emailConfigurado(): boolean {
  return Boolean(apiKey);
}

interface AvisoContacto {
  para: string; // email del cuidador
  nombreCuidador: string;
  nombreFamilia: string;
  emailFamilia: string;
  telefonoFamilia?: string | null;
  mensaje: string;
}

/**
 * Envía el aviso por email al cuidador cuando una familia le escribe.
 * Nunca lanza: devuelve { ok, error } para que el llamante decida. El fallo
 * de email NO debe romper el guardado del contacto.
 */
export async function enviarAvisoContacto(
  datos: AvisoContacto
): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY no configurada" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: datos.para,
      // El cuidador puede responder directamente a la familia.
      replyTo: datos.emailFamilia,
      subject: "Una familia te ha contactado en cuidadores.xyz",
      html: construirHtml(datos),
    });

    if (error) {
      return { ok: false, error: error.message || "Error de Resend" };
    }
    return { ok: Boolean(data) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error desconocido" };
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function construirHtml(d: AvisoContacto): string {
  const tel = d.telefonoFamilia
    ? `<tr><td style="padding:4px 0;color:#8a9490;width:90px">Teléfono</td><td style="padding:4px 0;color:#1a3530;font-weight:600"><a href="tel:${esc(
        d.telefonoFamilia
      )}" style="color:#1a3530;text-decoration:none">${esc(d.telefonoFamilia)}</a></td></tr>`
    : "";

  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#fdfaf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdfaf5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ede8df;border-radius:20px;overflow:hidden;">
          <!-- Cabecera -->
          <tr>
            <td style="background:#1a3530;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;vertical-align:middle;">
                    <div style="width:36px;height:36px;background:#2d8a79;border-radius:9px;text-align:center;line-height:36px;">
                      <span style="color:#ffffff;font-size:18px;">&#9829;</span>
                    </div>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;">cuidadores</span><span style="color:#4ba394;font-size:18px;">.xyz</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Cuerpo -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#1a3530;font-weight:700;">Hola ${esc(
                d.nombreCuidador
              )}, tienes una nueva solicitud</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5f57;">
                Una familia está interesada en tu perfil y te ha escrito a través de
                cuidadores.xyz. Aquí tienes sus datos y su mensaje:
              </p>

              <div style="background:#fdfaf5;border:1px solid #ede8df;border-radius:14px;padding:20px 22px;margin-bottom:22px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr><td style="padding:4px 0;color:#8a9490;width:90px">Familia</td><td style="padding:4px 0;color:#1a3530;font-weight:600">${esc(
                    d.nombreFamilia
                  )}</td></tr>
                  <tr><td style="padding:4px 0;color:#8a9490">Email</td><td style="padding:4px 0;color:#1a3530;font-weight:600"><a href="mailto:${esc(
                    d.emailFamilia
                  )}" style="color:#2d8a79;text-decoration:none">${esc(d.emailFamilia)}</a></td></tr>
                  ${tel}
                </table>
              </div>

              <p style="margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#8a9490;">Mensaje</p>
              <div style="background:#eaf4f0;border-left:3px solid #2d8a79;border-radius:8px;padding:16px 18px;font-size:15px;line-height:1.6;color:#1a3530;white-space:pre-line;">${esc(
                d.mensaje
              )}</div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${esc(d.emailFamilia)}" style="display:inline-block;background:#2d8a79;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 28px;border-radius:999px;">Responder a la familia</a>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#8a9490;text-align:center;">
                Puedes responder directamente a este correo: llegará a ${esc(d.nombreFamilia)}.
              </p>
            </td>
          </tr>
          <!-- Pie -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #ede8df;">
              <p style="margin:0;font-size:12px;color:#b0aba3;text-align:center;">
                cuidadores.xyz · Cuidado profesional, confianza real.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
