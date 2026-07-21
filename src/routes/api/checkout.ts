import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { isPromoActive } = await import("@/lib/pricing");
          const { createCreemCheckout } = await import("@/lib/creem.server");

          const promoActive = isPromoActive();
          const promoProductId = process.env.CREEM_PRODUCT_ID_PROMO;
          const fullProductId = process.env.CREEM_PRODUCT_ID;

          // Si la promo está activa y hay product_id promo configurado, úsalo.
          // En cualquier otro caso, cae al product_id de precio completo.
          const productId =
            promoActive && promoProductId ? promoProductId : fullProductId;

          if (!productId) {
            return Response.json(
              {
                error:
                  "CREEM_PRODUCT_ID no está configurado en el servidor. Crea el producto en Creem y guarda su ID.",
              },
              { status: 500 },
            );
          }

          const origin =
            request.headers.get("origin") ?? new URL(request.url).origin;

          // request_id: idempotencia + trazabilidad. Creem lo devuelve en el
          // redirect y en el webhook, así que sirve para casar sesiones.
          const requestId = crypto.randomUUID();

          const checkout = await createCreemCheckout({
            productId,
            requestId,
            successUrl: `${origin}/success`,
            metadata: {
              product: "trading-assistant",
              brand: "dg-developers",
              promo_active: promoActive ? "1" : "0",
            },
          });

          if (!checkout.checkout_url) {
            return Response.json(
              { error: "Creem no devolvió una URL de checkout." },
              { status: 500 },
            );
          }

          return Response.json({ url: checkout.checkout_url });
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
