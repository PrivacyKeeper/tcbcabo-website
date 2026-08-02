export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const PRICES: Record<string, Record<string, Record<string, number>>> = {
  'tcb-58-viking-sportfisher': {
    fishing: {
      '5 Hours': 4250,
      '8 Hours': 6800,
    },
    whaleWatching: {
      '3 Hours': 2500,
    },
    sunset: {
      'Sunset Cruise': 3200,
    },
    bachelor: {
      '4 Hours': 3500,
    },
  },
  'cash-flow-26-angler': {
    fishing: {
      '5 Hours': 950,
      '8 Hours': 1400,
    },
  },
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      include: {
        boat: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { charterDate: 'asc' },
    });

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    console.error('Get bookings error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      boatId,
      charterType,
      charterDuration,
      charterDate,
      guestName,
      guestEmail,
      guestPhone,
      guestCount,
      upgrades,
      notes,
    } = data;

    if (
      !boatId ||
      !charterType ||
      !charterDuration ||
      !charterDate ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const boat = await prisma.boat.findFirst({
      where: {
        id: boatId,
        active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        capacity: true,
      },
    });

    if (!boat) {
      return NextResponse.json(
        { error: 'The selected boat is unavailable.' },
        { status: 400 }
      );
    }

    const guests = Number(guestCount);

    const guestRules: Record<
      string,
      Record<string, { standard: number; maximum: number }>
    > = {
      'tcb-58-viking-sportfisher': {
        fishing: { standard: 6, maximum: 10 },
        whaleWatching: { standard: 8, maximum: 10 },
        sunset: { standard: 6, maximum: 10 },
        bachelor: { standard: 6, maximum: 10 },
      },
      'cash-flow-26-angler': {
        fishing: { standard: 4, maximum: 4 },
      },
    };

    const guestRule = guestRules[boat.slug]?.[charterType];

    if (!guestRule) {
      return NextResponse.json(
        {
          error: 'That charter option is not available for the selected boat.',
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > guestRule.maximum
    ) {
      return NextResponse.json(
        {
          error: `Please select between 1 and ${guestRule.maximum} guests.`,
        },
        { status: 400 }
      );
    }

    const requiresCaptainApproval = guests > guestRule.standard;

    const totalPrice =
      PRICES[boat.slug]?.[charterType]?.[charterDuration];

    if (typeof totalPrice !== 'number') {
      return NextResponse.json(
        {
          error: 'That charter option is not available for the selected boat.',
        },
        { status: 400 }
      );
    }

    const requestedDate = new Date(charterDate);

    if (Number.isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid charter date.' },
        { status: 400 }
      );
    }

    const dayStart = new Date(
      Date.UTC(
        requestedDate.getUTCFullYear(),
        requestedDate.getUTCMonth(),
        requestedDate.getUTCDate()
      )
    );

    const dayEnd = new Date(
      dayStart.getTime() + 24 * 60 * 60 * 1000
    );

    const conflict = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: dayStart,
          lt: dayEnd,
        },
        OR: [
          { boatId: boat.id },
          { boatId: null },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          error:
            'Sorry, that date is no longer available for this boat. Please choose another day.',
        },
        { status: 409 }
      );
    }

    const daysUntil =
      (requestedDate.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);

    const payInFull = daysUntil < 30;

    const depositAmount = payInFull
      ? totalPrice
      : Math.round(totalPrice * 0.5 * 100) / 100;

    const charterLabels: Record<string, string> = {
      fishing: 'Fishing Charters',
      whaleWatching: 'Whale Watching',
      sunset: 'Sunset Cruises',
      bachelor: 'Bachelor & Bachelorette',
    };

    const charterLabel = charterLabels[charterType] ?? charterType;

    const booking = await prisma.booking.create({
      data: {
        boatId: boat.id,
        charterType: charterLabel,
        charterDuration,
        charterDate: requestedDate,
        guestName,
        guestEmail,
        guestPhone,
        guestCount: guests,
        totalPrice,
        depositAmount,
        depositPaid: false,
        balancePaid: false,
        upgrades: upgrades ?? null,
        notes: notes ?? null,
        status: 'pending',
      },
    });

    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const htmlBody = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a1628;color:#f0e6d2;padding:30px;border-radius:8px">
          <h2 style="color:#c9a96e;border-bottom:2px solid #c9a96e;padding-bottom:10px">New Charter Booking Request</h2>
          <div style="background:#111d33;padding:20px;border-radius:8px;margin:20px 0">
            <p><strong style="color:#c9a96e">Boat:</strong> ${boat.name}</p>
            <p><strong style="color:#c9a96e">Charter:</strong> ${charterLabel} (${charterDuration})</p>
            <p><strong style="color:#c9a96e">Date:</strong> ${requestedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong style="color:#c9a96e">Guest:</strong> ${guestName}</p>
            <p><strong style="color:#c9a96e">Email:</strong> ${guestEmail}</p>
            <p><strong style="color:#c9a96e">Phone:</strong> ${guestPhone}</p>
            <p><strong style="color:#c9a96e">Guests:</strong> ${guests}</p>
            ${requiresCaptainApproval ? '<p style="background:#8b1e1e;color:#fff;padding:12px;border-radius:6px;font-weight:bold">ACTION REQUIRED ASAP: This party exceeds the standard listed guest count and requires captain approval before payment or confirmation.</p>' : ''}
            <p><strong style="color:#c9a96e">Total:</strong> $${totalPrice.toLocaleString()}</p>
            <p><strong style="color:#c9a96e">${payInFull ? 'Full Payment Due' : 'Deposit Due (50%)'}:</strong> $${depositAmount.toLocaleString()}</p>
            ${upgrades ? `<p><strong style="color:#c9a96e">Upgrades:</strong> ${upgrades}</p>` : ''}
            ${notes ? `<p><strong style="color:#c9a96e">Notes:</strong> ${notes}</p>` : ''}
          </div>
          <p style="color:#8899aa;font-size:12px">Payment must be collected to confirm this date.</p>
        </div>
      `;

      await fetch(
        'https://apps.abacus.ai/api/sendNotificationEmail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deployment_token: process.env.ABACUSAI_API_KEY,
            app_id: process.env.WEB_APP_ID,
            notification_id:
              process.env.NOTIF_ID_BOOKING_CONFIRMATION,
            subject: requiresCaptainApproval
              ? `ACTION REQUIRED ASAP — Large Group Request — ${boat.name} — ${guests} Guests`
              : `New Booking: ${boat.name} - ${guestName} - ${requestedDate.toLocaleDateString()}`,
            body: htmlBody,
            is_html: true,
            recipient_email: 'info@stripedworldcharters.com',
            reply_to: guestEmail,
            sender_email: appUrl
              ? `noreply@${new URL(appUrl).hostname}`
              : 'noreply@stripedworldcharters.com',
            sender_alias: 'Striped World Charters',
          }),
        }
      );
    } catch (emailError: unknown) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    console.error('Create booking error:', error);

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
