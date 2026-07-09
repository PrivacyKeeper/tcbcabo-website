'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Fish, Thermometer, MapPin, Sparkles, Calendar } from 'lucide-react';

export function LatestReport() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch('/api/reports/latest')
      .then((r) => r.json())
      .then((data) => setReport(data))
      .catch(() => {});
  }, []);

  if (!report) return null;

  return (
    <section ref={ref} className="py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Latest From The Water</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-8">Captain&apos;s Report</h2>

          <div className="bg-card rounded-lg border border-border/30 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h3 className="font-display text-xl font-semibold">{report?.title ?? 'Report'}</h3>
              <span className="flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                <Calendar className="w-4 h-4" />
                {report?.date ? new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {report?.conditions && (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Conditions</p>
                    <p className="text-sm">{report.conditions}</p>
                  </div>
                </div>
              )}
              {report?.waterTemp && (
                <div className="flex items-start gap-2">
                  <Thermometer className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Water Temp</p>
                    <p className="text-sm">{report.waterTemp}</p>
                  </div>
                </div>
              )}
              {(report?.species?.length ?? 0) > 0 && (
                <div className="flex items-start gap-2">
                  <Fish className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Species</p>
                    <p className="text-sm">{report.species?.join?.(', ') ?? ''}</p>
                  </div>
                </div>
              )}
              {report?.hotspots && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Hotspots</p>
                    <p className="text-sm">{report.hotspots}</p>
                  </div>
                </div>
              )}
            </div>

            {report?.highlights && (
              <p className="text-muted-foreground text-sm leading-relaxed">{report.highlights}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
