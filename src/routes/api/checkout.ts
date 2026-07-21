import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { isPromoActive } = await import("@/lib/pricing");
          const { createCreemCheckout } = await import("@/lib/creem.server");

          const promoActive = isPromoActive();
          const productId = process.env.CREEM_PRODUCT_ID;

          if (!productId) {
            return Response.json(
              {
                error:
                  "CREEM_PRODUCT_ID no está configurado en el servidor. Crea el producto en Creem y guarda su ID.",
              },
              { status: 500 },
            );
          }

          // La promo es un CUPÓN de descuento (no un producto aparte). Si está
          // activa, aplicamos el código sobre el product_id de precio completo.
          const promoCode = process.env.CREEM_PROMO_CODE;
          const discountCode = promoActive ? promoCode : undefined;

          const origin =
            request.headers.get("origin") ?? new URL(request.url).origin;

          // request_id: idempotencia + trazabilidad. Creem lo devuelve en el
          // redirect y en el webhook, así que sirve para casar sesiones.
          const requestId = crypto.randomUUID();

          const checkout = await createCreemCheckout({
            productId,
            requestId,
            successUrl: `${origin}/success`,
            discountCode,
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
