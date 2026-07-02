import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo cuidadores.xyz trata tus datos personales conforme al RGPD y la LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <LegalShell titulo="Política de privacidad" actualizado="[fecha]">
      <p>
        En cuidadores.xyz nos tomamos en serio la protección de tus datos personales. Esta
        política explica qué datos tratamos, con qué finalidad y qué derechos tienes,
        conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Titular:</strong> [Nombre del titular o razón social]</li>
        <li><strong>NIF/CIF:</strong> [NIF/CIF]</li>
        <li><strong>Domicilio:</strong> [Dirección completa]</li>
        <li><strong>Email de contacto / privacidad:</strong> [email@cuidadores.xyz]</li>
      </ul>

      <h2>2. Qué datos recogemos y con qué finalidad</h2>
      <h3>a) Cuidadores/as registrados</h3>
      <ul>
        <li><strong>Datos de cuenta:</strong> email y contraseña (gestionados por Supabase Auth), para crear y acceder a tu cuenta.</li>
        <li><strong>Datos de perfil:</strong> nombre, foto, descripción, currículum, zona, años de experiencia, tarifa, disponibilidad, teléfono y email de contacto, para mostrarlos en tu perfil público y que las familias puedan conocerte y contactarte.</li>
        <li><strong>Datos de pago de destacado:</strong> identificadores de la transacción de Stripe. Los datos de la tarjeta los trata directamente Stripe; nosotros no los almacenamos.</li>
      </ul>
      <h3>b) Familias (sin registro)</h3>
      <ul>
        <li><strong>Datos del formulario de contacto:</strong> nombre, email, teléfono (opcional) y mensaje, con la única finalidad de hacerlos llegar al cuidador/a seleccionado.</li>
      </ul>

      <h2>3. Base legal del tratamiento</h2>
      <ul>
        <li><strong>Ejecución de un contrato / prestación del servicio</strong> (art. 6.1.b RGPD): gestión de tu cuenta, publicación de tu perfil y tramitación de los pagos de destacado.</li>
        <li><strong>Consentimiento</strong> (art. 6.1.a RGPD): envío del formulario de contacto y publicación voluntaria de los datos de tu perfil.</li>
        <li><strong>Interés legítimo</strong> (art. 6.1.f RGPD): seguridad de la plataforma y prevención de usos fraudulentos.</li>
      </ul>

      <h2>4. Conservación de los datos</h2>
      <p>
        Conservaremos tus datos mientras mantengas tu cuenta activa o exista una relación
        con la plataforma. Los mensajes de contacto se conservan el tiempo necesario para
        gestionar la puesta en contacto. Una vez finalizada la relación, los datos se
        conservarán bloqueados durante los plazos legalmente exigibles (fiscales,
        mercantiles) y se suprimirán transcurridos dichos plazos.
      </p>

      <h2>5. Destinatarios y encargados del tratamiento</h2>
      <p>No vendemos tus datos. Compartimos información, en la medida necesaria, con:</p>
      <ul>
        <li><strong>Cuidadores/as:</strong> reciben los datos del formulario de contacto que envían las familias.</li>
        <li><strong>Supabase</strong> (autenticación, base de datos y almacenamiento de fotos).</li>
        <li><strong>Stripe</strong> (procesamiento de pagos de destacado).</li>
        <li><strong>Vercel</strong> (alojamiento del sitio web).</li>
      </ul>
      <p>
        Algunos proveedores pueden tratar datos fuera del EEE; en tal caso se aplican las
        garantías adecuadas previstas en el RGPD (cláusulas contractuales tipo).
      </p>

      <h2>6. Tus derechos (RGPD)</h2>
      <p>Puedes ejercer en cualquier momento tus derechos de:</p>
      <ul>
        <li>Acceso, rectificación y supresión.</li>
        <li>Oposición y limitación del tratamiento.</li>
        <li>Portabilidad de tus datos.</li>
        <li>Retirar el consentimiento prestado, sin efectos retroactivos.</li>
      </ul>
      <p>
        Para ejercerlos, escribe a <strong>[email@cuidadores.xyz]</strong> indicando el
        derecho que deseas ejercer y adjuntando una copia de un documento que acredite tu
        identidad. Los cuidadores/as también pueden editar o eliminar gran parte de sus
        datos desde su panel. Si consideras que no hemos atendido correctamente tu
        solicitud, puedes reclamar ante la <strong>Agencia Española de Protección de Datos</strong>
        (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. El
        acceso a la base de datos está restringido mediante políticas de seguridad a nivel
        de fila (RLS), de modo que cada cuidador/a solo puede acceder a sus propios datos.
      </p>
    </LegalShell>
  );
}
