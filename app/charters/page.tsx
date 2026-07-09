import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ChartersContent } from './_components/charters-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charter Packages | Striped World Charters - Fishing, Whale Watching & Sunset Cruises',
  description: 'Explore Striped World Charters packages: sportfishing from $4,250, whale watching, sunset cruises & bachelor parties aboard a 58\' Viking in Cabo San Lucas.',
};

export default function ChartersPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <ChartersContent />
      </main>
      <SiteFooter />
    </>
  );
}
