'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CHARTER_PACKAGES } from '@/lib/charter-data';
import { CalendarDays, Check, Clock, Users, DollarSign, Sparkles, Fish, Eye, Sunset, PartyPopper, Utensils, Info } from 'lucide-react';

const SECTION_ICONS: Record<string, any> = {
  fishing: Fish,
  whaleWatching: Eye,
  sunset: Sunset,
  bachelor: PartyPopper,
};

const SECTION_IDS: Record<string, string> = {
  fishing: 'fishing',
  whaleWatching: 'whale-watching',
  sunset: 'sunset',
  bachelor: 'bachelor',
};

function CharterSection({ sectionKey, data }: { sectionKey: string; data: any }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const Icon = SECTION_ICONS?.[sectionKey] ?? Fish;

  return (
    <section ref={ref} id={SECTION_IDS?.[sectionKey] ?? sectionKey} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{data?.name}</h2>
            <p className="text-muted-foreground text-sm">{data?.description}</p>
          </div>
        </div>

        {data?.seasonal && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mb-4 inline-flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary">Seasonal: {data.seasonal}</span>
          </div>
        )}

        {/* Pricing options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {(data?.options ?? []).map((opt: any, i: number) => (
            <div key={i} className="bg-card border border-border/30 rounded-lg p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{opt?.duration}</span>
                </div>
                <span className="font-display text-2xl font-bold text-gold-gradient">${(opt?.price ?? 0).toLocaleString()}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{opt?.details}</p>
              {opt?.startTime && (
                <p className="text-xs text-muted-foreground">Departure: {opt.startTime}</p>
              )}
            </div>
          ))}
        </div>

        {/* Inclusions */}
        {(data?.inclusions?.length ?? 0) > 0 && (
          <div className="bg-muted/30 rounded-lg p-5 mb-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3">Included</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(data?.inclusions ?? []).map((inc: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{inc}</span>
                </div>
              ))}
            </div>
            {(data?.notes?.length ?? 0) > 0 && (
              <div className="mt-4 space-y-2 border-t border-border/30 pt-3">
                {(data?.notes ?? []).map((n: string, i: number) => (
                  <p key={i} className="flex items-start gap-2 text-xs text-muted-foreground italic">
                    <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu */}
        {(data?.menu?.length ?? 0) > 0 && (
          <div className="bg-muted/30 rounded-lg p-5 mb-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Food &amp; Drinks Included
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(data?.menu ?? []).map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            {data?.menuUpgradeNote && (
              <p className="text-xs text-primary/80 mt-3 italic">{data.menuUpgradeNote}</p>
            )}
          </div>
        )}

        {/* Upgrades */}
        {(data?.upgrades?.length ?? 0) > 0 && (
          <div className="bg-muted/30 rounded-lg p-5">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3">Upgrade Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(data?.upgrades ?? []).map((up: any, i: number) => (
                <div key={i} className="bg-card border border-border/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{up?.name}</span>
                    <span className="text-primary font-mono text-sm">+${(up?.price ?? 0).toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{up?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

export function ChartersContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Our Experiences</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Charter <span className="text-gold-gradient">Packages</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Every charter with Striped World includes a professional crew, premium equipment, food &amp; beverages, and memories that last a lifetime.
        </p>
      </div>

      {/* Payment terms banner */}
      <div className="bg-card border border-primary/20 rounded-lg p-5 mb-12 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="text-sm">Booking <strong className="text-primary">30+ days</strong> out: <strong className="text-primary">50% deposit</strong>, balance due 30 days prior</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-sm">Within <strong className="text-primary">30 days</strong>: <strong className="text-primary">paid in full</strong> at booking</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm">All prices in <strong className="text-primary">USD</strong></span>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {Object.entries(CHARTER_PACKAGES ?? {}).map(([key, data]: [string, any]) => (
          <CharterSection key={key} sectionKey={key} data={data} />
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/book">
          <Button size="lg" className="min-w-[220px] text-base">
            <CalendarDays className="w-5 h-5 mr-2" />
            Book Your Charter
          </Button>
        </Link>
      </div>
    </div>
  );
}
