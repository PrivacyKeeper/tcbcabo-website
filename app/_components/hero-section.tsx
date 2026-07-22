'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Anchor, ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative">
      {/* Logo Band - dark navy background matching the logo's baked-in bg */}
      <div className="relative bg-[#0a1628] flex items-center justify-center py-10 sm:py-14 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-[700px] px-6 sm:px-8"
        >
          <div className="relative w-full aspect-[4.4/1]">
            <Image
              src="/images/logo-main.jpg"
              alt="Striped World Charters - Luxury Sportfishing in Cabo San Lucas"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 90vw, 700px"
            />
          </div>
        </motion.div>
      </div>

      {/* Boat Image Band - cinematic aerial shot */}
      <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[350px] max-h-[650px] overflow-hidden">
        <Image
          src="/images/gallery/boat-aerial.jpg"
          alt="TCB 58-foot Viking sportfisher cruising the waters of Cabo San Lucas"
          fill
          className="object-cover object-[center_65%] sm:object-center"
          priority
          sizes="100vw"
        />
        {/* Subtle gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-[#0a1628]/30" />

        {/* CTA Content overlaid on the boat image */}
        <div className="absolute inset-0 hidden sm:flex items-end justify-center sm:pb-14 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-center px-4"
          >
            <p className="text-white/90 text-sm sm:text-base font-mono tracking-[0.15em] uppercase mb-3">
              Cabo San Lucas Â· 58&apos; Viking
            </p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              World-Class <span className="text-gold-gradient">Sportfishing</span>
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
              Marlin Â· Tuna Â· Dorado Â· Whale Watching Â· Sunset Cruises
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/book">
                <Button size="lg" className="min-w-[200px] text-base shadow-lg">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Book Your Charter
                </Button>
              </Link>
              <Link href="/charters">
                <Button variant="outline" size="lg" className="min-w-[200px] text-base border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Anchor className="w-5 h-5 mr-2" />
                  View Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile CTA below the boat image */}
      <div className="bg-[#0a1628] px-4 py-7 text-center sm:hidden">
        <p className="mb-2 font-mono text-sm uppercase tracking-[0.15em] text-white/90">
          Cabo San Lucas · 58&apos; Viking
        </p>
        <h1 className="mb-3 font-display text-2xl font-bold text-white">
          World-Class <span className="text-gold-gradient">Sportfishing</span>
        </h1>
        <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-white/75">
          Marlin · Tuna · Dorado · Whale Watching · Sunset Cruises
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link href="/book" className="w-full max-w-xs">
            <Button size="lg" className="w-full text-base shadow-lg">
              <CalendarDays className="mr-2 h-5 w-5" />
              Book Your Charter
            </Button>
          </Link>
          <Link href="/charters" className="w-full max-w-xs">
            <Button variant="outline" size="lg" className="w-full border-white/30 text-base text-white hover:bg-white/10">
              <Anchor className="mr-2 h-5 w-5" />
              View Packages
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </section>
  );
}
