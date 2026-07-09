import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SpeciesDetail } from './_components/species-detail';
import { SPECIES_DATA } from '@/lib/charter-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return Object.keys(SPECIES_DATA ?? {}).map((slug: string) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const species = SPECIES_DATA?.[params?.slug ?? ''];
  if (!species) return { title: 'Species Not Found' };
  return {
    title: `${species?.name} | Striped World Charters Species Guide`,
    description: `Learn about ${species?.name} (${species?.scientific}) in Cabo San Lucas waters. Season: ${species?.season}. ${species?.seoKeywords}`,
  };
}

export default function SpeciesDetailPage({ params }: { params: { slug: string } }) {
  const species = SPECIES_DATA?.[params?.slug ?? ''];
  if (!species) notFound();

  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <SpeciesDetail species={species} />
      </main>
      <SiteFooter />
    </>
  );
}
