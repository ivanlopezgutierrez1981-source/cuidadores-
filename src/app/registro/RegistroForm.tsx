"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { traducirAuthError } from "@/lib/authErrors";

export default function RegistroForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMensaje, setOkMensaje] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validaciones básicas en cliente.
    if (nombre.trim().length < 2) {
      setError("Introduce tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El email no es válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Guardamos el nombre en los metadatos del usuario.
        data: { nombre: nombre.trim() },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : undefined,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(traducirAuthError(signUpError.message));
      return;
    }

    // Si Supabase exige confirmar email, no habrá sesión todavía.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setOkMensaje(
        "¡Cuenta creada! Te hemos enviado un email para confirmar tu cuenta. Revísalo y luego inicia sesión."
      );
    }
  }

  if (okMensaje) {
    return (
      <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">
        ✅ {okMensaje}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      )}

      <Field label="Nombre" htmlFor="nombre">
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
          className={inputClass}
          placeholder="Tu nombre"
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={inputClass}
          placeholder="tu@email.com"
        />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
        />
      </Field>

      <Field label="Repite la contraseña" htmlFor="password2">
        <input
          id="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Repite la contraseña"
        />
      </Field>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Creando cuenta…" : "Crear cuenta gratis"}
      </button>
    </form>
  );
}

const inputClass = "field";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-brand-700">
        {label}
      </label>
      {children}
    </div>
  );
}
