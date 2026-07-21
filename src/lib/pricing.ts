// Fuente única de verdad del precio y del descuento por tiempo limitado.
// Cambia FULL_PRICE_USD / PROMO_PRICE_USD / PROMO_END_ISO aquí y se actualiza
// en toda la landing y en el checkout.

export const FULL_PRICE_USD = 20;
export const PROMO_PRICE_USD = 10;

// Fecha de fin de la promo (inclusive hasta las 23:59:59 UTC de ese día).
export const PROMO_END_ISO = "2026-07-31T23:59:59Z";

export function isPromoActive(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(PROMO_END_ISO).getTime();
}

export function currentPriceUsd(now: Date = new Date()): number {
  return isPromoActive(now) ? PROMO_PRICE_USD : FULL_PRICE_USD;
}

export function discountPercent(): number {
  return Math.round((1 - PROMO_PRICE_USD / FULL_PRICE_USD) * 100);
}
