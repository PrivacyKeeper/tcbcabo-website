import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

const PHONE_NUMBER = '+526241225441';
const PHONE_DISPLAY = '+52 624 122 5441';
const EMAIL = 'stripedworldcharters@gmail.com';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-[130px]">
                <Image
                  src="/images/logo-simplified.jpg"
                  alt="Striped World Charters"
                  fill
                  className="object-contain"
                  sizes="130px"
                />
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Luxury charter fishing aboard a 58&apos; Viking in Cabo San Lucas, Mexico. World-class sportfishing, whale watching &amp; sunset cruises.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/charters" className="text-muted-foreground hover:text-primary text-sm transition-colors">Charter Packages</Link>
              <Link href="/book" className="text-muted-foreground hover:text-primary text-sm transition-colors">Book a Charter</Link>
              <Link href="/species" className="text-muted-foreground hover:text-primary text-sm transition-colors">Species Guide</Link>
              <Link href="/gallery" className="text-muted-foreground hover:text-primary text-sm transition-colors">Photo Gallery</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Contact</h4>
            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm font-medium">Capitán Francisco Ruiz</p>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Cabo San Lucas B.C.S., México
              </div>
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-3">
            <Link href="/policies/refund" className="text-muted-foreground hover:text-primary text-xs transition-colors">Refund &amp; Cancellation</Link>
            <span className="text-border hidden sm:inline">|</span>
            <Link href="/policies/rules" className="text-muted-foreground hover:text-primary text-xs transition-colors">Charter Rules</Link>
            <span className="text-border hidden sm:inline">|</span>
            <Link href="/policies/privacy" className="text-muted-foreground hover:text-primary text-xs transition-colors">Privacy Policy</Link>
            <span className="text-border hidden sm:inline">|</span>
            <Link href="/policies/disclaimers" className="text-muted-foreground hover:text-primary text-xs transition-colors">Disclaimers</Link>
          </div>
          <p className="text-muted-foreground text-xs text-center">© 2026 TCB LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
