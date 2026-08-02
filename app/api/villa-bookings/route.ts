export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
      guestPhone,
      guestCount,
      notes,
    } = data;

    if (
      !checkInDate ||
      !checkOutDate ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const guests = Number(guestCount);

    if (
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime()) ||
      checkOut <= checkIn
    ) {
      return NextResponse.json(
        { error: 'Check-out must be after check-in.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guests) || guests < 1) {
      return NextResponse.json(
        { error: 'Please enter a valid number of guests.' },
        { status: 400 }
      );
    }

    const booking = await prisma.villaBooking.create({
      data: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestName,
        guestEmail,
        guestPhone,
        guestCount: guests,
        notes: notes || null,
        status: 'pending',
      },
    });

    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const recipient =
        process.env.VILLA_BOOKING_EMAIL || 'info@stripedworldcharters.com';

      const htmlBody = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a1628;color:#f0e6d2;padding:30px;border-radius:8px">
          <h2 style="color:#c9a96e;border-bottom:2px solid #c9a96e;padding-bottom:10px">New Villa Amore Booking Request</h2>
          <div style="background:#111d33;padding:20px;border-radius:8px;margin:20px 0">
            <p><strong style="color:#c9a96e">Check-in:</strong> ${escapeHtml(checkIn.toLocaleDateString('en-US'))}</p>
            <p><strong style="color:#c9a96e">Check-out:</strong> ${escapeHtml(checkOut.toLocaleDateString('en-US'))}</p>
            <p><strong style="color:#c9a96e">Guests:</strong> ${guests}</p>
            <p><strong style="color:#c9a96e">Guest:</strong> ${escapeHtml(guestName)}</p>
            <p><strong style="color:#c9a96e">Email:</strong> ${escapeHtml(guestEmail)}</p>
            <p><strong style="color:#c9a96e">Phone:</strong> ${escapeHtml(guestPhone)}</p>
            ${notes ? `<p><strong style="color:#c9a96e">Notes:</strong> ${escapeHtml(notes)}</p>` : ''}
          </div>
          <p style="color:#8899aa;font-size:12px">This is a booking request and is not yet confirmed.</p>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_BOOKING_CONFIRMATION,
          subject: `New Villa Amore Request - ${guestName}`,
          body: htmlBody,
          is_html: true,
          recipient_email: recipient,
          reply_to: guestEmail,
          sender_email: appUrl
            ? `noreply@${new URL(appUrl).hostname}`
            : 'noreply@stripedworldcharters.com',
          sender_alias: 'Villa Amore',
        }),
      });
    } catch (emailError: unknown) {
      console.error('Villa email notification failed:', emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    console.error('Create villa booking error:', error);
    return NextResponse.json(
      { error: 'Failed to submit villa booking request.' },
      { status: 500 }
    );
  }
}
