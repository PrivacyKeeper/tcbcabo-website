export const dynamic = "force-dynamic";

import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PrivacyContent } from './_components/privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy | Striped World Charters',
  description: 'Read the privacy policy for Striped World Charters. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <PrivacyContent />
      </main>
      <SiteFooter />
    </>
  );
}
