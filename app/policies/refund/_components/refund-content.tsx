'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Clock, DollarSign, CloudRain, Shield } from 'lucide-react';

const sections = [
  {
    icon: DollarSign,
    title: 'Deposit & Payment Terms',
    items: [
      'For charters booked 30 or more days in advance, a 50% deposit of the total charter cost is required to confirm your booking and block your date.',
      'The remaining 50% balance is due no later than 30 days prior to the scheduled charter date.',
      'For charters booked within 30 days of the charter date, payment in full is required at the time of booking to confirm your date.',
      'Fishing licenses are not included in the charter price and are the responsibility of each angler.',
      'Failure to pay the remaining balance within the required timeframe may result in forfeiture of your deposit and cancellation of the charter.',
      'All prices are listed and payable in US Dollars (USD).',
    ],
  },
  {
    icon: Clock,
    title: 'Cancellation Policy',
    items: [
      'Cancellations made more than 48 hours before the scheduled charter: Full refund of all payments received.',
      'Cancellations made within 48 hours of the scheduled charter: 80% refund of all payments received — OR the full amount may be held as credit toward a future charter at a mutually agreed-upon date.',
      'No-shows: No refund will be issued.',
      `The choice between an 80% refund or rescheduling credit is at the client's discretion for cancellations within 48 hours.`,
    ],
  },
  {
    icon: CloudRain,
    title: 'Weather & Safety Cancellations',
    items: [
      'If the captain determines that weather or sea conditions make the charter unsafe, the trip will be rescheduled at no additional charge.',
      `In the event of a weather cancellation by the captain, a full refund or credit toward a future charter (within 12 months) will be offered at the client's discretion.`,
      `Weather decisions are made solely at the captain's discretion and are final. Safety of all passengers and crew is our top priority.`,
      `Partial-day cancellations due to deteriorating weather: If the charter is cut short for safety, a prorated credit may be offered at the captain's discretion.`,
    ],
  },
  {
    icon: Shield,
    title: 'Rescheduling',
    items: [
      'Rescheduling requests made more than 15 days before the charter date will be accommodated subject to availability at no additional fee.',
      'Rescheduling requests made within 15 days of the charter date are subject to a 10% rescheduling fee.',
      'Rescheduling is limited to one change per booking. Additional changes will be treated as a new cancellation and rebooking.',
      'All rescheduled charters must occur within 12 months of the original booking date.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Refund Processing',
    items: [
      'Approved refunds will be processed within 10–14 business days to the original form of payment.',
      'Striped World Charters reserves the right to issue refunds as credit toward future charters in lieu of cash refunds.',
      'Any chargebacks filed without first contacting Striped World Charters directly may result in additional fees and forfeiture of future booking privileges.',
    ],
  },
];

export function RefundContent() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Refund & <span className="text-gold-gradient">Cancellation Policy</span>
        </h1>
        <p className="text-muted-foreground mb-2">Effective as of 2026 | Striped World Charters — Cabo San Lucas, Mexico</p>
        <p className="text-muted-foreground text-sm mb-10">
          We understand plans change. Please review our policies below before booking your charter.
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card border border-border/30 rounded-lg p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 p-5 bg-muted/30 rounded-lg border border-border/20 text-center">
          <p className="text-muted-foreground text-sm">
            Questions about our policies? Contact us at{' '}
            <a href="mailto:stripedworldcharters@gmail.com" className="text-primary hover:underline">
              stripedworldcharters@gmail.com
            </a>{' '}
            or call <a href="tel:+526241225441" className="text-primary hover:underline">+52 624 122 5441</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
