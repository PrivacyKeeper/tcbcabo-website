'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy, FileCheck2, Waves, AlertTriangle } from 'lucide-react';

const sections = [
  {
    title: 'Do I need a fishing license?',
    content: `Yes. Every person aboard who fishes is legally required to have a valid Mexican fishing license — it's Mexican law, not our policy, and it is strictly enforced.

Whether the license is included depends on which boat you're fishing:

• Cash Flow (26' Angler): Fishing licenses for all anglers are included in the charter price.
• TCB (58' Viking): Fishing licenses are purchased separately and are not included in the charter price. They are inexpensive and easy to arrange — we'll help you get squared away before departure. Just let us know your total number of anglers when you book.

If you're aboard but not fishing, a license is not required — but if you pick up a rod at any point, you'll need one.`,
  },
  {
    title: 'Will I get seasick? What do you recommend?',
    content: `Most of our guests do great. TCB (our 58' Viking) is equipped with stabilizers for a notably smoother ride, and Cash Flow is a nimble center console that handles the Sea of Cortez beautifully.

From experience — not medical advice (see below): guests who are prone to motion sickness tend to do best when they start an over-the-counter remedy two nights before and again the night before their charter, rather than waiting until the morning of. Staying hydrated, getting a good night's sleep, going easy on alcohol the night before, and keeping your eyes on the horizon all help, too.

We want every guest to have a great day on the water — if you have any concerns, reach out and we're happy to talk through what has worked well for past guests.`,
  },
  {
    title: 'What\'s included on my charter?',
    content: `What's included varies by boat and package:

Cash Flow (26' Angler) includes: professional captain and crew, top-shelf rods, reels and terminal tackle, live bait and lures, fishing licenses for all anglers, ice-cold drinks, snacks, lunch, and catch cleaning.

TCB (58' Viking) includes: the vessel, professional captain and crew, fuel, top-of-the-line rods, reels and terminal tackle, bait, and the crew's local knowledge. Fishing licenses are purchased separately, and food/drink inclusions vary by package.

Not included on either boat: gratuity for the crew (always appreciated but never required).

Please confirm the exact inclusions for your specific package on the Charters page or with our team when you book.`,
  },
  {
    title: 'What should I bring?',
    content: `• A hat, polarized sunglasses, and reef-safe sunscreen
• A light jacket or windbreaker (mornings can be cool and breezy)
• Non-marking, closed-toe deck shoes or sandals
• Any motion-sickness remedy you plan to use (started the night before — see above)
• A valid photo ID
• Your phone or camera for photos of the catch

We'll handle the rods, tackle, bait, and local know-how. Food and drink details vary by package — confirm when you book.`,
  },
  {
    title: 'What if the weather is bad?',
    content: `Safety comes first. The captain reserves the sole right to alter the route, shorten, reschedule, or cancel a charter based on weather and sea conditions. Weather-related decisions made by the captain are final and made in the best interest of passenger and crew safety.

We recommend not booking non-refundable flights or hotels solely around a single charter date, particularly during storm season (August–October). See our full Refund Policy for details.`,
  },
];

export function FaqContent() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-3">
          <LifeBuoy className="w-7 h-7 text-primary flex-shrink-0" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            FAQ &amp; <span className="text-gold-gradient">Know Before You Go</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-10">
          The most common questions from our guests — fishing licenses, seasickness, what to bring, and our policies.
          Have another question? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
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

        {/* Seasickness / health advice waiver */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">
              Important: Health &amp; Seasickness Advice Disclaimer
            </h2>
          </div>
          <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
{`Any suggestions we share about seasickness, motion-sickness remedies, timing, or comfort are offered for general informational purposes only, based on our crew's on-the-water experience. We are not physicians and this is not medical advice.

Over-the-counter and prescription medications — including any product mentioned by our crew or on this website — can have side effects and interactions. Before taking any medication or remedy, consult a licensed physician or pharmacist, especially if you are pregnant, nursing, taking other medications, or have any pre-existing medical condition. You use any such remedy at your own discretion and risk.

Seasickness and motion discomfort are inherent risks of any ocean activity and can occur even with stabilizers and preventative measures. Experiencing seasickness is not grounds for a refund, and time lost to seasickness cannot be credited or rebooked. If a guest becomes unwell, the captain will use best judgment regarding the guest's comfort and safety, which may include returning to port; any such decision does not entitle the guest to a refund.

By booking and boarding, you acknowledge and voluntarily assume these risks, confirm you are physically fit to participate, and release Striped World Charters, its owners, captain, and crew from any liability arising from health or motion-related conditions, to the fullest extent permitted by law. This summary is in addition to — and does not replace — our full `}
            <Link href="/policies/disclaimers" className="text-primary hover:underline">Disclaimers &amp; Liability</Link>
            {` and `}
            <Link href="/policies/refund" className="text-primary hover:underline">Refund Policy</Link>.
          </div>
        </motion.div>

        <div className="mt-10 p-5 bg-muted/30 rounded-lg border border-border/20 text-center">
          <p className="text-muted-foreground text-sm">
            Still have questions? Email{' '}
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
