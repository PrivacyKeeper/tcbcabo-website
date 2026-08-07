import Stripe from 'stripe';

// Two separate Stripe accounts:
//   - 'tcb'       → TCB (58' Viking) AND Villa Amore (they share one account)
//   - 'cash-flow' → Cash Flow (26' Angler), separate Mexican account (added later)
export type StripeAccount = 'tcb' | 'cash-flow';

const SECRET_KEYS: Record<StripeAccount, string | undefined> = {
  tcb: process.env.STRIPE_TCB_SECRET_KEY,
  'cash-flow': process.env.STRIPE_CASH_FLOW_SECRET_KEY,
};

// Webhook signing secrets (one per Stripe account). Each account posts events
// to the same /api/webhooks/stripe endpoint but signs with its own secret.
export const WEBHOOK_SECRETS: Record<StripeAccount, string | undefined> = {
  tcb: process.env.STRIPE_TCB_WEBHOOK_SECRET,
  'cash-flow': process.env.STRIPE_CASH_FLOW_WEBHOOK_SECRET,
};

// Returns a Stripe client for the given account, or null if that account's
// secret key is not configured yet (lets the site run before keys are added).
export function getStripe(account: StripeAccount): Stripe | null {
  const key = SECRET_KEYS[account];
  return key ? new Stripe(key) : null;
}

// Maps a boat slug to the correct Stripe account.
// Cash Flow has its own account; everything else (TCB, Villa) uses 'tcb'.
export function accountForBoatSlug(
  slug: string | null | undefined
): StripeAccount {
  return slug === 'cash-flow-26-angler' ? 'cash-flow' : 'tcb';
}

// Online (card) pricing lives in the client-safe module lib/pricing.ts.
// Re-exported here so existing server imports from '@/lib/stripe' keep working.
export {
  STRIPE_PERCENT,
  STRIPE_FIXED,
  onlineCardPrice,
  toStripeCents,
  formatUsd,
} from './pricing';
