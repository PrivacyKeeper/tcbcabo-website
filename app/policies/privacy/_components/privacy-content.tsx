'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you use our website or book a charter, we may collect the following information:

• **Personal Information:** Name, email address, phone number, and mailing address provided through booking forms, contact forms, or direct communication.
• **Payment Information:** Payment details necessary to process your deposit and charter fees. Payment processing is handled by secure third-party processors — we do not store your full credit card information on our servers.
• **Booking Information:** Charter dates, package selections, number of guests, and special requests.
• **Usage Data:** Non-personally identifiable information such as browser type, device type, pages visited, and time spent on the site, collected through cookies and analytics tools.
• **Communication Records:** Emails, phone inquiries, and other correspondence related to your charter booking.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect for the following purposes:

• To process and confirm your charter booking.
• To communicate with you about your reservation, including confirmations, reminders, and follow-ups.
• To process payments and issue refunds when applicable.
• To respond to your inquiries and provide customer support.
• To improve our website, services, and customer experience.
• To comply with legal obligations and enforce our policies.
• To send you promotional materials or updates about Striped World Charters — only with your consent, and you may opt out at any time.`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• **Service Providers:** With trusted third-party vendors who assist in operating our website, processing payments, or providing services on our behalf (e.g., payment processors, email service providers). These parties are obligated to keep your information confidential.
• **Legal Compliance:** When required by law, regulation, or legal process, or to protect the rights, safety, or property of Striped World Charters, our guests, or the public.
• **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.`,
  },
  {
    title: '4. Cookies & Tracking',
    content: `Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you use our site.

• **Essential Cookies:** Required for the website to function properly (e.g., session management, booking forms).
• **Analytics Cookies:** Help us understand website traffic and user behavior to improve our services.

You can control cookie preferences through your browser settings. Disabling cookies may affect certain website functionality.`,
  },
  {
    title: '5. Data Security',
    content: `We implement reasonable administrative, technical, and physical security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking records are retained for a minimum of 3 years for tax and legal compliance purposes.`,
  },
  {
    title: '7. Your Rights',
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal information:

• **Access:** Request a copy of the personal data we hold about you.
• **Correction:** Request correction of inaccurate or incomplete information.
• **Deletion:** Request deletion of your personal data, subject to legal retention requirements.
• **Opt-Out:** Unsubscribe from marketing communications at any time.

To exercise any of these rights, contact us at stripedworldcharters@gmail.com.`,
  },
  {
    title: '8. Third-Party Links',
    content: `Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those external sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    title: `9. Children's Privacy`,
    content: `Our website and services are not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We reserve the right to update or modify this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Your continued use of our website after any changes constitutes acceptance of the revised policy.`,
  },
];

export function PrivacyContent() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Privacy <span className="text-gold-gradient">Policy</span>
        </h1>
        <p className="text-muted-foreground mb-2">Effective as of 2026 | Striped World Charters — Cabo San Lucas, Mexico</p>
        <p className="text-muted-foreground text-sm mb-10">
          Striped World Charters (“we,” “our,” or “us”) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
        </p>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card border border-border/30 rounded-lg p-5 sm:p-6"
            >
              <h2 className="font-display text-lg sm:text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-muted/30 rounded-lg border border-border/20 text-center">
          <p className="text-muted-foreground text-sm">
            Privacy questions? Contact us at{' '}
            <a href="mailto:stripedworldcharters@gmail.com" className="text-primary hover:underline">
              stripedworldcharters@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
