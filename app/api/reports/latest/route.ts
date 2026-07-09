export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const report = await prisma.fishingReport.findFirst({
      where: { published: true },
      orderBy: { date: 'desc' },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Latest report error:', error);
    return NextResponse.json(null, { status: 200 });
  }
}
