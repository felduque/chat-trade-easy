import Stripe from "stripe";

// Server-only Stripe client factory. Never import this from client code.
// The Cloudflare Workers runtime provides fetch; the SDK uses it automatically.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no está configurado");
  }
  return new Stripe(key, {
    apiVersion: "2026-06-24.dahlia",
    // Workers no soporta el HTTP client nativo de Node; forzamos fetch.
    httpClient: Stripe.createFetchHttpClient(),
  });
}
