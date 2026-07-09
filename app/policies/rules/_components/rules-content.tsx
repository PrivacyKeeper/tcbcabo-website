'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Anchor, Sun, Ban, Users, Package } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Safety First',
    items: [
      `The captain's decisions regarding safety, navigation, fishing locations, and weather conditions are final and non-negotiable.`,
      'All passengers must listen to and follow crew instructions at all times, especially during fishing activities and vessel movement.',
      'Life jackets are available on board and must be worn when directed by the crew.',
      'Children under 12 must be accompanied by a responsible adult at all times.',
      `Passengers who are visibly intoxicated or behaving in a manner that endangers themselves or others may be returned to port at the captain's discretion. No refund will be issued.`,
    ],
  },
  {
    icon: Anchor,
    title: 'Fishing Rules',
    items: [
      'All fishing aboard Striped World Charters complies with Mexican federal fishing regulations.',
      'A valid Mexican fishing license is required for every angler and is NOT included in the charter price. Anglers are responsible for obtaining their own license — we are happy to help you arrange one.',
      'Catch-and-release is practiced for all billfish (marlin, sailfish) unless otherwise directed.',
      'We will fillet and vacuum seal up to 200 lbs of your catch for you to take home.',
      'Fighting chair use is available upon request for big game targeting.',
      'The crew will handle all bait, tackle, and equipment. Please ask before handling gear independently.',
    ],
  },
  {
    icon: Sun,
    title: 'What to Bring',
    items: [
      'Sunscreen (reef-safe preferred), sunglasses, and a hat — the Cabo sun is intense.',
      'Non-marking, rubber-soled shoes (no black soles, no heels, no hard-soled shoes).',
      'Motion sickness medication if you are prone to seasickness (take 30–60 minutes before departure).',
      'A light jacket or windbreaker for early morning departures.',
      `A camera — we'll make sure you have moments worth capturing.`,
      'A valid passport or government-issued ID.',
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Items & Behavior',
    items: [
      'No illegal drugs or substances. Violation will result in immediate return to port and potential involvement of local authorities.',
      'No glass containers of any kind on board.',
      'No black-soled shoes or shoes that may mark the deck.',
      'No spearfishing equipment.',
      'No abusive, threatening, or disrespectful behavior toward crew or other passengers.',
    ],
  },
  {
    icon: Users,
    title: 'Guest Capacity & Additional Guests',
    items: [
      'Standard fishing charters accommodate up to 6 guests.',
      'Sunset cruises accommodate up to 6 guests.',
      'Bachelor/bachelorette parties accommodate up to 6 guests. Larger groups may be accommodated only by prior arrangement with the captain.',
      'Exceeding the stated guest capacity for your charter type is not permitted for safety and comfort reasons.',
    ],
  },
  {
    icon: Package,
    title: 'Food, Beverages & Personal Items',
    items: [
      'All charters include complimentary food and beverages (varies by package — see charter descriptions).',
      'Open bar is included on all charters. Please drink responsibly.',
      'Special dietary needs or food allergies should be communicated at least 48 hours before departure.',
      'Striped World Charters is not responsible for lost, stolen, or damaged personal items brought aboard.',
    ],
  },
];

export function RulesContent() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Charter <span className="text-gold-gradient">Rules & Safety</span>
        </h1>
        <p className="text-muted-foreground mb-2">Striped World Charters — Cabo San Lucas, Mexico</p>
        <p className="text-muted-foreground text-sm mb-10">
          Your safety and enjoyment are our priorities. Please review these guidelines before your charter.
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
            Questions? Contact us at{' '}
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
