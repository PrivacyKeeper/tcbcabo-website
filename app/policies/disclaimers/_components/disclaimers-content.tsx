'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const sections = [
  {
    title: 'Fishing Disclaimer',
    content: `Striped World Charters provides a world-class fishing experience with professional crew and top-of-the-line equipment. However, **fishing is an inherently unpredictable activity**. We do not and cannot guarantee any specific catch, species, size, or quantity of fish on any charter.

Our captain and crew will use their best professional judgment and knowledge of local waters to maximize your chances of a successful outing. Ocean conditions, fish migration patterns, water temperature, and other natural factors are beyond our control.

By booking a charter, you acknowledge that the experience — not a guaranteed catch — is the primary service being provided.`,
  },
  {
    title: 'Weather & Sea Conditions',
    content: `All charters are subject to weather and sea conditions. The captain reserves the sole right to alter the route, duration, destination, or cancel a charter entirely based on safety considerations.

Striped World Charters monitors weather conditions closely and will communicate any potential issues as early as possible. Weather-related decisions made by the captain are final and are made in the best interest of passenger and crew safety.

We recommend that guests do not make non-refundable travel arrangements (flights, hotels) solely contingent on charter availability, as weather cancellations are possible, particularly during storm season (August–October).`,
  },
  {
    title: 'Assumption of Risk',
    content: `Participation in charter fishing, whale watching, sunset cruises, and other maritime activities involves **inherent risks** including but not limited to:

• Exposure to sun, wind, sea spray, and marine elements
• Risk of seasickness or motion discomfort
• Potential for injury from fishing hooks, lines, and equipment
• Slippery deck surfaces
• Encounters with marine wildlife
• Vessel motion in varying sea conditions

By boarding the vessel, all passengers voluntarily assume these risks. Passengers are responsible for their own physical fitness and ability to participate safely. Passengers with pre-existing medical conditions should consult a physician before participating.`,
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Striped World Charters, its owners, operators, captain, crew, and affiliated entities (collectively, “the Company”) shall not be liable for:

• Personal injury, illness, or death arising from participation in charter activities, except where caused by the Company's gross negligence or willful misconduct.
• Loss, theft, or damage to personal property brought aboard the vessel.
• Failure to catch fish or encounter marine wildlife.
• Delays, route changes, or cancellations due to weather, mechanical issues, or other circumstances beyond the Company's control.
• Any indirect, incidental, consequential, or punitive damages.

The Company's total liability for any claim shall not exceed the amount paid for the specific charter giving rise to the claim.`,
  },
  {
    title: 'Indemnification',
    content: `By booking and participating in a charter, you agree to indemnify, defend, and hold harmless Striped World Charters, its owners, captain, crew, and affiliated entities from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorney fees) arising out of or related to:

• Your participation in the charter
• Your violation of these terms or any applicable law
• Your negligent or intentional acts or omissions
• Any injury or damage caused to third parties by your actions`,
  },
  {
    title: 'Mexican Maritime Law',
    content: `Striped World Charters operates in Mexican territorial waters out of Cabo San Lucas, Baja California Sur, Mexico. All charters are subject to the laws of the United Mexican States, including applicable maritime, fishing, and environmental regulations.

Any disputes arising from or related to charter services shall be governed by Mexican law and shall be resolved in the competent courts of Los Cabos, Baja California Sur, Mexico.`,
  },
  {
    title: 'Website Disclaimer',
    content: `The information provided on this website is for general informational purposes only. While we strive to keep all content accurate and up to date, Striped World Charters makes no warranties or representations about the completeness, accuracy, or reliability of any information on this site.

Photos, videos, and descriptions of catches, marine life, and charter experiences represent past results and are not indicative of future outcomes. Pricing, availability, and charter details are subject to change without notice.

This website may contain links to external sites that are not operated by us. We have no control over the content or practices of these sites and assume no responsibility for them.`,
  },
  {
    title: 'Intellectual Property',
    content: `All content on this website — including text, photographs, graphics, logos, and design elements — is the property of Striped World Charters or its licensors and is protected by applicable copyright and trademark laws.

You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written consent from Striped World Charters.`,
  },
];

export function DisclaimersContent() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-7 h-7 text-primary flex-shrink-0" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Disclaimers & <span className="text-gold-gradient">Liability</span>
          </h1>
        </div>
        <p className="text-muted-foreground mb-2">Effective as of 2026 | Striped World Charters — Cabo San Lucas, Mexico</p>
        <p className="text-muted-foreground text-sm mb-10">
          Please read the following disclaimers and limitations carefully. By using this website or booking a charter, you agree to these terms.
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
            Legal questions? Contact us at{' '}
            <a href="mailto:info@stripedworldcharters.com" className="text-primary hover:underline">
              info@stripedworldcharters.com
            </a>{' '}
            or call <a href="tel:+526241225441" className="text-primary hover:underline">+52 624 122 5441</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
