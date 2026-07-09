import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSection } from './_components/hero-section';
import { CharterPreview } from './_components/charter-preview';
import { LatestReport } from './_components/latest-report';
import { SpeciesPreview } from './_components/species-preview';
import { GalleryPreview } from './_components/gallery-preview';
import { BoatHighlight } from './_components/boat-highlight';
import { BrandValues } from './_components/brand-values';
import { CTASection } from './_components/cta-section';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <BrandValues />
        <CharterPreview />
        <LatestReport />
        <BoatHighlight />
        <SpeciesPreview />
        <GalleryPreview />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
