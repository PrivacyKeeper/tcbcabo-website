export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { RefundContent } from './_components/refund-content';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Striped World Charters',
  description: 'Review the refund, cancellation, and rescheduling policies for Striped World Charters in Cabo San Lucas.',
};

export default function RefundPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <RefundContent />
      </main>
      <SiteFooter />
    </>
  );
}
