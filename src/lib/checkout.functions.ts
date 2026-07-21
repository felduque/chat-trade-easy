import { createServerFn } from "@tanstack/react-start";

// Verifica la firma del redirect que Creem añade a success_url.
// Recibe todos los query params tal cual llegan al navegador.
export const verifyCreemRedirect = createServerFn({ method: "POST" })
  .inputValidator((data: { params: Record<string, string> }) => {
    if (!data || typeof data.params !== "object" || data.params === null) {
      throw new Error("params inválidos");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { verifyCreemRedirectSignature } = await import("./creem.server");
    const ok = await verifyCreemRedirectSignature(data.params);
    return {
      verified: ok,
      orderId: data.params["order_id"] ?? null,
      checkoutId: data.params["checkout_id"] ?? null,
      customerId: data.params["customer_id"] ?? null,
      productId: data.params["product_id"] ?? null,
      requestId: data.params["request_id"] ?? null,
    };
  });
