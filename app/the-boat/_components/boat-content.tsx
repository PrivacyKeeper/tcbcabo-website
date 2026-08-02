'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BOAT_AMENITIES, GALLERY_IMAGES } from '@/lib/charter-data';
import { CalendarDays, Ship, Radar, Navigation, Bath, Wifi, Armchair, Award, Music, Anchor, Shield, Trophy } from 'lucide-react';

const ICON_MAP: Record<string, any> = { Radar, Navigation, Ship, Bath, Wifi, Armchair, Award, Music };

export function BoatContent() {
  const { ref: specRef, inView: specInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: amenRef, inView: amenInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Next.js App Router does not reliably scroll to a #hash when navigating
  // from another page (or from the same page). This manually scrolls to the
  // targeted section (e.g. #cash-flow) once the content has rendered, and also
  // responds to later hash changes (clicking the nav link while already here).
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Delay lets the page paint before we scroll.
    const t = setTimeout(scrollToHash, 300);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  const boatImages = (GALLERY_IMAGES ?? []).filter((i: any) => i?.category === 'boat');

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">The Vessel</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          58&apos; Viking <span className="text-gold-gradient">Sportfisher</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tournament-proven and impeccably maintained. TCB is a 58-foot Viking built for serious offshore pursuit and luxurious comfort.
        </p>
      </div>

      {/* Main boat image */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-12">
          <Image
            src="/images/gallery/boat-aerial.jpg"
            alt="TCB 58-foot Viking at sea aerial view"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </motion.div>

      {/* Specifications */}
      <section ref={specRef} className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={specInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-primary" />
            Vessel Specifications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Length', value: '58 Feet' },
              { label: 'Builder', value: 'Viking Yachts' },
              { label: 'Type', value: 'Sportfisher' },
              { label: 'Home Port', value: 'Cabo San Lucas' },
            ].map((spec: any) => (
              <div key={spec?.label} className="bg-card border border-border/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase">{spec?.label}</p>
                <p className="font-display font-semibold text-lg">{spec?.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Amenities */}
      <section ref={amenRef} className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={amenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Equipment & Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(BOAT_AMENITIES ?? []).map((a: any, i: number) => {
              const Icon = ICON_MAP?.[a?.icon ?? ''] ?? Ship;
              return (
                <motion.div
                  key={a?.name ?? i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={amenInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card border border-border/30 rounded-lg p-4 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{a?.name}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Tournament heritage */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Tournament Heritage
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TCB isn&apos;t just a charter boat — she&apos;s a proven competitor. Our crew has brought home tournament wins and consistently places in Cabo&apos;s most prestigious fishing events.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When you book TCB, you&apos;re fishing with a team that knows these waters inside and out. From the legendary Gordo Banks to the deep Pacific blue, our captain and mates deliver the expertise that makes the difference between a fish story and a trophy.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src="/images/gallery/tournament-win.jpg"
              alt="TCB crew with tournament winning check for $37,200"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Photo grid */}
      {(boatImages?.length ?? 0) > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">More Views</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {boatImages?.map?.((img: any, i: number) => (
              <div key={img?.src ?? i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={img?.src ?? ''}
                  alt={img?.alt ?? 'TCB boat photo'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            )) ?? []}
          </div>
        </section>
      )}

      <div className="text-center">
        <Link href="/book?boat=tcb">
          <Button size="lg" className="min-w-[220px] text-base">
            <CalendarDays className="w-5 h-5 mr-2" />
            Book TCB
          </Button>
        </Link>
      </div>

      {/* Cash Flow section */}
      <div id="cash-flow" className="mt-24 pt-16 border-t border-border/30 scroll-mt-24">
        <div className="text-center mb-12">
          <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">The Center Console</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Cash Flow — <span className="text-gold-gradient">26&apos; Angler</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nimble, fast, and purpose-built for serious fishing. Cash Flow is a 26-foot Angler center console designed for an intimate fishing experience off La Paz, B.C.S.
          </p>
        </div>

        {/* Cash Flow Specifications */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-primary" />
            Vessel Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Length', value: '26 Feet' },
              { label: 'Type', value: 'Center Console' },
              { label: 'Max Guests', value: '4 Anglers' },
              { label: 'Home Port', value: 'La Paz, B.C.S.' },
            ].map((spec: any) => (
              <div key={spec?.label} className="bg-card border border-border/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase">{spec?.label}</p>
                <p className="font-display font-semibold text-lg">{spec?.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-12">
          <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Included on Every Charter
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Professional captain and crew',
              'Top-shelf rods, reels & terminal tackle',
              'Live bait & lures',
              'Fishing licenses for all anglers',
              'Ice-cold drinks, snacks & lunch',
              'Catch cleaning & filleting',
            ].map((item: string) => (
              <div key={item} className="bg-card border border-border/30 rounded-lg p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pickup Location */}
        <section className="mb-12">
          <div className="bg-card border border-border/30 rounded-lg p-6">
            <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Pickup Location
            </h3>
            <p className="text-muted-foreground mb-4">
              Cash Flow departs from La Paz, Baja California Sur — approximately 2 hours north of Cabo San Lucas. La Paz offers exceptional inshore and offshore fishing in the protected Sea of Cortez.
            </p>
            <a
              href="https://maps.app.goo.gl/9CjYJLLHr81ZFMWU8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <Navigation className="w-4 h-4" />
              View pickup location on Google Maps
            </a>
          </div>
        </section>

        <div className="text-center">
          <Link href="/book?boat=cash-flow">
            <Button size="lg" className="min-w-[220px] text-base">
              <CalendarDays className="w-5 h-5 mr-2" />
              Book Cash Flow
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
