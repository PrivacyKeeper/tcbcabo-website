'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Compass, Heart, Anchor, Shield } from 'lucide-react';

const VALUES = [
  { word: 'Aventura', english: 'Adventure', icon: Compass },
  { word: 'Pasión', english: 'Passion', icon: Heart },
  { word: 'Experiencia', english: 'Experience', icon: Anchor },
  { word: 'Confianza', english: 'Trust', icon: Shield },
];

export function BrandValues() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="relative bg-[#0a1628] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.word}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <v.icon className="w-5 h-5 text-primary/80" strokeWidth={1.5} />
              <p className="font-display text-sm sm:text-base font-semibold text-white tracking-wide">
                {v.word}
              </p>
              <p className="text-[11px] text-white/40 font-mono tracking-[0.15em] uppercase">
                {v.english}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
