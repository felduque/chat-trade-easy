import { createFileRoute } from "@tanstack/react-router";

// Webhook público de Creem. Vive en /api/public/* porque Lovable bypasea la
// auth de sitio publicado en ese prefijo — Creem llama sin credenciales
// nuestras, así que la seguridad la aporta la firma HMAC verificada abajo.
//
// URL estable para configurar en el dashboard de Creem:
//   https://project--<PROJECT_ID>.lovable.app/api/public/creem-webhook
export const Route = createFileRoute("/api/public/creem-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("creem-signature");

        // Leemos el body en crudo — la verificación depende de los bytes
        // exactos que Creem firmó, no del JSON reparseado.
        const rawBody = await request.text();

        const { verifyCreemWebhookSignature } = await import(
          "@/lib/creem.server"
        );

        const ok = await verifyCreemWebhookSignature(rawBody, signature);
        if (!ok) {
          console.error("[creem-webhook] firma inválida");
          return new Response("Invalid signature", { status: 401 });
        }

        let event: {
          eventType?: string;
          type?: string;
          object?: Record<string, unknown>;
          data?: Record<string, unknown>;
        };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const eventType = event.eventType ?? event.type ?? "unknown";
        const payload = (event.object ?? event.data ?? {}) as Record<
          string,
          unknown
        >;

        try {
          switch (eventType) {
            case "checkout.completed":
            case "order.paid":
            case "payment.succeeded": {
              const orderId = payload["id"] ?? payload["order_id"];
              const email =
                (payload["customer"] as { email?: string } | undefined)?.email ??
                payload["customer_email"];
              const amount = payload["amount"] ?? payload["total"];
              const currency = payload["currency"];

              console.log(
                `[creem-webhook] ${eventType} order=${orderId} email=${email} amount=${amount} ${currency}`,
              );

              // TODO: Emitir la licencia del Trading Assistant.
              //   - Generar un license key único ligado al order_id / customer.
              //   - Guardarlo (Lovable Cloud / KV / DB) para revalidación.
              //
              // TODO: Enviar el correo con la licencia y el enlace de descarga.
              //   - Proveedor transaccional (Resend, Postmark…).
              //   - Instalación en 4 pasos + link firmado al binario.

              break;
            }

            case "refund.created":
            case "order.refunded": {
              console.log(`[creem-webhook] refund ${payload["id"]}`);
              // TODO: Revocar licencia asociada a la orden reembolsada.
              break;
            }

            default:
              // Otros eventos: devolvemos 200 para que Creem no reintente.
              break;
          }

          return Response.json({ received: true });
        } catch (err) {
          console.error("[creem-webhook] error procesando evento", err);
          return new Response("Webhook handler error", { status: 500 });
        }
      },
    },
  },
});
