import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre las cookies y tecnologías similares que usa cuidadores.xyz.",
};

export default function CookiesPage() {
  return (
    <LegalShell titulo="Política de cookies" actualizado="[fecha]">
      <p>
        Esta política explica qué cookies y tecnologías similares utiliza cuidadores.xyz.
        Una cookie es un pequeño archivo que se almacena en tu dispositivo al visitar un
        sitio web y que permite, entre otras cosas, mantener tu sesión iniciada.
      </p>

      <h2>1. Cookies que utilizamos</h2>
      <p>
        Actualmente solo utilizamos cookies y almacenamiento <strong>técnicos y necesarios</strong>
        para el funcionamiento del sitio. <strong>No usamos cookies de analítica ni de
        publicidad</strong> por el momento.
      </p>
      <ul>
        <li>
          <strong>Cookies de sesión (Supabase Auth):</strong> mantienen la sesión iniciada
          del cuidador/a y permiten el acceso seguro a su panel. Son imprescindibles para
          usar las funciones de cuenta.
        </li>
        <li>
          <strong>Cookies de Stripe:</strong> cuando se realiza un pago de destacado, Stripe
          puede instalar cookies necesarias para procesar el pago de forma segura y prevenir
          el fraude.
        </li>
        <li>
          <strong>Almacenamiento local del consentimiento:</strong> guardamos en tu navegador
          tu elección sobre este banner de cookies para no volver a mostrártelo.
        </li>
      </ul>

      <h2>2. Base legal</h2>
      <p>
        Las cookies estrictamente necesarias no requieren consentimiento. Si en el futuro
        incorporamos cookies de analítica o de terceros no esenciales, solicitaremos tu
        consentimiento previo y actualizaremos esta política.
      </p>

      <h2>3. Cómo gestionar o eliminar las cookies</h2>
      <p>
        Puedes configurar tu navegador para bloquear o eliminar las cookies. Ten en cuenta
        que, si bloqueas las cookies técnicas, es posible que no puedas iniciar sesión ni
        usar correctamente algunas funciones del sitio. Consulta la ayuda de tu navegador:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan" target="_blank" rel="noopener">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener">Microsoft Edge</a></li>
      </ul>

      <h2>4. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política de Cookies para reflejar cambios técnicos o
        legales. Publicaremos cualquier cambio en esta misma página.
      </p>
    </LegalShell>
  );
}
