export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !['captain', 'admin'].includes(session.user.role.toLowerCase())
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const boats = await prisma.boat.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
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
