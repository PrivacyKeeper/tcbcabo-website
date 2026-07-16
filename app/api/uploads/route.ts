export const dynamic = 'force-dynamic';

import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  CHARTER_MEDIA_BUCKET,
  supabaseAdmin,
} from '@/lib/supabase-admin';

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !['captain', 'admin'].includes(session.user.role.toLowerCase())
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const boatId = formData.get('boatId');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'An image file is required' },
        { status: 400 }
      );
    }

    if (typeof boatId !== 'string' || !boatId.trim()) {
      return NextResponse.json(
        { error: 'A boat must be selected' },
        { status: 400 }
      );
    }

    const boat = await prisma.boat.findFirst({
      where: {
        id: boatId.trim(),
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

    const extension = ALLOWED_TYPES.get(file.type);

    if (!extension) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 415 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image must be no larger than 15 MB' },
        { status: 413 }
      );
    }

    const storageKey =
      `fishing-reports/${boat.id}/drafts/${session.user.id}/` +
      `${randomUUID()}.${extension}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(CHARTER_MEDIA_BUCKET)
      .upload(storageKey, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Fishing-report image upload error:', uploadError);
      return NextResponse.json(
        { error: 'Image upload failed' },
        { status: 500 }
      );
    }

    const { data: signedData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from(CHARTER_MEDIA_BUCKET)
        .createSignedUrl(storageKey, 3600);

    if (signedUrlError) {
      await supabaseAdmin.storage
        .from(CHARTER_MEDIA_BUCKET)
        .remove([storageKey]);

      console.error('Signed URL creation error:', signedUrlError);
      return NextResponse.json(
        { error: 'Uploaded image could not be accessed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        storageKey,
        previewUrl: signedData.signedUrl,
        previewExpiresIn: 3600,
        originalName: file.name,
        boat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Image upload failed' },
      { status: 500 }
    );
  }
}
