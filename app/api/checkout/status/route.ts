export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// Safe diagnostic: reports ONLY whether each Stripe secret key is present in
// the environment. Never returns the key value itself. Used to confirm that
// payment keys are configured and deployed. Safe to leave in place.
export async function GET() {
  const tcbKey = process.env.STRIPE_TCB_SECRET_KEY ?? '';
  const cashFlowKey = process.env.STRIPE_CASH_FLOW_SECRET_KEY ?? '';

  const describe = (key: string) => ({
    configured: key.length > 0,
    // Prefix only — tells us live vs test vs restricted, never the secret.
    keyPrefix: key ? key.slice(0, 8) : null,
    length: key.length,
  });

  return NextResponse.json({
    tcb: describe(tcbKey),
    cashFlow: describe(cashFlowKey),
    nextauthUrlSet: Boolean(process.env.NEXTAUTH_URL),
  });
}
