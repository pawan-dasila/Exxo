import { type Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon, InfoIcon } from "lucide-react";

import { siteConfig } from "@/lib/config/site";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Vestrostyles Terms & Conditions — The rules and guidelines for using our platform.",
  alternates: { canonical: "/terms" },
};

const EFFECTIVE_DATE = "April 26, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheckIcon className="size-4 text-primary" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary">
              Legal
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-foreground mb-4">
            Terms & <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-8">
            By using Vestrostyles, you agree to these terms. Please read them carefully before placing an order.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="font-mono text-xs">Effective: {EFFECTIVE_DATE}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">01. General Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Vestrostyles provides premium streetwear products through this website. We reserve the right to refuse service to anyone for any reason at any time.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc ml-4">
            <li>You must be at least 18 years old to use this site.</li>
            <li>You agree not to reproduce, duplicate, or resell any part of our service or products.</li>
            <li>We reserve the right to update or modify these terms at any time.</li>
          </ul>
        </section>

        <Separator className="my-10" />

        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">02. Products & Pricing</h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc ml-4">
            <li>All prices are inclusive of applicable taxes unless stated otherwise.</li>
            <li>We make every effort to display product colours and details accurately, but screen variations may occur.</li>
            <li>Product availability is limited (drop-based). We do not guarantee restocks.</li>
          </ul>
        </section>

        <Separator className="my-10" />

        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">03. Shipping & Delivery</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Shipping costs and timelines are calculated at checkout. We are not responsible for delays caused by logistics partners or customs.
          </p>
          <Alert className="border-primary/30 bg-primary/5">
            <InfoIcon className="size-4 text-primary" />
            <AlertTitle className="text-primary text-xs font-semibold uppercase">Tracking</AlertTitle>
            <AlertDescription className="text-sm">
              Tracking details are emailed once your order is dispatched.
            </AlertDescription>
          </Alert>
        </section>

        <Separator className="my-10" />

        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">04. Liability & Governing Law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Vestrostyles is not liable for any indirect or consequential damages arising from the use of our products.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in New Delhi.
          </p>
        </section>

        <Separator className="my-10" />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="size-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Contact</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Questions about the Terms should be sent to us at <Link href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">{siteConfig.contact.email}</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
