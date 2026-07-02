"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TIPO_CUIDADO_LABEL, type Profile, type TipoCuidado } from "@/lib/types";

const DISPONIBILIDAD_OPCIONES = [
  "Mañanas",
  "Tardes",
  "Noches",
  "Fines de semana",
  "Jornada completa",
  "Por horas",
  "Interna",
  "Externa",
];

export default function PerfilForm({
  initial,
  userId,
}: {
  initial: Profile;
  userId: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Estado del formulario
  const [nombre, setNombre] = useState(initial.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial.descripcion ?? "");
  const [curriculum, setCurriculum] = useState(initial.curriculum ?? "");
  const [zona, setZona] = useState(initial.zona ?? "");
  const [experiencia, setExperiencia] = useState(
    initial.experiencia_anios != null ? String(initial.experiencia_anios) : ""
  );
  const [tarifa, setTarifa] = useState(
    initial.tarifa_hora != null ? String(initial.tarifa_hora) : ""
  );
  const [tipo, setTipo] = useState<TipoCuidado>(initial.tipo_cuidado);
  const [disponibilidad, setDisponibilidad] = useState(initial.disponibilidad ?? "");
  const [telefono, setTelefono] = useState(initial.telefono ?? "");
  const [emailContacto, setEmailContacto] = useState(initial.email_contacto ?? "");

  // Foto
  const [fotoUrl, setFotoUrl] = useState<string | null>(initial.foto_url);
  const [preview, setPreview] = useState<string | null>(initial.foto_url);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }

    // Previsualización inmediata (antes de subir)
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setSubiendoFoto(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("fotos")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setSubiendoFoto(false);
      setError("No se ha podido subir la foto. Inténtalo de nuevo.");
      return;
    }

    const { data: pub } = supabase.storage.from("fotos").getPublicUrl(path);
    setFotoUrl(pub.publicUrl);
    setPreview(pub.publicUrl);
    setSubiendoFoto(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(false);

    // Validación básica
    if (nombre.trim().length < 2) {
      setError("El nombre es obligatorio.");
      return;
    }
    const exp = experiencia === "" ? 0 : Number(experiencia);
    if (Number.isNaN(exp) || exp < 0 || exp > 80) {
      setError("Los años de experiencia no son válidos.");
      return;
    }
    let tarifaNum: number | null = null;
    if (tarifa !== "") {
      tarifaNum = Number(tarifa.replace(",", "."));
      if (Number.isNaN(tarifaNum) || tarifaNum < 0 || tarifaNum > 1000) {
        setError("La tarifa por hora no es válida.");
        return;
      }
    }
    if (emailContacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContacto)) {
      setError("El email de contacto no es válido.");
      return;
    }

    setGuardando(true);
    const supabase = createClient();
    const { error: updErr } = await supabase
      .from("profiles")
      .update({
        nombre: nombre.trim(),
        foto_url: fotoUrl,
        descripcion: descripcion.trim() || null,
        curriculum: curriculum.trim() || null,
        zona: zona.trim() || null,
        experiencia_anios: exp,
        tarifa_hora: tarifaNum,
        tipo_cuidado: tipo,
        disponibilidad: disponibilidad.trim() || null,
        telefono: telefono.trim() || null,
        email_contacto: emailContacto.trim() || null,
      })
      .eq("id", initial.id);

    setGuardando(false);

    if (updErr) {
      setError("No se han podido guardar los cambios. Inténtalo de nuevo.");
      return;
    }

    setExito(true);
    router.refresh();
    // Ocultar el mensaje de éxito tras unos segundos
    setTimeout(() => setExito(false), 4000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Columna izquierda: foto */}
      <div className="lg:col-span-1">
        <div className="rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="text-sm font-semibold text-brand-800">Foto de perfil</h3>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-brand-100">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-brand-400">
                  {nombre.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={subiendoFoto}
              className="btn-secondary mt-4 text-sm disabled:opacity-60"
            >
              {subiendoFoto ? "Subiendo…" : preview ? "Cambiar foto" : "Subir foto"}
            </button>
            <p className="mt-2 text-center text-xs text-brand-400">
              JPG o PNG, máximo 5 MB.
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha: datos */}
      <div className="lg:col-span-2 space-y-6">
        {exito && (
          <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
            ✅ Cambios guardados correctamente.
          </div>
        )}
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-brand-800">Datos básicos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre *" full>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder="Tu nombre" />
            </Field>

            <Field label="Tipo de cuidado *">
              <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoCuidado)} className={inputClass}>
                {(Object.keys(TIPO_CUIDADO_LABEL) as TipoCuidado[]).map((t) => (
                  <option key={t} value={t}>{TIPO_CUIDADO_LABEL[t]}</option>
                ))}
              </select>
            </Field>

            <Field label="Zona / ubicación">
              <input value={zona} onChange={(e) => setZona(e.target.value)} className={inputClass} placeholder="Ciudad, barrio, comarca…" />
            </Field>

            <Field label="Años de experiencia">
              <input type="number" min={0} max={80} value={experiencia} onChange={(e) => setExperiencia(e.target.value)} className={inputClass} placeholder="0" />
            </Field>

            <Field label="Tarifa por hora (€)">
              <input inputMode="decimal" value={tarifa} onChange={(e) => setTarifa(e.target.value)} className={inputClass} placeholder="Ej. 12" />
            </Field>
          </div>
        </div>

        <div className="rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-brand-800">Sobre ti</h3>
          <div className="space-y-4">
            <Field label="Descripción corta" full>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                maxLength={300}
                className={inputClass}
                placeholder="Una frase que te describa (aparece en la tarjeta del listado)."
              />
              <p className="mt-1 text-right text-xs text-brand-400">{descripcion.length}/300</p>
            </Field>

            <Field label="Currículum / experiencia" full>
              <textarea
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                rows={7}
                className={inputClass}
                placeholder="Cuenta tu experiencia, formación, idiomas, referencias, con qué tipo de personas has trabajado…"
              />
            </Field>

            <Field label="Disponibilidad" full>
              <input
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                className={inputClass}
                placeholder="Ej. Mañanas y fines de semana"
                list="disponibilidad-list"
              />
              <datalist id="disponibilidad-list">
                {DISPONIBILIDAD_OPCIONES.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>

        <div className="rounded-4xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-brand-800">Datos de contacto</h3>
          <p className="mb-4 text-xs text-brand-500">
            Las familias usarán el formulario de contacto. Estos datos solo se muestran si decides incluirlos.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono">
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClass} placeholder="600 000 000" />
            </Field>
            <Field label="Email de contacto">
              <input type="email" value={emailContacto} onChange={(e) => setEmailContacto(e.target.value)} className={inputClass} placeholder="tu@email.com" />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="submit" disabled={guardando || subiendoFoto} className="btn-primary disabled:opacity-60">
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-brand-200 bg-cream/60 px-4 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200/70";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-sm font-medium text-brand-700">{label}</label>
      {children}
    </div>
  );
}
