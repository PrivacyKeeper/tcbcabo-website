import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Received | Striped World Charters',
  description: 'Your payment was received. Your booking is being confirmed.',
};

export default function BookingSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20 min-h-[70vh] flex items-center">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Payment Received
          </h1>
          <p className="text-muted-foreground mb-3">
            Thank you! We&apos;ve received your payment and will confirm your
            booking by email shortly.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            If you paid a 50% deposit, the remaining balance is due no later than
            30 days before your date. We&apos;ll send a reminder.
          </p>
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
