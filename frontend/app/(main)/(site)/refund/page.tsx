import { type Metadata } from "next";
import Link from "next/link";
import {
  RefreshCcwIcon,
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy",
  description: "Vestrostyles Refund & Exchange Policy — 7-day exchange window and store credit model.",
  alternates: { canonical: "/refund" },
};

const EFFECTIVE_DATE = "April 11, 2026";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-5">
            <RefreshCcwIcon className="size-4 text-primary" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary">
              Policy
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-foreground mb-4">
            Refund & <span className="text-primary">Exchange</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-8">
            We want you to love your Vestrostyles pieces. If the fit isn&apos;t right, we offer a straightforward exchange process.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="font-mono text-xs">Effective: {EFFECTIVE_DATE}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">01. The Basics</h2>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <CheckCircle2Icon className="size-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm uppercase tracking-wide mb-1 text-foreground">7-Day Exchange Window</p>
                <p className="text-sm text-muted-foreground">Requests must be initiated within 7 days of delivery.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <RefreshCcwIcon className="size-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm uppercase tracking-wide mb-1 text-foreground">Store Credit Model</p>
                <p className="text-sm text-muted-foreground">We do not offer cash refunds. All returns result in non-transferable store credit (valid for 12 months).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <XCircleIcon className="size-5 text-destructive shrink-0" />
              <div>
                <p className="font-semibold text-sm uppercase tracking-wide mb-1 text-foreground">Final Sale Items</p>
                <p className="text-sm text-muted-foreground">Discounted items and limited drop launches are final sale and non-eligible for exchange.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-10" />

        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">02. Exchange Eligibility</h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc ml-4">
            <li>Products must be unused, unwashed, and in original condition.</li>
            <li>All original tags and labels must be intact.</li>
            <li>Must be returned in original Vestrostyles packaging.</li>
            <li>Size exchanges are subject to stock availability.</li>
          </ul>
        </section>

        <Separator className="my-10" />

        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">03. Defective or Wrong Items</h2>
          <p className="text-sm text-muted-foreground mb-4">
            If you receive a damaged or incorrect product, report it within <strong>48 hours</strong> with photo proof. We will replace it at no cost or issue a full refund if a replacement is unavailable.
          </p>
          <Alert className="border-primary/30 bg-primary/5">
            <InfoIcon className="size-4 text-primary" />
            <AlertTitle className="text-primary text-xs font-semibold uppercase">Action Required</AlertTitle>
            <AlertDescription className="text-sm">
              Email <Link href={`mailto:${siteConfig.contact.email}`} className="underline font-medium">{siteConfig.contact.email}</Link> with your Order ID and photos to initiate.
            </AlertDescription>
          </Alert>
        </section>

        <Separator className="my-10" />

        <section>
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">04. Process</h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="font-mono text-xs text-primary bg-primary/10 size-6 rounded flex items-center justify-center shrink-0">1</span>
              <p className="text-sm text-muted-foreground pt-0.5">Email us to request an Exchange Authorisation Code.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs text-primary bg-primary/10 size-6 rounded flex items-center justify-center shrink-0">2</span>
              <p className="text-sm text-muted-foreground pt-0.5">Ship the product back to us (customer covers return shipping).</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs text-primary bg-primary/10 size-6 rounded flex items-center justify-center shrink-0">3</span>
              <p className="text-sm text-muted-foreground pt-0.5">Once approved via QC, we ship the new size or issue store credit.</p>
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
