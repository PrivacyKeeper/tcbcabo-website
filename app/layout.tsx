export const dynamic = "force-dynamic";

import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import type { Metadata } from 'next';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Striped World Charters | Luxury Charter Fishing in Cabo San Lucas',
  description: 'Experience world-class sportfishing aboard a 58\' Viking in Cabo San Lucas. Marlin, tuna, dorado fishing charters, whale watching, sunset cruises & private events.',
  keywords: 'Cabo charter fishing, Cabo sportfishing, luxury fishing charter, marlin fishing Cabo, tuna fishing Cabo San Lucas, whale watching Cabo, sunset cruise Cabo',
  openGraph: {
    title: 'Striped World Charters | Luxury Charter Fishing',
    description: 'World-class sportfishing aboard a 58\' Viking in Cabo San Lucas, Mexico.',
    images: ['/og-image.png'],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
          <ChunkLoadErrorHandler />
        </Providers>
      </body>
    </html>
  );
}
