export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const reports = await prisma.fishingReport.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 10,
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(reports ?? []);
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const report = await prisma.fishingReport.create({
      data: {
        title: data.title || 'Fishing Report',
        date: data.date ? new Date(data.date) : new Date(),
        conditions: data.conditions ?? null,
        waterTemp: data.waterTemp ?? null,
        species: data.species ?? [],
        catches: data.catches ?? null,
        highlights: data.highlights ?? null,
        hotspots: data.hotspots ?? null,
        imageUrl: data.imageUrl ?? null,
        published: data.published ?? true,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
