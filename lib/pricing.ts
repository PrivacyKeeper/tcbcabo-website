// Pure pricing math — safe to import in both client and server code
// (no Stripe SDK import, so it won't bloat the client bundle).
//
// COMPLIANCE: cash-discount model, NOT a surcharge. The posted ONLINE (card)
// price already includes card-processing cost; paying cash earns a discount.
// Nothing is ever itemized to the customer as a "fee" or "surcharge".
//
// Stripe's standard US card fee is 2.9% + $0.30. To NET a target cash amount we
// gross the price up so that, after Stripe's cut, we receive the cash price:
//     online = (cash + 0.30) / (1 - 0.029)
// e.g. cash $6,800  ->  online $7,003.40  (Stripe keeps $203.40, we net $6,800).
export const STRIPE_PERCENT = 0.029; // 2.9%
export const STRIPE_FIXED = 0.30; // $0.30 per transaction

// Online card price (USD, 2 decimals) that nets `cashPrice` after Stripe fees.
export function onlineCardPrice(cashPrice: number): number {
  const gross = (cashPrice + STRIPE_FIXED) / (1 - STRIPE_PERCENT);
  return Math.round(gross * 100) / 100;
}

// Same value as an integer cent amount for Stripe's `unit_amount`.
export function toStripeCents(cashPrice: number): number {
  return Math.round(onlineCardPrice(cashPrice) * 100);
}

// Formats a USD amount for display, always showing cents (e.g. $7,003.40).
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
