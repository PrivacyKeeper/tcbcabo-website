'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Anchor, Fish, Camera, Ship, 
  CalendarDays, Home, Send, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PHONE_NUMBER = '+526241225441';
const PHONE_DISPLAY = '+52 624 122 5441';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isBookOverlayOpen, setIsBookOverlayOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsBookOverlayOpen(false);
    setActiveAccordion(null);
  }, [pathname]);

  const toggleAccordion = (label: string) => {
    setActiveAccordion(activeAccordion === label ? null : label);
  };

  const navItemClasses = (isActive: boolean, isButton = false) => {
    if (isButton) return "";
    return isActive 
      ? 'text-primary bg-primary/10 px-3 py-2 rounded-md transition-colors' 
      : 'text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors';
  };

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

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Charters Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                    <Anchor className="w-4 h-4 mr-1" />
                    Charters <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-[#0a1628] border-white/10 text-white">
                  <DropdownMenuItem onClick={() => router.push('/charters#tcb')} className="cursor-pointer hover:bg-primary/20">
                    TCB — 58&apos; Viking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/charters#cash-flow')} className="cursor-pointer hover:bg-primary/20">
                    Cash Flow — 26&apos; Angler
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/species">
                <Button variant="ghost" size="sm" className={navItemClasses(pathname === '/species')}>
                  <Fish className="w-4 h-4 mr-1.5" /> Species
                </Button>
              </Link>

              <Link href="/gallery">
                <Button variant="ghost" size="sm" className={navItemClasses(pathname === '/gallery')}>
                  <Camera className="w-4 h-4 mr-1.5" /> Gallery
                </Button>
              </Link>

              {/* The Boats Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                    <Ship className="w-4 h-4 mr-1" />
                    The Boats <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-[#0a1628] border-white/10 text-white">
                  <DropdownMenuItem onClick={() => router.push('/the-boat')} className="cursor-pointer hover:bg-primary/20">
                    TCB — 58&apos; Viking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/the-boat#cash-flow')} className="cursor-pointer hover:bg-primary/20">
                    Cash Flow — 26&apos; Angler
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Book Now Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="ml-2 gap-1">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Book Now <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0a1628] border-white/10 text-white">
                  <DropdownMenuItem onClick={() => router.push('/book?boat=tcb')} className="p-3 cursor-pointer hover:bg-primary/20 flex flex-col items-start gap-0.5">
                    <span className="font-bold text-primary">Book TCB</span>
                    <span className="text-xs opacity-70">58&apos; Viking Sportfisher</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/book?boat=cash-flow')} className="p-3 cursor-pointer hover:bg-primary/20 flex flex-col items-start gap-0.5 border-t border-white/5">
                    <span className="font-bold text-primary">Book Cash Flow</span>
                    <span className="text-xs opacity-70">26&apos; Angler Center Console</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/villa')} className="p-3 cursor-pointer hover:bg-primary/20 flex flex-col items-start gap-0.5 border-t border-white/5">
                    <div className="flex items-center gap-1.5 font-bold text-primary">
                      <Home className="w-4 h-4" /> Book Villa Amore
                    </div>
                    <span className="text-xs opacity-70">Luxury Stay in Cabo</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/contact" className="ml-1">
                <Button variant="ghost" size="sm" className={navItemClasses(pathname === '/contact')}>
                  <Send className="w-4 h-4 mr-1.5" /> Contact
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button + Phone Header */}
            <div className="flex items-center gap-2 lg:hidden">
              <a href={`tel:${PHONE_NUMBER}`} className="p-2 text-primary">
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                <span className="text-sm font-medium uppercase tracking-wider">
                  {isOpen ? "Close" : "Menu"}
                </span>
              </button>
            </div>

            {/* Desktop Phone */}
            <a href={`tel:${PHONE_NUMBER}`} className="hidden lg:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm">{PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Menu (Full Screen) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-20 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col p-6 space-y-2">
              {/* Home */}
              <Link href="/" className="px-4 py-3 text-lg border-b border-white/5">Home</Link>
              
              {/* Charters Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('charters')}
                  className="w-full flex items-center justify-between px-4 py-3 text-lg border-b border-white/5"
                >
                  <span className="flex items-center gap-3"><Anchor className="w-5 h-5 text-primary" /> Charters</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeAccordion === 'charters' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'charters' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-muted/30">
                      <Link href="/charters#tcb" className="block px-12 py-3 text-base border-b border-white/5 italic">TCB — 58&apos; Viking</Link>
                      <Link href="/charters#cash-flow" className="block px-12 py-3 text-base border-b border-white/5 italic">Cash Flow — 26&apos; Angler</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plain Links */}
              <Link href="/species" className="flex items-center gap-3 px-4 py-3 text-lg border-b border-white/5"><Fish className="w-5 h-5 text-primary" /> Species</Link>
              <Link href="/gallery" className="flex items-center gap-3 px-4 py-3 text-lg border-b border-white/5"><Camera className="w-5 h-5 text-primary" /> Gallery</Link>

              {/* The Boats Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('boats')}
                  className="w-full flex items-center justify-between px-4 py-3 text-lg border-b border-white/5"
                >
                  <span className="flex items-center gap-3"><Ship className="w-5 h-5 text-primary" /> The Boats</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeAccordion === 'boats' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'boats' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-muted/30">
                      <Link href="/the-boat" className="block px-12 py-3 text-base border-b border-white/5 italic">TCB - The Flagship</Link>
                      <Link href="/the-boat#cash-flow" className="block px-12 py-3 text-base border-b border-white/5 italic">Cash Flow - Center Console</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Book Now Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('book')}
                  className="w-full flex items-center justify-between px-4 py-3 text-lg border-b border-white/10 bg-primary/10 rounded-lg mt-2"
                >
                  <span className="flex items-center gap-3 font-bold text-primary"><CalendarDays className="w-5 h-5" /> Book Now</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform ${activeAccordion === 'book' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'book' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-primary/5 rounded-b-lg">
                      <Link href="/book?boat=tcb" className="block px-12 py-4 border-b border-white/5">
                        <span className="block font-bold">Book TCB</span>
                        <span className="text-xs text-muted-foreground">Viking Sportfisher</span>
                      </Link>
                      <Link href="/book?boat=cash-flow" className="block px-12 py-4 border-b border-white/5">
                        <span className="block font-bold">Book Cash Flow</span>
                        <span className="text-xs text-muted-foreground">Angler Center Console</span>
                      </Link>
                      <Link href="/villa" className="block px-12 py-4">
                        <span className="block font-bold">Book Villa Amore</span>
                        <span className="text-xs text-muted-foreground">Luxury Stay In Cabo</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-lg border-b border-white/5"><Send className="w-5 h-5 text-primary" /> Contact</Link>
              
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 px-4 py-6 text-primary font-mono text-xl">
                <Phone className="w-6 h-6" /> {PHONE_DISPLAY}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Overlay for Booking Options */}
      <AnimatePresence>
        {isBookOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 lg:hidden flex items-end"
            onClick={() => setIsBookOverlayOpen(false)}
          >
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="w-full bg-[#0a1628] rounded-t-2xl p-6 pb-24"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-white">Choose Your Experience</h3>
                <button onClick={() => setIsBookOverlayOpen(false)}><X className="w-6 h-6 text-white/50" /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => router.push('/book?boat=tcb')} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center text-left">
                  <div>
                    <span className="block font-bold text-primary text-lg">Book TCB</span>
                    <span className="text-sm text-white/60">58&apos; Viking Sportfisher</span>
                  </div>
                  <ChevronDown className="w-5 h-5 -rotate-90 text-primary" />
                </button>
                <button onClick={() => router.push('/book?boat=cash-flow')} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center text-left">
                  <div>
                    <span className="block font-bold text-primary text-lg">Book Cash Flow</span>
                    <span className="text-sm text-white/60">26&apos; Angler Center Console</span>
                  </div>
                  <ChevronDown className="w-5 h-5 -rotate-90 text-primary" />
                </button>
                <button onClick={() => router.push('/villa')} className="w-full bg-primary/20 border border-primary/30 p-4 rounded-xl flex justify-between items-center text-left">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6 text-primary" />
                    <div>
                      <span className="block font-bold text-primary text-lg">Book Villa Amore</span>
                      <span className="text-sm text-primary/70">Luxury Vacation Rental</span>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 -rotate-90 text-primary" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/10 bg-[#0a1628]/95 backdrop-blur-xl lg:hidden">
        <Link href="/" className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold ${pathname === '/' ? 'text-primary' : 'text-white/75'}`}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/charters" className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold ${pathname === '/charters' ? 'text-primary' : 'text-white/75'}`}>
          <Anchor className="h-5 w-5" />
          <span>Charters</span>
        </Link>
        <button 
          onClick={() => setIsBookOverlayOpen(true)} 
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold bg-primary text-[#0a1628]"
        >
          <CalendarDays className="h-5 w-5" />
          <span>Book</span>
        </button>
        <Link href="/contact" className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] uppercase font-bold ${pathname === '/contact' ? 'text-primary' : 'text-white/75'}`}>
          <Send className="h-5 w-5" />
          <span>Contact</span>
        </Link>
      </nav>
    </>
  );
}
