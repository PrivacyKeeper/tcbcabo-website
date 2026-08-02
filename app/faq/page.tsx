export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { FaqContent } from './_components/faq-content';

export const metadata: Metadata = {
  title: 'FAQ & Know Before You Go | Striped World Charters',
  description:
    'Everything to know before your Cabo charter aboard TCB — fishing licenses, seasickness tips, what to bring, what\'s included, and our policies.',
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <FaqContent />
      </main>
      <SiteFooter />
    </>
  );
}
