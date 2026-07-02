import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigurado } from "@/lib/stripe";
import { PLANES, STRIPE_CURRENCY, esPlanValido } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!stripeConfigurado()) {
    return NextResponse.json(
      { error: "El pago no está disponible ahora mismo." },
      { status: 503 }
    );
  }

  // 1) Validar plan recibido.
  let plan: unknown;
  try {
    const body = await request.json();
    plan = body?.plan;
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }
  if (!esPlanValido(plan)) {
    return NextResponse.json({ error: "Plan no válido." }, { status: 400 });
  }

  // 2) Validar sesión: solo el cuidador logueado puede pagar lo suyo.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  // 3) Obtener el perfil del usuario autenticado.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "No tienes un perfil creado." }, { status: 400 });
  }

  const planInfo = PLANES[plan];
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  // 4) Crear la sesión de Stripe Checkout (pago único, EUR).
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: STRIPE_CURRENCY,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: planInfo.unitAmount,
            product_data: {
              name: `cuidadores.xyz — ${planInfo.nombre}`,
              description: planInfo.descripcion,
            },
          },
        },
      ],
      // Metadata clave que leerá el webhook.
      metadata: {
        profile_id: profile.id,
        user_id: user.id,
        plan,
      },
      success_url: `${baseUrl}/dashboard?pago=ok`,
      cancel_url: `${baseUrl}/dashboard?pago=cancelado`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Error creando la sesión de Stripe:", err);
    return NextResponse.json(
      { error: "No se ha podido iniciar el pago. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
