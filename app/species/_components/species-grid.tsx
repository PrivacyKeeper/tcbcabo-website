'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Fish, Waves, ArrowRight } from 'lucide-react';
import { SPECIES_DATA } from '@/lib/charter-data';

export function SpeciesGrid() {
  const species = Object.values(SPECIES_DATA ?? {});
  const fishSpecies = species?.filter?.((s: any) => s?.type === 'fish') ?? [];
  const whaleSpecies = species?.filter?.((s: any) => s?.type === 'whale') ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Species Guide</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Marine Life of <span className="text-gold-gradient">Cabo</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          The waters of Cabo San Lucas teem with incredible game fish and majestic whales. Discover what you can encounter with Striped World Charters.
        </p>
      </div>

      {/* Game Fish */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Fish className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Game Fish</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fishSpecies?.map?.((s: any, i: number) => (
            <motion.div
              key={s?.slug ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/species/${s?.slug}`}>
                <div className="group bg-card border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-all">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={s?.image ?? ''}
                      alt={s?.name ?? 'Fish species'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg mb-1">{s?.name}</h3>
                    <p className="text-xs text-muted-foreground italic mb-2">{s?.scientific}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-xs font-mono">{s?.season}</span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) ?? []}
        </div>
      </div>

      {/* Whales */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Waves className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Whales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {whaleSpecies?.map?.((s: any, i: number) => (
            <motion.div
              key={s?.slug ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/species/${s?.slug}`}>
                <div className="group bg-card border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-all">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={s?.image ?? ''}
                      alt={s?.name ?? 'Whale species'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-xl mb-1">{s?.name}</h3>
                    <p className="text-sm text-muted-foreground italic mb-2">{s?.scientific}</p>
                    <p className="text-primary text-xs font-mono mb-2">{s?.season}</p>
                    <p className="text-muted-foreground text-sm line-clamp-2">{s?.description?.split?.('\n')?.[0] ?? ''}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) ?? []}
        </div>
      </div>
    </div>
  );
}
