import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const PHONE_NUMBER = "+526241225441";
const PHONE_DISPLAY = "+52 624 122 5441";
const EMAIL = "info@stripedworldcharters.com";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
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

            <p className="text-sm leading-relaxed text-muted-foreground">
              Luxury charter fishing aboard a 58&apos; Viking in Cabo San Lucas,
              Mexico. World-class sportfishing, whale watching &amp; sunset
              cruises.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-foreground">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2">
              <Link
                href="/charters"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Charter Packages
              </Link>

              <Link
                href="/book"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Book a Charter
              </Link>

              <Link
                href="/species"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Species Guide
              </Link>

              <Link
                href="/gallery"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Photo Gallery
              </Link>

              <Link
                href="/faq"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                FAQ &amp; Know Before You Go
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-foreground">
              Contact
            </h4>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                Capitán Francisco Ruiz
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                Cabo San Lucas B.C.S., México
              </div>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                {PHONE_DISPLAY}
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="/policies/refund"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Refund &amp; Cancellation
            </Link>

            <span className="hidden text-border sm:inline">|</span>

            <Link
              href="/policies/rules"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Charter Rules
            </Link>

            <span className="hidden text-border sm:inline">|</span>

            <Link
              href="/policies/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>

            <span className="hidden text-border sm:inline">|</span>

            <Link
              href="/policies/disclaimers"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Disclaimers
            </Link>

            <span className="hidden text-border sm:inline">|</span>

            <Link
              href="/captain/login"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Captain Login
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © 2026 TCB LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
