import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal y datos identificativos del titular de cuidadores.xyz.",
};

export default function AvisoLegalPage() {
  return (
    <LegalShell titulo="Aviso legal" actualizado="[fecha]">
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
        de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen a
        disposición de los usuarios los siguientes datos identificativos del titular de
        este sitio web.
      </p>

      <h2>1. Datos identificativos</h2>
      <ul>
        <li><strong>Titular:</strong> [Nombre del titular o razón social]</li>
        <li><strong>NIF/CIF:</strong> [NIF/CIF]</li>
        <li><strong>Domicilio:</strong> [Dirección completa]</li>
        <li><strong>Email de contacto:</strong> [email@cuidadores.xyz]</li>
        <li><strong>Sitio web:</strong> https://cuidadores.xyz</li>
        <li><strong>Actividad:</strong> Plataforma online que pone en contacto a familias con cuidadores y cuidadoras.</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        cuidadores.xyz es un <strong>marketplace de intermediación</strong> cuyo único
        objeto es facilitar el contacto entre familias que buscan servicios de cuidado y
        cuidadores/as que los ofrecen. cuidadores.xyz <strong>no es empleador</strong>,
        no presta directamente servicios de cuidado ni es parte de la relación que, en su
        caso, acuerden las partes (ver <a href="/terminos">Términos de Uso</a>).
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario e implica la
        aceptación de las condiciones recogidas en este Aviso Legal, en los
        <a href="/terminos"> Términos de Uso</a>, en la
        <a href="/privacidad"> Política de Privacidad</a> y en la
        <a href="/cookies"> Política de Cookies</a>. El usuario se compromete a hacer un
        uso lícito, diligente y de buena fe de los contenidos y servicios.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Los contenidos del sitio (textos, diseño, logotipos, código y demás elementos)
        son titularidad del titular o se utilizan con autorización, y están protegidos por
        la normativa de propiedad intelectual e industrial. Las fotografías y los datos de
        cada perfil son responsabilidad del cuidador/a que los publica, quien garantiza
        disponer de los derechos necesarios sobre ellos.
      </p>

      <h2>5. Exclusión de responsabilidad</h2>
      <p>
        El titular no se hace responsable de la veracidad, exactitud o actualidad de la
        información publicada por los usuarios en sus perfiles, ni de los acuerdos o
        servicios que las partes contraten entre sí. Tampoco garantiza la ausencia de
        interrupciones o errores en el acceso al sitio web.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para la resolución
        de cualquier controversia, las partes se someten a los juzgados y tribunales que
        correspondan conforme a la normativa de consumidores aplicable.
      </p>
    </LegalShell>
  );
}
