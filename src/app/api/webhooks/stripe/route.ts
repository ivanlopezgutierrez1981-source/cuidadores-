import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { PLANES, esPlanValido } from "@/lib/types";

// El webhook necesita el body RAW y el runtime de Node para verificar la firma.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] Falta STRIPE_WEBHOOK_SECRET.");
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma." }, { status: 400 });
  }

  // 1) Verificar SIEMPRE la firma con el body sin parsear.
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  // 2) Solo nos interesa el pago completado del Checkout.
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Asegurarnos de que está pagado (en mode=payment llega 'paid').
  if (session.payment_status && session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const profileId = session.metadata?.profile_id;
  const plan = session.metadata?.plan;

  if (!profileId || !esPlanValido(plan)) {
    console.error("[webhook] Metadata incompleta o plan inválido:", session.metadata);
    // 200 para que Stripe no reintente indefinidamente un evento que no podemos procesar.
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // Identificador del pago para idempotencia (preferimos el payment_intent).
  const paymentId =
    (typeof session.payment_intent === "string" ? session.payment_intent : null) ||
    session.id;

  // 3) Idempotencia: si ya procesamos este pago, no duplicar.
  const { data: yaExiste } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_payment_id", paymentId)
    .maybeSingle();

  if (yaExiste) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // 4) Calcular destacado_hasta SUMANDO sobre la fecha vigente (no retroceder).
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("destacado_hasta")
    .eq("id", profileId)
    .maybeSingle();

  if (profErr || !profile) {
    console.error("[webhook] Perfil no encontrado:", profileId, profErr);
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const ahora = Date.now();
  const vigente =
    profile.destacado_hasta && new Date(profile.destacado_hasta).getTime() > ahora
      ? new Date(profile.destacado_hasta).getTime()
      : ahora;

  const dias = PLANES[plan].dias;
  const destacadoHasta = new Date(vigente + dias * 24 * 60 * 60 * 1000).toISOString();

  // 5) Insertar la suscripción (registro del pago).
  const { error: subErr } = await supabase.from("subscriptions").insert({
    profile_id: profileId,
    plan,
    stripe_payment_id: paymentId,
    destacado_hasta: destacadoHasta,
    activo: true,
  });

  if (subErr) {
    console.error("[webhook] Error insertando subscription:", subErr);
    return NextResponse.json({ error: "Error guardando el pago." }, { status: 500 });
  }

  // 6) Actualizar el perfil (campo denormalizado para ordenar/filtrar rápido).
  const { error: updErr } = await supabase
    .from("profiles")
    .update({ destacado_hasta: destacadoHasta })
    .eq("id", profileId);

  if (updErr) {
    console.error("[webhook] Error actualizando profile.destacado_hasta:", updErr);
    return NextResponse.json({ error: "Error actualizando el perfil." }, { status: 500 });
  }

  console.log(
    `[webhook] Destacado aplicado a profile ${profileId} (${plan}) hasta ${destacadoHasta}`
  );
  return NextResponse.json({ received: true });
}
