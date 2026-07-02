// Tipos compartidos del dominio cuidadores.xyz

export type TipoCuidado = "ninos" | "mayores" | "dependientes";
export type PlanDestacado = "7dias" | "mensual";

export interface Profile {
  id: string;
  user_id: string;
  nombre: string;
  foto_url: string | null;
  descripcion: string | null;
  curriculum: string | null;
  zona: string | null;
  experiencia_anios: number | null;
  tarifa_hora: number | null;
  telefono: string | null;
  email_contacto: string | null;
  tipo_cuidado: TipoCuidado;
  disponibilidad: string | null;
  destacado_hasta: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  profile_id: string;
  plan: PlanDestacado;
  stripe_payment_id: string | null;
  destacado_hasta: string;
  activo: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  profile_id: string;
  nombre_familia: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  created_at: string;
}

// Etiquetas legibles para la UI
export const TIPO_CUIDADO_LABEL: Record<TipoCuidado, string> = {
  ninos: "Niños",
  mayores: "Personas mayores",
  dependientes: "Personas dependientes",
};

// ⚙️ ÚNICO sitio donde se definen los planes y precios de destacado.
// `unitAmount` está en céntimos (lo que espera Stripe). Cambia aquí y
// se actualiza en toda la app (UI + checkout).
export const PLANES = {
  "7dias": {
    id: "7dias" as PlanDestacado,
    nombre: "Destacado 7 días",
    precio: 9,
    precioLabel: "9 €",
    unitAmount: 900, // 9,00 €
    dias: 7,
    descripcion: "Aparece en primera fila durante una semana.",
  },
  mensual: {
    id: "mensual" as PlanDestacado,
    nombre: "Destacado mensual",
    precio: 19.99,
    precioLabel: "19,99 €",
    unitAmount: 1999, // 19,99 €
    dias: 30,
    descripcion: "Máxima visibilidad durante 30 días.",
  },
} as const;

export const STRIPE_CURRENCY = "eur";

// Type guard para validar el plan recibido por la API.
export function esPlanValido(p: unknown): p is PlanDestacado {
  return p === "7dias" || p === "mensual";
}

// ¿El perfil está destacado en este momento?
export function estaDestacado(p: Pick<Profile, "destacado_hasta">): boolean {
  if (!p.destacado_hasta) return false;
  return new Date(p.destacado_hasta).getTime() > Date.now();
}
