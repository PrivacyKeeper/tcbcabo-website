import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BoatContent } from './_components/boat-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Boats | Striped World Charters - TCB 58\' Viking & Cash Flow 26\' Angler',
  description: 'Meet our fleet: TCB, a tournament-proven 58\' Viking sportfisher in Cabo, and Cash Flow, a nimble 26\' Angler center console based in La Paz for intimate fishing adventures.',
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
