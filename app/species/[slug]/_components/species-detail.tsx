'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowLeft, Ruler, Calendar, Crosshair, Star } from 'lucide-react';

export function SpeciesDetail({ species }: { species: any }) {
  const paragraphs = (species?.description ?? '')?.split?.('\n')?.filter?.((p: string) => p?.trim?.()) ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/species" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All Species
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src={species?.image ?? ''}
              alt={species?.name ?? 'Species'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">
            {species?.type === 'whale' ? 'Whale Watching' : 'Game Fish'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-1">{species?.name}</h1>
          <p className="text-muted-foreground italic text-sm mb-6">{species?.scientific}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <Ruler className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-muted-foreground uppercase">Size</p>
              <p className="text-sm font-medium">{species?.size}</p>
            </div>
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <Calendar className="w-4 h-4 text-primary mb-1" />
              <p className="text-xs text-muted-foreground uppercase">Season</p>
              <p className="text-sm font-medium">{species?.season}</p>
            </div>
          </div>

          <div className="bg-card border border-border/30 rounded-lg p-4 mb-6">
            <Crosshair className="w-4 h-4 text-primary mb-1" />
            <p className="text-xs text-muted-foreground uppercase mb-1">Techniques</p>
            <p className="text-sm">{species?.techniques}</p>
          </div>

          {/* Facts */}
          {(species?.facts?.length ?? 0) > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3 flex items-center gap-1">
                <Star className="w-4 h-4" /> Quick Facts
              </h3>
              <ul className="space-y-2">
                {(species?.facts ?? []).map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 max-w-3xl"
      >
        <h2 className="font-display text-2xl font-bold mb-4">About {species?.name}</h2>
        {paragraphs?.map?.((p: string, i: number) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
        ))}
      </motion.div>

      <div className="mt-8">
        <Link href={species?.type === 'whale' ? '/charters#whale-watching' : '/book'}>
          <Button size="lg">
            <CalendarDays className="w-5 h-5 mr-2" />
            {species?.type === 'whale' ? 'Book Whale Watching' : 'Book a Fishing Charter'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
