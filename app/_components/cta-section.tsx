'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Phone } from 'lucide-react';

export function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/boat-night-leds.jpg"
          alt="TCB at night with blue LED lighting"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ready for the <span className="text-gold-gradient">Catch of a Lifetime</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Reserve your date with Striped World Charters. A 50% deposit secures your charter (or pay in
            full if your trip is within 30 days) — balance due 30 days before departure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/book">
              <Button size="lg" className="min-w-[200px] text-base">
                <CalendarDays className="w-5 h-5 mr-2" />
                Book Now
              </Button>
            </Link>
            <a href="tel:+526241225441">
              <Button variant="outline" size="lg" className="min-w-[200px] text-base border-primary/30 text-primary hover:bg-primary/10">
                <Phone className="w-5 h-5 mr-2" />
                Call +52 624 122 5441
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
