export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  CHARTER_MEDIA_BUCKET,
  supabaseAdmin,
} from '@/lib/supabase-admin';

const MAX_IMAGES = 10;

export async function GET() {
  try {
    const reports = await prisma.fishingReport.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        author: {
          select: { name: true },
        },
        boat: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    const reportsWithSignedImages = await Promise.all(
      reports.map(async (report) => {
        const images = await Promise.all(
          report.images.map(async (image) => {
            const { data, error } = await supabaseAdmin.storage
              .from(CHARTER_MEDIA_BUCKET)
              .createSignedUrl(image.storageKey, 3600);

            return {
              id: image.id,
              storageKey: image.storageKey,
              altText: image.altText,
              displayOrder: image.displayOrder,
              url: error ? null : data.signedUrl,
            };
          })
        );

        return {
          ...report,
          images,
        };
      })
    );

    return NextResponse.json(reportsWithSignedImages);
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !['captain', 'admin'].includes(session.user.role.toLowerCase())
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const boatId = typeof data.boatId === 'string' ? data.boatId.trim() : '';
    const storageKeys: string[] = Array.isArray(data.storageKeys)
      ? [...new Set(
          (data.storageKeys as unknown[]).filter(
            (key: unknown): key is string =>
              typeof key === 'string' && key.trim().length > 0
          )
        )]
      : [];

    if (!title) {
      return NextResponse.json(
        { error: 'A report title is required' },
        { status: 400 }
      );
    }

    if (!boatId) {
      return NextResponse.json(
        { error: 'A boat must be selected' },
        { status: 400 }
      );
    }

    if (storageKeys.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: 'A maximum of 10 photos is allowed per report' },
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
      },
    });

    if (!boat) {
      return NextResponse.json(
        { error: 'Selected boat was not found or is inactive' },
        { status: 400 }
      );
    }

    const requiredPrefix =
      `fishing-reports/${boat.id}/drafts/${session.user.id}/`;

    if (storageKeys.some((key) => !key.startsWith(requiredPrefix))) {
      return NextResponse.json(
        { error: 'One or more uploaded photos are invalid' },
        { status: 400 }
      );
    }

    const report = await prisma.fishingReport.create({
      data: {
        boatId: boat.id,
        title,
        date: data.date ? new Date(data.date) : new Date(),
        conditions:
          typeof data.conditions === 'string' && data.conditions.trim()
            ? data.conditions.trim()
            : null,
        waterTemp:
          typeof data.waterTemp === 'string' && data.waterTemp.trim()
            ? data.waterTemp.trim()
            : null,
        species: Array.isArray(data.species)
          ? data.species.filter(
              (item: unknown): item is string => typeof item === 'string'
            )
          : [],
        catches:
          typeof data.catches === 'string' && data.catches.trim()
            ? data.catches.trim()
            : null,
        highlights:
          typeof data.highlights === 'string' && data.highlights.trim()
            ? data.highlights.trim()
            : null,
        hotspots:
          typeof data.hotspots === 'string' && data.hotspots.trim()
            ? data.hotspots.trim()
            : null,
        published: true,
        authorId: session.user.id,
        images: {
          create: storageKeys.map((storageKey, index) => ({
            storageKey,
            url: storageKey,
            altText: `${title} photo ${index + 1}`,
            displayOrder: index,
          })),
        },
      },
      include: {
        boat: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}