'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Anchor, Fish, Camera, Ship, CalendarDays, Home, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/charters', label: 'Charters', icon: Anchor },
  { href: '/species', label: 'Species', icon: Fish },
  { href: '/gallery', label: 'Gallery', icon: Camera },
  { href: '/the-boat', label: 'The Boat', icon: Ship },
  { href: '/book', label: 'Book Now', icon: CalendarDays },
  { href: '/villa', label: 'Villa Amore', icon: Home },
  { href: '/contact', label: 'Contact', icon: Send },
];

const PHONE_NUMBER = '+526241225441';
const PHONE_DISPLAY = '+52 624 122 5441';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/50'
            : 'bg-[#0a1628]/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 sm:h-12 w-[120px] sm:w-[140px]">
                <Image
                  src="/images/logo-simplified.jpg"
                  alt="Striped World Charters"
                  fill
                  className="object-contain"
                  sizes="140px"
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS?.map((link: any) => {
                const Icon = link?.icon;
                const isActive = pathname === link?.href;
                return (
                  <Link key={link?.href} href={link?.href ?? '/'}>
                    <Button
                      variant={link?.label === 'Book Now' ? 'default' : 'ghost'}
                      size="sm"
                      className={`${
                        isActive && link?.label !== 'Book Now'
                          ? 'text-primary bg-primary/10'
                          : link?.label !== 'Book Now'
                          ? 'text-muted-foreground hover:text-foreground'
                          : ''
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                      {link?.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button + phone */}
            <div className="flex items-center gap-2 lg:hidden">
              <a href={`tel:${PHONE_NUMBER}`} className="p-2 text-primary">
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}<span className="text-sm font-medium">{isOpen ? "Close" : "Menu"}</span>
              </button>
            </div>

            {/* Desktop phone */}
            <a href={`tel:${PHONE_NUMBER}`} className="hidden lg:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm">{PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-20 lg:hidden"
          >
            <nav className="flex flex-col items-center gap-2 p-6">
              {NAV_LINKS?.map((link: any) => {
                const Icon = link?.icon;
                const isActive = pathname === link?.href;
                return (
                  <Link
                    key={link?.href}
                    href={link?.href ?? '/'}
                    className={`w-full max-w-sm flex items-center gap-3 px-6 py-4 rounded-lg text-lg transition-colors ${
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {link?.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-full max-w-sm flex items-center gap-3 px-6 py-4 rounded-lg text-lg text-primary hover:bg-primary/10 transition-colors mt-4"
              >
                <Phone className="w-5 h-5" />
                {PHONE_DISPLAY}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/10 bg-[#0a1628]/95 backdrop-blur-xl lg:hidden">
        {[
          { href: '/', label: 'Home', icon: Home },
          { href: '/charters', label: 'Charters', icon: Anchor },
          { href: '/book', label: 'Book', icon: CalendarDays },
          { href: '/contact', label: 'Contact', icon: Send },
        ].map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs ${
                link.label === 'Book'
                  ? 'bg-primary text-primary-foreground'
                  : isActive
                  ? 'text-primary'
                  : 'text-white/75'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
