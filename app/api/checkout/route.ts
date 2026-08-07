export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  getStripe,
  accountForBoatSlug,
  toStripeCents,
  onlineCardPrice,
} from '@/lib/stripe';

const VILLA_NIGHTLY_RATE = 3000; // Villa Amore: $3,000/night (cash price)
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Creates a Stripe Checkout Session for either a boat booking or a villa booking.
// Body: { bookingId } for boats, or { villaBookingId } for Villa Amore.
//
// Payment model (compliant cash-discount, NOT a surcharge): the guest pays the
// full ONLINE card price now. That price already includes card-processing cost
// (grossed up so we net the listed cash price). There is no deposit and no
// separate fee line item. Paying cash at the boat is the discounted price.
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
      const cashTotal = nights * VILLA_NIGHTLY_RATE; // discounted cash price

      // Full online card price (nets the cash price after Stripe fees).
      amountDueNow = cashTotal;
      const onlineTotal = onlineCardPrice(cashTotal);

      account = 'tcb'; // Villa shares the TCB account
      customerEmail = villa.guestEmail;
      productName = `Villa Amore — ${nights} night${nights > 1 ? 's' : ''}`;
      description = `Villa Amore — ${nights} night${nights > 1 ? 's' : ''} at $${VILLA_NIGHTLY_RATE.toLocaleString()}/night. Online card price $${onlineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}. Cash price at check-in: $${cashTotal.toLocaleString()}.`;
      metadata = {
        villaBookingId: villa.id,
        guestName: villa.guestName,
        nights: String(nights),
        cashPrice: String(cashTotal),
        onlinePrice: String(onlineTotal),
        paymentType: 'full',
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
      // Charge the full charter price online (no deposit). totalPrice is the
      // listed cash price; we gross it up so we net it after Stripe fees.
      const cashPrice = booking.totalPrice;
      amountDueNow = cashPrice;
      const onlineTotal = onlineCardPrice(cashPrice);
      const boatName = booking.boat?.name ?? 'Striped World Charters';

      customerEmail = booking.guestEmail;
      productName = `${boatName} — ${booking.charterType}${
        booking.charterDuration ? ` (${booking.charterDuration})` : ''
      }`;
      description = `Online card price $${onlineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}. Cash price at the boat: $${cashPrice.toLocaleString()}.`;
      metadata = {
        bookingId: booking.id,
        boat: booking.boat?.slug ?? '',
        guestName: booking.guestName,
        charterDate: booking.charterDate.toISOString(),
        cashPrice: String(cashPrice),
        onlinePrice: String(onlineTotal),
        paymentType: 'full',
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
      // Card only — no ACH / bank-debit options.
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: toStripeCents(amountDueNow),
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
