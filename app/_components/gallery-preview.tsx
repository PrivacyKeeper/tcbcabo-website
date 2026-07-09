'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '@/lib/charter-data';

export function GalleryPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const preview = (GALLERY_IMAGES ?? []).slice(0, 4);

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Gallery</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Life on the Water</h2>
          </div>
          <Link href="/gallery" className="hidden sm:block">
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {preview?.map((img: any, i: number) => (
            <motion.div
              key={img?.src ?? i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href="/gallery">
                <div className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={img?.src ?? ''}
                    alt={img?.alt ?? 'TCB Gallery photo'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/gallery">
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              View All Photos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
