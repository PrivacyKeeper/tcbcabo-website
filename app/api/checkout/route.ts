export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  getStripe,
  accountForBoatSlug,
  toStripeAmountWithFee,
  CARD_FEE_RATE,
} from '@/lib/stripe';

const VILLA_NIGHTLY_RATE = 3000; // Villa Amore: $3,000 per night
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Creates a Stripe Checkout Session for either a boat booking or a villa booking.
// Body: { bookingId } for boats, or { villaBookingId } for Villa Amore.
// Charges the 50% deposit (or full payment if within 30 days) plus a flat 3% card fee.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, villaBookingId } = body ?? {};

    const appUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;

    // Shared bits used to build the checkout session below.
    let account: 'tcb' | 'cash-flow' = 'tcb';
    let customerEmail = '';
    let productName = '';
    let description = '';
    let amountDueNow = 0;
    let metadata: Record<string, string> = {};
    let successUrl = `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`;
    let cancelUrl = `${appUrl}/book?canceled=1`;

    if (villaBookingId) {
      // ---- Villa Amore ----
      const villa = await prisma.villaBooking.findUnique({
        where: { id: villaBookingId },
      });
      if (!villa) {
        return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
      }

      const nights = Math.max(
        1,
        Math.round(
          (new Date(villa.checkOutDate).getTime() -
            new Date(villa.checkInDate).getTime()) /
            MS_PER_DAY
        )
      );
      const total = nights * VILLA_NIGHTLY_RATE;

      const daysUntil =
        (new Date(villa.checkInDate).getTime() - Date.now()) / MS_PER_DAY;
      const payInFull = daysUntil < 30;
      amountDueNow = payInFull ? total : Math.round(total * 0.5 * 100) / 100;
      const balanceDue = Math.round((total - amountDueNow) * 100) / 100;

      account = 'tcb'; // Villa shares the TCB account
      customerEmail = villa.guestEmail;
      productName = `Villa Amore — ${payInFull ? 'Full Payment' : 'Deposit (50%)'}`;
      description = payInFull
        ? `Villa Amore — ${nights} night${nights > 1 ? 's' : ''} at $${VILLA_NIGHTLY_RATE.toLocaleString()}/night. Paid in full.`
        : `Villa Amore — ${nights} night${nights > 1 ? 's' : ''} at $${VILLA_NIGHTLY_RATE.toLocaleString()}/night. 50% deposit. Balance of $${balanceDue.toLocaleString()} due no later than 30 days before check-in.`;
      metadata = {
        villaBookingId: villa.id,
        guestName: villa.guestName,
        nights: String(nights),
        total: String(total),
        baseAmount: String(amountDueNow),
        cardFee: String(Math.round(amountDueNow * CARD_FEE_RATE * 100) / 100),
        paymentType: payInFull ? 'full' : 'deposit',
      };
      successUrl = `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${appUrl}/villa?canceled=1`;
    } else if (bookingId) {
      // ---- Boat charter (TCB / Cash Flow) ----
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { boat: true },
      });
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
      }

      account = accountForBoatSlug(booking.boat?.slug);
      amountDueNow = booking.depositAmount;
      const isFullPayment = booking.depositAmount >= booking.totalPrice;
      const balanceDue =
        Math.round((booking.totalPrice - booking.depositAmount) * 100) / 100;
      const boatName = booking.boat?.name ?? 'Striped World Charters';

      customerEmail = booking.guestEmail;
      productName = `${boatName} — ${isFullPayment ? 'Full Payment' : 'Deposit (50%)'}`;
      description = isFullPayment
        ? `${boatName} — ${booking.charterType} (${booking.charterDuration ?? ''}). Paid in full.`
        : `${boatName} — ${booking.charterType} (${booking.charterDuration ?? ''}). 50% deposit. Balance of $${balanceDue.toLocaleString()} due no later than 30 days before departure.`;
      metadata = {
        bookingId: booking.id,
        boat: booking.boat?.slug ?? '',
        guestName: booking.guestName,
        charterDate: booking.charterDate.toISOString(),
        baseAmount: String(amountDueNow),
        cardFee: String(Math.round(amountDueNow * CARD_FEE_RATE * 100) / 100),
        paymentType: isFullPayment ? 'full' : 'deposit',
      };
    } else {
      return NextResponse.json(
        { error: 'Missing booking reference.' },
        { status: 400 }
      );
    }

    // Get the Stripe client for the right account. If its secret key is not
    // set yet, return 503 so the form can fall back to the request-only flow.
    const stripe = getStripe(account);
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            'Online payment is not enabled yet for this booking. We will contact you with payment instructions.',
        },
        { status: 503 }
      );
    }

    if (!amountDueNow || amountDueNow <= 0) {
      return NextResponse.json(
        { error: 'Could not determine the amount due.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: toStripeAmountWithFee(amountDueNow),
            product_data: { name: productName, description },
          },
        },
      ],
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again or contact us.' },
      { status: 500 }
    );
  }
}
