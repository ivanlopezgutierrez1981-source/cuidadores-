"use client";

import { useState } from "react";

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
    // El guardado del contacto + el aviso por email al cuidador se hacen en
    // el servidor (/api/contacto): así el service_role y la RESEND_API_KEY
    // nunca llegan al cliente.
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          mensaje: mensaje.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      setEnviando(false);

      if (!res.ok || !data.ok) {
        setError(data.error || "No se ha podido enviar el mensaje. Inténtalo de nuevo.");
        return;
      }
    } catch {
      setEnviando(false);
      setError("Error de conexión. Inténtalo de nuevo.");
      return;
    }

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
        <div className="rounded-xl bg-coral-50 px-4 py-3 text-sm text-coral-600">{error}</div>
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

const inputClass = "field";
