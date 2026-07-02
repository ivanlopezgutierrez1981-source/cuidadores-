"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm({
  profileId,
  nombreCuidador,
}: {
  profileId: string;
  nombreCuidador: string;
}) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (nombre.trim().length < 2) {
      setError("Introduce tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El email no es válido.");
      return;
    }
    if (mensaje.trim().length < 10) {
      setError("Escribe un mensaje un poco más detallado (mínimo 10 caracteres).");
      return;
    }

    setEnviando(true);
    const supabase = createClient();
    const { error: insErr } = await supabase.from("contacts").insert({
      profile_id: profileId,
      nombre_familia: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim() || null,
      mensaje: mensaje.trim(),
    });
    setEnviando(false);

    if (insErr) {
      setError("No se ha podido enviar el mensaje. Inténtalo de nuevo.");
      return;
    }

    // ── (Opcional) Aviso por email al cuidador ──────────────────────
    // Dejado preparado para una fase futura. Crear una Route Handler
    // /api/contacto que use el cliente admin para leer el email del
    // cuidador y enviar el aviso con un proveedor (Resend, etc.):
    //
    // await fetch("/api/contacto", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ profileId, nombre, email, telefono, mensaje }),
    // });
    // ────────────────────────────────────────────────────────────────

    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-2xl">
          ✅
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold text-brand-900">¡Tu mensaje se ha enviado!</h3>
        <p className="mt-2 text-sm text-brand-600">
          {nombreCuidador} recibirá tu solicitud y se pondrá en contacto contigo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Tu nombre *</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inputClass}
            placeholder="Nombre de la familia"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-700">Teléfono (opcional)</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={inputClass}
          placeholder="600 000 000"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-700">Mensaje *</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={5}
          className={inputClass}
          placeholder={`Hola ${nombreCuidador}, busco a alguien para… Cuéntale qué necesitas, días, horario y zona.`}
        />
      </div>

      <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
        {enviando ? "Enviando…" : "Enviar mensaje"}
      </button>
      <p className="text-center text-xs text-brand-400">
        Al enviar aceptas nuestra Política de Privacidad. Tus datos solo se comparten con este cuidador/a.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-brand-200 bg-cream/60 px-4 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200/70";
