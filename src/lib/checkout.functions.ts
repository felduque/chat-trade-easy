import { createServerFn } from "@tanstack/react-start";

export const getCheckoutSession = createServerFn({ method: "GET" })
  .inputValidator((data: { sessionId: string }) => {
    if (!data || typeof data.sessionId !== "string" || data.sessionId.length < 8) {
      throw new Error("sessionId inválido");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { getStripe } = await import("./stripe.server");
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(data.sessionId);

    return {
      id: session.id,
      status: session.status, // 'complete' | 'expired' | 'open'
      paymentStatus: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
      email:
        session.customer_details?.email ?? session.customer_email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
    };
  });
