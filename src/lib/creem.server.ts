// Cliente Creem (server-only). Nunca importar desde el bundle cliente.
//
// Creem es un merchant of record para productos digitales. Cubre países donde
// Stripe no opera. Docs: https://docs.creem.io
//
// Vars de entorno:
//   CREEM_API_KEY           — clave secreta (creem_test_... o creem_live_...)
//   CREEM_PRODUCT_ID        — product_id de precio completo (20 USD)
//   CREEM_PRODUCT_ID_PROMO  — product_id de precio promo (10 USD), opcional
//   CREEM_WEBHOOK_SECRET    — secreto para verificar la firma del webhook
//   CREEM_API_BASE          — opcional, por defecto https://api.creem.io

const DEFAULT_BASE = "https://api.creem.io";

export function creemConfig() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) throw new Error("CREEM_API_KEY no está configurado");
  return {
    apiKey,
    base: process.env.CREEM_API_BASE ?? DEFAULT_BASE,
  };
}

type CreateCheckoutInput = {
  productId: string;
  requestId: string;
  successUrl: string;
  metadata?: Record<string, string>;
};

export type CreemCheckout = {
  id: string;
  checkout_url: string;
  status?: string;
};

export async function createCreemCheckout(
  input: CreateCheckoutInput,
): Promise<CreemCheckout> {
  const { apiKey, base } = creemConfig();

  const res = await fetch(`${base}/v1/checkouts`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      product_id: input.productId,
      request_id: input.requestId,
      success_url: input.successUrl,
      metadata: input.metadata,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[creem] createCheckout falló [${res.status}]: ${errBody}`);
    throw new Error(`Creem checkout error [${res.status}]: ${errBody}`);
  }

  return (await res.json()) as CreemCheckout;
}

// ─────────────────────────────────────────────────────────────────────────────
// Verificación de firma
// ─────────────────────────────────────────────────────────────────────────────
//
// Creem firma:
// 1) Los parámetros del redirect a success_url — usando la API key como secreto.
// 2) El body del webhook — usando CREEM_WEBHOOK_SECRET, header `creem-signature`.
//
// En ambos casos es HMAC-SHA256 → hex. Usamos SubtleCrypto (compatible con
// Cloudflare Workers). No usar `crypto.createHmac` de Node aquí.

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Firma de los parámetros del redirect (success_url).
// Creem construye la cadena como `key1=value1|key2=value2|...` con las claves
// (excepto `signature`) ordenadas alfabéticamente, y firma con la API key.
export async function verifyCreemRedirectSignature(
  params: Record<string, string>,
): Promise<boolean> {
  const { apiKey } = creemConfig();
  const signature = params["signature"];
  if (!signature) return false;

  const entries = Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v != null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b));

  const message = entries.map(([k, v]) => `${k}=${v}`).join("|");
  const expected = await hmacSha256Hex(apiKey, message);
  return timingSafeEqual(expected, signature);
}

// Firma del webhook. Header `creem-signature` = HMAC-SHA256(rawBody, secret).
export async function verifyCreemWebhookSignature(
  rawBody: string,
  header: string | null,
): Promise<boolean> {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const expected = await hmacSha256Hex(secret, rawBody);
  return timingSafeEqual(expected, header);
}
