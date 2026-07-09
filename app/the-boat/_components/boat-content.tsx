'use client';

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
        <Link href="/book">
          <Button size="lg" className="min-w-[220px] text-base">
            <CalendarDays className="w-5 h-5 mr-2" />
            Book TCB
          </Button>
        </Link>
      </div>
    </div>
  );
}
