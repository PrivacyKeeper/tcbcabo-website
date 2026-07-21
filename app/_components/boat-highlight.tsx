'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Ship,
  Wifi,
  Radar,
  Navigation,
  Armchair,
  Award,
  Music,
  ArrowRight,
  Clock,
  Users,
  Check,
} from 'lucide-react';

const AMENITY_ICONS: Record<string, any> = {
  Radar,
  Navigation,
  Ship,
  Wifi,
  Armchair,
  Award,
  Music,
};

const AMENITIES = [
  { name: 'Fish Finder', icon: 'Radar' },
  { name: 'GPS Navigation', icon: 'Navigation' },
  { name: 'Flybridge', icon: 'Ship' },
  { name: 'Starlink Internet', icon: 'Wifi' },
  { name: 'Fighting Chair', icon: 'Armchair' },
  { name: 'Premium Equipment', icon: 'Award' },
];

const CASH_FLOW_INCLUSIONS = [
  'Fishing equipment',
  'Fishing licenses',
  'Bait and terminal tackle',
  'Drinks and snacks or lunch',
  'Catch cleaning',
];

export function BoatHighlight() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <Image
                src="/images/gallery/boat-marina.jpg"
                alt="TCB 58-foot Viking sportfisher docked at Cabo San Lucas marina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
              <Image
                src="/images/reel-branded.jpg"
                alt="Striped World Charters branded fishing reel and tournament equipment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-2 font-mono text-sm uppercase tracking-[0.15em] text-primary">
              The Flagship
            </p>

            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              TCB — 58&apos; Viking{' '}
              <span className="text-gold-gradient">Sportfisher</span>
            </h2>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              Built for serious offshore pursuit, TCB is a tournament-proven
              58-foot Viking outfitted with premium equipment, electronics, and
              amenities. Whether chasing a grander marlin or hosting a sunset
              celebration, she delivers an unmatched experience on the Sea of
              Cortez.
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AMENITIES.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity.icon] ?? Ship;

                return (
                  <div
                    key={amenity.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      {amenity.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/the-boat">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 sm:w-auto"
                >
                  Explore TCB
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/book?boat=tcb-58-viking-sportfisher">
                <Button className="w-full sm:w-auto">Book TCB</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm sm:mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-[42%_58%]">
            <div className="relative min-h-[240px] md:min-h-full">
              <Image
                src="/images/cash-flow-card.png"
                alt="Cash Flow 26-foot Angler center console fishing boat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>

            <div className="p-5 sm:p-7">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-primary">
                Center Console Fishing
              </p>

              <h3 className="mb-2 font-display text-2xl font-bold tracking-tight">
                Cash Flow — 26&apos; Angler
              </h3>

              <div className="mb-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Up to 4 guests
                </span>
                <span className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-primary" />
                  Private fishing charters
                </span>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    5 Hours
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    $950
                  </p>
                </div>

                <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    8 Hours
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    $1,400
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CASH_FLOW_INCLUSIONS.map((inclusion) => (
                  <div
                    key={inclusion}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>

              <Link href="/book?boat=cash-flow-26-angler">
                <Button className="w-full sm:w-auto">
                  Book Cash Flow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
