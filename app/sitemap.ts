export const dynamic = "force-dynamic";

import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SPECIES_DATA } from '@/lib/charter-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const siteUrl = host.startsWith('http') ? host : `https://${host}`;

  const staticPages = [
    { url: `${siteUrl}/`, priority: 1.0 },
    { url: `${siteUrl}/charters`, priority: 0.9 },
    { url: `${siteUrl}/book`, priority: 0.9 },
    { url: `${siteUrl}/species`, priority: 0.8 },
    { url: `${siteUrl}/gallery`, priority: 0.7 },
    { url: `${siteUrl}/the-boat`, priority: 0.7 },
    { url: `${siteUrl}/contact`, priority: 0.6 },
  ];

  const speciesPages = Object.keys(SPECIES_DATA ?? {}).map((slug: string) => ({
    url: `${siteUrl}/species/${slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...speciesPages].map((p: any) => ({
    url: p?.url ?? siteUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p?.priority ?? 0.5,
  }));
}
