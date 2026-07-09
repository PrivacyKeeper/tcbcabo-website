export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Public: list all blocked dates (booked + blackout)
// ?detailed=true returns full objects (captain-only) for management UI
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';

    if (detailed) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const rows = await prisma.blockedDate.findMany({ orderBy: { date: 'asc' } });
      return NextResponse.json(
        rows?.map((d: any) => ({
          date: d?.date?.toISOString?.(),
          reason: d?.reason ?? null,
          isBooking: !!d?.bookingId,
        })) ?? []
      );
    }

    const blockedDates = await prisma.blockedDate.findMany({ orderBy: { date: 'asc' } });
    return NextResponse.json(blockedDates?.map((d: any) => d?.date?.toISOString?.()) ?? []);
  } catch (error: any) {
    console.error('Calendar error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// Captain-only: add a blackout date
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { date, reason } = await request.json();
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    // Normalize to midnight UTC so day-level matching is consistent
    const d = new Date(date);
    const normalized = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

    const existing = await prisma.blockedDate.findUnique({ where: { date: normalized } });
    if (existing) {
      return NextResponse.json({ error: 'That date is already blocked' }, { status: 409 });
    }

    const blocked = await prisma.blockedDate.create({
      data: { date: normalized, reason: reason || 'Blackout (captain)' },
    });
    return NextResponse.json(blocked);
  } catch (error: any) {
    console.error('Add blackout error:', error);
    return NextResponse.json({ error: 'Failed to add blackout date' }, { status: 500 });
  }
}

// Captain-only: remove a blackout date (only manual blackouts, not booking locks)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { date } = await request.json();
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    const d = new Date(date);
    const normalized = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

    const existing = await prisma.blockedDate.findUnique({ where: { date: normalized } });
    if (existing?.bookingId) {
      return NextResponse.json({ error: 'This date is locked by a confirmed booking and cannot be removed here.' }, { status: 409 });
    }
    await prisma.blockedDate.deleteMany({ where: { date: normalized, bookingId: null } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Remove blackout error:', error);
    return NextResponse.json({ error: 'Failed to remove blackout date' }, { status: 500 });
  }
}
