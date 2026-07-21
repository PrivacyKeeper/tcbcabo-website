export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const boats = await prisma.boat.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        capacity: true,
        imageUrl: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(boats);
  } catch (error) {
    console.error('Get boats error:', error);

    return NextResponse.json(
      { error: 'Failed to load boats' },
      { status: 500 }
    );
  }
}
