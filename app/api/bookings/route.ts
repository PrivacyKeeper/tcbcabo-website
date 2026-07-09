export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bookings = await prisma.booking.findMany({
      orderBy: { charterDate: 'asc' },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { charterType, charterDuration, charterDate, guestName, guestEmail, guestPhone, guestCount, totalPrice, upgrades, notes } = data;

    if (!charterType || !charterDate || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Guard: reject if the requested date is already locked (confirmed booking or blackout)
    const reqDate = new Date(charterDate);
    const dayStart = new Date(Date.UTC(reqDate.getUTCFullYear(), reqDate.getUTCMonth(), reqDate.getUTCDate()));
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const conflict = await prisma.blockedDate.findFirst({
      where: { date: { gte: dayStart, lt: dayEnd } },
    });
    if (conflict) {
      return NextResponse.json(
        { error: 'Sorry, that date is no longer available. Please choose another day.' },
        { status: 409 }
      );
    }

    const daysUntil = (new Date(charterDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const payInFull = daysUntil < 30;
    const depositAmount = payInFull ? (totalPrice ?? 0) : Math.round((totalPrice ?? 0) * 0.5 * 100) / 100;

    const booking = await prisma.booking.create({
      data: {
        charterType,
        charterDuration: charterDuration ?? null,
        charterDate: new Date(charterDate),
        guestName,
        guestEmail,
        guestPhone,
        guestCount: guestCount ?? 1,
        totalPrice: totalPrice ?? 0,
        depositAmount,
        depositPaid: false,
        balancePaid: false,
        upgrades: upgrades ?? null,
        notes: notes ?? null,
        status: 'pending',
      },
    });

    // Send notification email
    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = 'Striped World Charters';
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #f0e6d2; padding: 30px; border-radius: 8px;">
          <h2 style="color: #c9a96e; border-bottom: 2px solid #c9a96e; padding-bottom: 10px;">New Charter Booking Request</h2>
          <div style="background: #111d33; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #c9a96e;">Charter:</strong> ${charterType} ${charterDuration ? `(${charterDuration})` : ''}</p>
            <p><strong style="color: #c9a96e;">Date:</strong> ${new Date(charterDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #c9a96e;">Guest:</strong> ${guestName}</p>
            <p><strong style="color: #c9a96e;">Email:</strong> ${guestEmail}</p>
            <p><strong style="color: #c9a96e;">Phone:</strong> ${guestPhone}</p>
            <p><strong style="color: #c9a96e;">Guests:</strong> ${guestCount ?? 1}</p>
            <p><strong style="color: #c9a96e;">Total:</strong> $${(totalPrice ?? 0).toLocaleString()}</p>
            <p><strong style="color: #c9a96e;">${payInFull ? 'Full Payment Due' : 'Deposit Due (50%)'}:</strong> $${depositAmount.toLocaleString()}</p>
            ${upgrades ? `<p><strong style="color: #c9a96e;">Upgrades:</strong> ${upgrades}</p>` : ''}
            ${notes ? `<p><strong style="color: #c9a96e;">Notes:</strong> ${notes}</p>` : ''}
          </div>
          <p style="color: #8899aa; font-size: 12px;">Deposit must be collected to confirm this date.</p>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_BOOKING_CONFIRMATION,
          subject: `New Booking: ${charterType} - ${guestName} - ${new Date(charterDate).toLocaleDateString()}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'mf90277@gmail.com',
          reply_to: guestEmail,
          sender_email: appUrl ? `noreply@${new URL(appUrl).hostname}` : 'noreply@stripedworldcharters.com',
          sender_alias: appName,
        }),
      });
    } catch (emailError: any) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
