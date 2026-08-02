'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GALLERY_IMAGES } from '@/lib/charter-data';
import { X, Camera } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'boat', label: 'The Boats' },
  { key: 'fishing', label: 'Fishing' },
  { key: 'tournament', label: 'Tournaments' },
  { key: 'dining', label: 'Dining' },
];

export function GalleryContent() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === 'all'
    ? (GALLERY_IMAGES ?? [])
    : (GALLERY_IMAGES ?? []).filter((img: any) => img?.category === filter);

  const lightboxImage = lightbox !== null ? filtered?.[lightbox] : null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Gallery</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Life on <span className="text-gold-gradient">the Water</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          From tournament wins to sunset celebrations — explore moments aboard our 58&apos; Viking.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {CATEGORIES?.map((cat: any) => (
          <button
            key={cat?.key}
            onClick={() => setFilter(cat?.key ?? 'all')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === cat?.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border/30 text-muted-foreground hover:border-primary/30'
            }`}
          >
            {cat?.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered?.map?.((img: any, i: number) => (
          <motion.div
            key={img?.src ?? i}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setLightbox(i)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-muted w-full"
            >
              <Image
                src={img?.src ?? ''}
                alt={img?.alt ?? 'TCB Gallery'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </motion.div>
        )) ?? []}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-foreground hover:text-primary transition-colors z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-4xl aspect-video" onClick={(e: any) => e?.stopPropagation?.()}>
              <Image
                src={lightboxImage?.src ?? ''}
                alt={lightboxImage?.alt ?? 'Gallery image'}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-muted-foreground">{lightboxImage?.alt}</p>

            {/* Nav arrows */}
            {lightbox > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-foreground hover:text-primary"
                onClick={(e: any) => { e?.stopPropagation?.(); setLightbox(lightbox - 1); }}
                aria-label="Previous image"
              >
                ←
              </button>
            )}
            {lightbox < (filtered?.length ?? 0) - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-foreground hover:text-primary"
                onClick={(e: any) => { e?.stopPropagation?.(); setLightbox(lightbox + 1); }}
                aria-label="Next image"
              >
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
