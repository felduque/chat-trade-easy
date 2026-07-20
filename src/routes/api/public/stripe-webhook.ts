import { createFileRoute } from "@tanstack/react-router";

// Webhook público de Stripe. Vive en /api/public/* porque Lovable bypasea
// la auth de sitio publicado en ese prefijo — Stripe llama sin credenciales
// nuestras, así que la seguridad la aporta la firma HMAC verificada abajo.
//
// URL estable para configurar en el Dashboard de Stripe:
//   https://project--<PROJECT_ID>.lovable.app/api/public/stripe-webhook
export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!signature || !webhookSecret) {
          return new Response("Missing signature or webhook secret", {
            status: 400,
          });
        }

        // Debemos leer el body en crudo — la verificación de firma depende
        // de los bytes exactos que Stripe firmó, no del JSON parseado.
        const rawBody = await request.text();

        const { getStripe } = await import("@/lib/stripe.server");
        const stripe = getStripe();

        let event;
        try {
          // constructEventAsync usa SubtleCrypto, compatible con Cloudflare
          // Workers. La versión síncrona usa crypto de Node y rompe aquí.
          event = await stripe.webhooks.constructEventAsync(
            rawBody,
            signature,
            webhookSecret,
          );
        } catch (err) {
          console.error("[stripe-webhook] firma inválida", err);
          const message = err instanceof Error ? err.message : "invalid";
          return new Response(`Webhook signature error: ${message}`, {
            status: 400,
          });
        }

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object;
              const email =
                session.customer_details?.email ?? session.customer_email;
              const amount = session.amount_total;
              const currency = session.currency;

              console.log(
                `[stripe-webhook] checkout.session.completed id=${session.id} email=${email} amount=${amount} ${currency}`,
              );

              // TODO: Emitir la licencia del Trading Assistant.
              //   - Generar un license key único ligado a session.id / customer.
              //   - Guardarlo (base de datos, KV, o similar) para revalidación.
              //
              // TODO: Enviar el correo con la licencia y el enlace de descarga.
              //   - Usar un proveedor de correo transaccional (Resend, Postmark…).
              //   - Incluir instalación en 4 pasos + link firmado al binario.

              break;
            }

            case "checkout.session.expired":
              console.log(`[stripe-webhook] session expirada ${event.data.object.id}`);
              break;

            default:
              // Ignoramos otros eventos; devolvemos 200 para que Stripe no reintente.
              break;
          }

          return Response.json({ received: true });
        } catch (err) {
          console.error("[stripe-webhook] error procesando evento", err);
          return new Response("Webhook handler error", { status: 500 });
        }
      },
    },
  },
});
