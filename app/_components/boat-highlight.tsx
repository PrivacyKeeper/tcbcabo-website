'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ship, Wifi, Radar, Navigation, Bath, Armchair, Award, Music, ArrowRight } from 'lucide-react';

const AMENITY_ICONS: Record<string, any> = {
  Radar, Navigation, Ship, Bath, Wifi, Armchair, Award, Music,
};

const AMENITIES = [
  { name: 'Fish Finder', icon: 'Radar' },
  { name: 'GPS Navigation', icon: 'Navigation' },
  { name: 'Flybridge', icon: 'Ship' },
  { name: 'Starlink Internet', icon: 'Wifi' },
  { name: 'Fighting Chair', icon: 'Armchair' },
  { name: 'Premium Equipment', icon: 'Award' },
];

export function BoatHighlight() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <Image
                src="/images/gallery/boat-marina.jpg"
                alt="TCB 58-foot Viking sportfisher docked at Cabo San Lucas marina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-muted">
              <Image
                src="/images/reel-branded.jpg"
                alt="Striped World Charters branded fishing reel - premium tournament equipment"
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
            <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">The Vessel</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              58&apos; Viking <span className="text-gold-gradient">Sportfisher</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Built for serious offshore pursuit, TCB is a tournament-proven 58-foot Viking
              outfitted with the finest equipment, electronics, and amenities. Whether chasing
              a grander marlin or hosting a sunset celebration, she delivers an unmatched
              experience on the Sea of Cortez.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {AMENITIES?.map((a: any) => {
                const Icon = AMENITY_ICONS?.[a?.icon ?? ''] ?? Ship;
                return (
                  <div key={a?.name} className="flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{a?.name}</span>
                  </div>
                );
              })}
            </div>
            <Link href="/the-boat">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Explore The Boat
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
