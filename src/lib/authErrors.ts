// Traduce los mensajes de error de Supabase Auth a español claro.
export function traducirAuthError(message?: string): string {
  if (!message) return "Ha ocurrido un error. Inténtalo de nuevo.";
  const m = message.toLowerCase();

  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Este email ya está registrado. Prueba a iniciar sesión.";
  if (m.includes("invalid login credentials"))
    return "Email o contraseña incorrectos.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "El email no es válido.";
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu email antes de entrar. Revisa tu correo.";
  if (m.includes("for security purposes") || m.includes("rate limit"))
    return "Demasiados intentos. Espera unos segundos e inténtalo de nuevo.";
  if (m.includes("signups not allowed"))
    return "El registro está deshabilitado temporalmente.";

  return "No se ha podido completar la operación. Inténtalo de nuevo.";
}
