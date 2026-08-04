export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { getStripe, WEBHOOK_SECRETS, type StripeAccount } from '@/lib/stripe';

// Stripe posts payment events here. When a Checkout Session completes we:
//   1. mark the booking paid + confirmed
//   2. block the charter date on the calendar (boat bookings)
// so the captain no longer has to confirm paid bookings by hand.
//
// Each Stripe account (TCB / Cash Flow) signs with its own webhook secret, so
// we try each configured secret until one verifies the signature.

const ACCOUNTS: StripeAccount[] = ['tcb', 'cash-flow'];

function verifyEvent(
  payload: string,
  signature: string
): { event: Stripe.Event; account: StripeAccount } | null {
  for (const account of ACCOUNTS) {
    const secret = WEBHOOK_SECRETS[account];
    const stripe = getStripe(account);
    if (!secret || !stripe) continue;
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      return { event, account };
    } catch {
      // Signature didn't match this account's secret — try the next one.
    }
  }
  return null;
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  // Raw body is required for signature verification.
  const payload = await request.text();

  const verified = verifyEvent(payload, signature);
  if (!verified) {
    console.error('Stripe webhook signature verification failed.');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const { event } = verified;

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};

      // Only act on paid sessions.
      if (session.payment_status && session.payment_status !== 'paid') {
        return NextResponse.json({ received: true, note: 'not paid yet' });
      }

      if (metadata.bookingId) {
        await handleBoatBooking(metadata);
      } else if (metadata.villaBookingId) {
        await handleVillaBooking(metadata);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Stripe webhook handler error:', error);
    // Return 500 so Stripe retries later rather than dropping the event.
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }
}

// Marks a boat booking paid + confirmed and blocks its charter date.
async function handleBoatBooking(metadata: Record<string, string>) {
  const bookingId = metadata.bookingId;
  const isFull = metadata.paymentType === 'full';

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    console.error(`Webhook: booking ${bookingId} not found.`);
    return;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      depositPaid: true,
      // A full payment also clears the balance.
      balancePaid: isFull ? true : booking.balancePaid,
      status: 'confirmed',
    },
  });

  // Block the charter date so nobody else can book it. Use the exact date
  // stored on the booking (UTC midnight) to match the calendar. upsert avoids
  // a unique-constraint error if the date is already blocked.
  if (booking.boatId) {
    const date = new Date(
      Date.UTC(
        booking.charterDate.getUTCFullYear(),
        booking.charterDate.getUTCMonth(),
        booking.charterDate.getUTCDate()
      )
    );
    await prisma.blockedDate.upsert({
      where: { boatId_date: { boatId: booking.boatId, date } },
      update: { bookingId: booking.id, reason: 'Booked (paid)' },
      create: {
        boatId: booking.boatId,
        date,
        bookingId: booking.id,
        reason: 'Booked (paid)',
      },
    });
  }
}

// Marks a villa booking confirmed once payment is received.
async function handleVillaBooking(metadata: Record<string, string>) {
  const villaBookingId = metadata.villaBookingId;
  const villa = await prisma.villaBooking.findUnique({
    where: { id: villaBookingId },
  });
  if (!villa) {
    console.error(`Webhook: villa booking ${villaBookingId} not found.`);
    return;
  }
  await prisma.villaBooking.update({
    where: { id: villaBookingId },
    data: { status: 'confirmed' },
  });
}
