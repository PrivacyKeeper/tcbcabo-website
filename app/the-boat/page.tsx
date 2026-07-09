import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BoatContent } from './_components/boat-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Boat | Striped World Charters - 58\' Viking Sportfisher',
  description: 'Explore TCB, the 58\' Viking sportfisher in Cabo San Lucas. Tournament-proven with top-of-the-line equipment, Starlink, flybridge & luxury amenities.',
};

export default function TheBoatPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <BoatContent />
      </main>
      <SiteFooter />
    </>
  );
}
