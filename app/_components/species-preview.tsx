'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SPECIES_DATA } from '@/lib/charter-data';

const PREVIEW_SPECIES = ['marlin', 'tuna', 'dorado', 'humpback-whale'];

export function SpeciesPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">What Awaits</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Species of Cabo</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PREVIEW_SPECIES?.map((slug: string, i: number) => {
            const s = SPECIES_DATA?.[slug];
            if (!s) return null;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/species/${s?.slug}`}>
                  <div className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={s?.image ?? ''}
                      alt={s?.name ?? 'Species'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-display font-semibold text-base sm:text-lg">{s?.name}</p>
                      <p className="text-primary text-xs font-mono">{s?.season}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/species">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              View All Species
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
