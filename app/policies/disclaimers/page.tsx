export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { DisclaimersContent } from './_components/disclaimers-content';

export const metadata: Metadata = {
  title: 'Disclaimers & Liability | Striped World Charters',
  description: 'Review the legal disclaimers, liability limitations, and terms of service for Striped World Charters in Cabo San Lucas.',
};

export default function DisclaimersPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <DisclaimersContent />
      </main>
      <SiteFooter />
    </>
  );
}
