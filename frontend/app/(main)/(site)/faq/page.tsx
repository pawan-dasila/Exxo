import { type Metadata } from "next";
import { HelpCircleIcon } from "lucide-react";
import { FAQClient } from "./FAQClient";
import { FAQ_DATA } from "@/lib/config/faq";
import { sanitizeJsonLd } from "@/utils/security";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about VestroStyles drops, sizing, shipping, and returns. Clear answers for a premium streetwear experience.",
  keywords: [
    "Vestrostyles FAQ",
    "Streetwear help",
    "Drop information",
    "Shipping times India",
    "Returns and exchanges",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Vestrostyles",
    description:
      "Answers to your questions about VestroStyles drops, quality, and service.",
    url: "/faq",
    siteName: "Vestrostyles",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAQ — Vestrostyles",
    description: "Got questions? We've got answers.",
  },
  robots: { index: true, follow: true },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.flatMap((section) =>
      section.questions.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: Array.isArray(q.answer) ? q.answer.join(" ") : q.answer,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
      />
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircleIcon className="size-4 text-primary" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary">
              Support Center
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-foreground mb-4">
            Common Questions
          </h1>

          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Everything you need to know about our drops, sizing, and service. If
            you can&apos;t find what you&apos;re looking for, reach out to our
            team.
          </p>
        </div>
      </header>

      <FAQClient />
    </div>
  );
}
