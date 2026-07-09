export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { RulesContent } from './_components/rules-content';

export const metadata: Metadata = {
  title: 'Charter Rules & Safety | Striped World Charters',
  description: 'Review the charter rules, safety guidelines, and what to bring for your fishing charter with Striped World Charters in Cabo San Lucas.',
};

export default function RulesPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <RulesContent />
      </main>
      <SiteFooter />
    </>
  );
}
