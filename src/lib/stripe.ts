import Stripe from "stripe";

// Cliente de Stripe para uso EXCLUSIVO en el servidor.
// La secret key nunca debe llegar al cliente.
const secret = process.env.STRIPE_SECRET_KEY;

if (!secret) {
  // No lanzamos en import para no romper el build; las rutas comprueban
  // la config en tiempo de ejecución.
  console.warn("[stripe] Falta STRIPE_SECRET_KEY en las variables de entorno.");
}

// Usamos la versión de API por defecto de la cuenta (omitimos apiVersion).
export const stripe = new Stripe(secret ?? "", {
  typescript: true,
});

export function stripeConfigurado(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
