export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data,
    });

    // If deposit was just marked as paid, block the calendar date
    if (data.depositPaid === true) {
      await prisma.blockedDate.upsert({
        where: { date: booking.charterDate },
        update: { bookingId: booking.id, reason: 'Booking confirmed' },
        create: { date: booking.charterDate, bookingId: booking.id, reason: 'Booking confirmed' },
      });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Remove blocked date if exists
    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (booking) {
      await prisma.blockedDate.deleteMany({ where: { bookingId: booking.id } });
    }
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
