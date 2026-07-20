import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const priceId = process.env.STRIPE_PRICE_ID;
          if (!priceId) {
            return Response.json(
              { error: "STRIPE_PRICE_ID no está configurado en el servidor." },
              { status: 500 },
            );
          }

          const { getStripe } = await import("@/lib/stripe.server");
          const stripe = getStripe();

          // Deriva el origin de la request; sirve para preview, producción y custom domain.
          const origin =
            request.headers.get("origin") ??
            new URL(request.url).origin;

          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: "auto",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: {
              product: "trading-assistant",
              brand: "dg-developers",
            },
          });

          if (!session.url) {
            return Response.json(
              { error: "Stripe no devolvió una URL de checkout." },
              { status: 500 },
            );
          }

          return Response.json({ url: session.url });
        } catch (err) {
          console.error("[/api/checkout] error", err);
          const message =
            err instanceof Error ? err.message : "Error interno del servidor";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
