import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { GalleryContent } from './_components/gallery-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery | Striped World Charters - Luxury Charter Fishing',
  description: 'Browse photos from Striped World Charters: tournament wins, incredible catches, luxury dining, and the 58\' Viking in Cabo San Lucas.',
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <GalleryContent />
      </main>
      <SiteFooter />
    </>
  );
}
