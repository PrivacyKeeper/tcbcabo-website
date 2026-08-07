'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Fish, Eye, Sunset, PartyPopper, ArrowRight, Clock } from 'lucide-react';

const CHARTERS = [
  {
    icon: Fish,
    title: 'Fishing Charters',
    desc: 'Marlin, tuna, dorado & wahoo',
    price: 'From $4,250',
    duration: '5 or 8 hrs',
    href: '/charters#fishing',
  },
  {
    icon: Eye,
    title: 'Whale Watching',
    desc: 'Humpback & gray whales',
    price: '$2,500',
    duration: '3 hours',
    href: '/charters#whale-watching',
  },
  {
    icon: Sunset,
    title: 'Sunset Cruises',
    desc: 'Past El Arco & Land\'s End',
    price: '$3,200',
    duration: 'Sunset',
    href: '/charters#sunset',
  },
  {
    icon: PartyPopper,
    title: 'Bachelor/Bachelorette',
    desc: 'Celebrate on the open water',
    price: '$3,500',
    duration: '4 hours',
    href: '/charters#bachelor',
  },
];

export function CharterPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Our Experiences</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Charter Packages</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Every charter includes premium equipment, food & beverages, and a professional crew dedicated to an unforgettable day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARTERS?.map((c: any, i: number) => {
            const Icon = c?.icon;
            return (
              <motion.div
                key={c?.title ?? i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={c?.href ?? '/charters'}>
                  <div className="group bg-card rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 hover:bg-card/80 border border-border/30 hover:border-primary/30">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      {Icon && <Icon className="w-6 h-6 text-primary" />}
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-1">{c?.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{c?.desc}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-primary font-mono">
                        {c?.price} cash
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {c?.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/charters">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              View All Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
