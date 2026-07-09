import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ContactForm } from './_components/contact-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Striped World Charters - Get in Touch',
  description: 'Contact Striped World Charters for charter inquiries, group bookings, or questions about fishing in Cabo San Lucas. Call +52 624 122 5441.',
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
