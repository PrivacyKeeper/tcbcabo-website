import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SpeciesGrid } from './_components/species-grid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Species Guide | Striped World Charters - Fish & Whales of Cabo San Lucas',
  description: 'Explore the incredible marine species found in Cabo San Lucas waters: Blue Marlin, Yellowfin Tuna, Dorado, Wahoo, Humpback Whales & Gray Whales.',
};

export default function SpeciesPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <SpeciesGrid />
      </main>
      <SiteFooter />
    </>
  );
}
