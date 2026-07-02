import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso del marketplace cuidadores.xyz y del servicio de destacado de pago.",
};

export default function TerminosPage() {
  return (
    <LegalShell titulo="Términos de uso" actualizado="[fecha]">
      <p>
        Estos Términos de Uso regulan el acceso y la utilización de la plataforma
        cuidadores.xyz (en adelante, la "Plataforma"). Al registrarte o utilizar la
        Plataforma aceptas estos términos en su totalidad.
      </p>

      <h2>1. Naturaleza del servicio: solo intermediación</h2>
      <p>
        cuidadores.xyz es <strong>únicamente un punto de encuentro</strong> que pone en
        contacto a familias con cuidadores y cuidadoras. <strong>La Plataforma NO es
        empleador</strong>, no contrata a los cuidadores, no presta servicios de cuidado y
        <strong> no es parte de la relación</strong> (laboral, mercantil o de cualquier otra
        naturaleza) que las partes puedan acordar entre sí.
      </p>
      <p>
        En consecuencia, la negociación, contratación, condiciones, precio final, pago del
        servicio de cuidado, obligaciones fiscales y laborales y el cumplimiento de la
        normativa aplicable son <strong>responsabilidad exclusiva de las partes</strong>
        (familia y cuidador/a).
      </p>

      <h2>2. Verificación de los usuarios</h2>
      <p>
        cuidadores.xyz <strong>no verifica los antecedentes</strong> penales, la formación,
        la identidad ni las referencias de los cuidadores/as, salvo que expresamente se
        indique lo contrario. La información de cada perfil es facilitada y es
        responsabilidad del propio cuidador/a. <strong>Recomendamos a las familias</strong>
        solicitar documentación, referencias y mantener una entrevista antes de contratar
        cualquier servicio.
      </p>

      <h2>3. Obligaciones de los usuarios</h2>
      <ul>
        <li>Proporcionar información veraz, actualizada y lícita.</li>
        <li>No suplantar a terceros ni publicar contenidos falsos, ofensivos o ilícitos.</li>
        <li>Publicar únicamente fotografías y datos sobre los que se tengan derechos.</li>
        <li>Utilizar los datos de contacto recibidos solo para la finalidad prevista, respetando la normativa de protección de datos.</li>
        <li>Ser mayor de edad para registrarse como cuidador/a.</li>
      </ul>

      <h2>4. Servicio de destacado (pago)</h2>
      <p>
        El registro y la publicación del perfil son <strong>gratuitos</strong>. De forma
        opcional, los cuidadores/as pueden contratar un servicio de <strong>destacado</strong>
        que sitúa su perfil en primera posición del listado, con un distintivo visible,
        durante un periodo determinado:
      </p>
      <ul>
        <li><strong>Plan 7 días:</strong> 9,00 € (pago único).</li>
        <li><strong>Plan mensual (30 días):</strong> 19,99 € (pago único).</li>
      </ul>
      <p>
        Se trata de <strong>pagos únicos, no de suscripciones recurrentes</strong>: el
        destacado caduca automáticamente al finalizar el periodo y no se renueva ni se
        cobra de nuevo salvo que el cuidador/a contrate voluntariamente un nuevo destacado.
        Si se contrata un destacado mientras hay uno vigente, los días se suman al periodo
        restante.
      </p>
      <p>
        Los pagos se procesan a través de <strong>Stripe</strong>. Dado que el servicio de
        destacado es un contenido/servicio digital que comienza a prestarse de forma
        inmediata, <strong>el importe no es reembolsable</strong> una vez activado el
        destacado, salvo en los supuestos que la legislación de consumidores establezca
        como obligatorios o en caso de error técnico imputable a la Plataforma.
      </p>

      <h2>5. Eliminación de cuentas y contenidos</h2>
      <p>
        cuidadores.xyz se reserva el derecho de suspender o eliminar perfiles que incumplan
        estos términos, publiquen información falsa o inapropiada, o hagan un uso fraudulento
        de la Plataforma, sin derecho a indemnización.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        La Plataforma no responde de los daños derivados de los servicios de cuidado
        contratados entre las partes, de la veracidad de los perfiles, ni de las
        consecuencias de los acuerdos alcanzados. El uso de la Plataforma y la contratación
        de cualquier servicio de cuidado se realiza bajo la exclusiva responsabilidad de
        los usuarios.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        cuidadores.xyz podrá modificar estos términos por motivos legales u operativos. Los
        cambios se publicarán en esta página e indicarán su fecha de actualización.
      </p>

      <h2>8. Legislación y jurisdicción</h2>
      <p>
        Estos términos se rigen por la legislación española. Para cualquier controversia,
        las partes se someten a los juzgados y tribunales competentes conforme a la
        normativa de consumidores aplicable.
      </p>
    </LegalShell>
  );
}
