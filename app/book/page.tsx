import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BookingExperience } from './_components/booking-experience';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Charter | Striped World Charters - Reserve Your Fishing Charter',
  description: 'Reserve your luxury charter fishing trip in Cabo San Lucas. Choose dates, select packages, and book your adventure aboard TCB.',
};

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <BookingExperience />
      </main>
      <SiteFooter />
    </>
  );
}
