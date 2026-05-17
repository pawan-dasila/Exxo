import { type Metadata } from "next";
import Link from "next/link";
import {
  InfoIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Vestrostyles Privacy Policy — How we collect, use, and protect your personal data. Fully compliant with India's Digital Personal Data Protection (DPDP) Act 2023.",
  keywords: [
    "Vestrostyles Privacy Policy",
    "DPDP Act 2023 Compliance",
    "Data Protection India",
    "Personal Data Vestrostyles",
  ],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Vestrostyles",
    description:
      "How we collect, use, and protect your personal data. Compliant with India's DPDP Act 2023.",
    url: "/privacy",
    siteName: "Vestrostyles",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — Vestrostyles",
    description: "How Vestrostyles collects and protects your personal data.",
  },
  robots: { index: true, follow: true },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EFFECTIVE_DATE = "April 11, 2026";
const VERSION = "1.1.0";

// ─── Helper: Policy Table ─────────────────────────────────────────────────────

function PolicyTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground py-3 whitespace-nowrap"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={ri} className="hover:bg-accent/40">
              {row.map((cell, ci) => (
                <TableCell
                  key={ci}
                  className="text-sm text-foreground/80 leading-relaxed py-3 align-top whitespace-normal"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Helper: Info Alert ───────────────────────────────────────────────────────

function NoteAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="mb-6 border-primary/30 bg-primary/5">
      <InfoIcon className="size-4 text-primary" />
      <AlertTitle className="text-primary text-xs font-semibold uppercase tracking-widest">
        Note
      </AlertTitle>
      <AlertDescription className="text-sm text-foreground/70 leading-relaxed">
        {children}
      </AlertDescription>
    </Alert>
  );
}

function WarningAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="mb-6 border-amber-400/50 bg-amber-50/60 dark:bg-amber-950/20">
      <AlertTriangleIcon className="size-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-widest">
        Notice
      </AlertTitle>
      <AlertDescription className="text-sm text-foreground/70 leading-relaxed">
        {children}
      </AlertDescription>
    </Alert>
  );
}

function ImportantAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="mb-6 border-blue-400/50 bg-blue-50/60 dark:bg-blue-950/20">
      <ArrowRightIcon className="size-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest">
        Security Practice
      </AlertTitle>
      <AlertDescription className="text-sm text-foreground/70 leading-relaxed">
        {children}
      </AlertDescription>
    </Alert>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="font-mono text-xs tracking-widest text-primary shrink-0">
        {number}
      </span>
      <h2 className="text-base font-semibold uppercase tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground mt-8 mb-3">
      {children}
    </h3>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-foreground/70 mb-4">
      {children}
    </p>
  );
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { id: "statutory-notice", number: "01", title: "Statutory Notice" },
  { id: "data-fiduciary", number: "02", title: "Data Fiduciary" },
  { id: "data-collected", number: "03", title: "Data We Collect" },
  { id: "how-we-collect", number: "04", title: "How We Collect" },
  { id: "how-we-use", number: "05", title: "How Data Is Used" },
  { id: "consent", number: "06", title: "Consent & Withdrawal" },
  { id: "processors", number: "07", title: "Third-Party Processors" },
  { id: "retention", number: "08", title: "Retention Schedule" },
  { id: "security", number: "09", title: "Security" },
  { id: "your-rights", number: "10", title: "Your Rights" },
  { id: "dark-patterns", number: "11", title: "Anti-Dark Patterns" },
  { id: "ai-disclosure", number: "12", title: "AI Disclosure" },
  { id: "cookies", number: "13", title: "Cookies & Tracking" },
  { id: "children", number: "14", title: "Children's Privacy" },
  { id: "changes", number: "15", title: "Policy Changes" },
  { id: "contact", number: "16", title: "Contact & Grievance" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy — Vestrostyles",
    description:
      "Vestrostyles Privacy Policy compliant with India's DPDP Act 2023.",
    url: `${siteConfig.url}/privacy`,
    dateModified: EFFECTIVE_DATE,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="border-b border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheckIcon className="size-4 text-primary" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-primary">
                Legal Document
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-foreground mb-4">
              Privacy Policy
            </h1>

            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-8">
              A complete, verified account of every piece of data Vestrostyles
              collects, why it is collected, how it is protected, and what
              rights you hold under Indian law.
            </p>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="font-mono text-xs">
                Version {VERSION}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Effective {EFFECTIVE_DATE}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                DPDP Act 2023
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                DPDP Rules 2025
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                IT Amendment Rules 2026
              </Badge>
            </div>
          </div>
        </header>

        {/* ── Layout ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 items-start">
          {/* Sticky TOC */}
          <aside
            className="hidden lg:block sticky top-24 self-start"
            aria-label="Table of contents"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Contents
            </p>
            <nav>
              <ol className="space-y-0.5">
                {TOC_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1 group"
                    >
                      <span className="font-mono text-[10px] text-primary/40 group-hover:text-primary transition-colors w-5 shrink-0">
                        {item.number}
                      </span>
                      <span className="leading-snug">{item.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* ── Policy Body ─────────────────────────────────────────── */}
          <main id="policy-content" className="min-w-0">
            {/* 01 */}
            <section id="statutory-notice" aria-labelledby="h-statutory">
              <SectionHeading
                number="01"
                title="Statutory Notice & Accessibility"
              />
              <Prose>
                In accordance with{" "}
                <strong>Section 5 of the DPDP Act 2023</strong>, this Privacy
                Policy is provided in English to the Data Principal (you).
                Vestrostyles is legally committed to providing this document in
                any of the{" "}
                <strong>
                  22 languages listed in the Eighth Schedule to the Constitution
                  of India
                </strong>{" "}
                upon request.
              </Prose>
              <NoteAlert>
                To request this document in a specific regional language,
                contact our Grievance Officer at{" "}
                <Link
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-primary underline"
                >
                  {siteConfig.contact.email}
                </Link>
                .
              </NoteAlert>
            </section>

            <Separator className="my-10" />

            {/* 02 */}
            <section id="data-fiduciary" aria-labelledby="h-fiduciary">
              <SectionHeading
                number="02"
                title="Data Fiduciary Identification"
              />
              <Prose>
                Vestrostyles operates as the <strong>Data Fiduciary</strong>,
                determining the purpose and means of processing your personal
                data.
              </Prose>
              <PolicyTable
                headers={["Field", "Details"]}
                rows={[
                  [
                    "Legal Entity Name",
                    siteConfig.business.tradeName,
                  ],
                  [
                    "Registered Office",
                    siteConfig.business.address.full,
                  ],
                  ["Brand Name", siteConfig.business.tradeName],
                  ["Official Website", siteConfig.url.replace("https://", "")],
                  ["Support Email", siteConfig.contact.email],
                  [
                    "Grievance Officer",
                    `${siteConfig.business.legalName}, Grievance Redressal Officer`,
                  ],
                  ["Grievance Email", siteConfig.contact.email],
                ]}
              />
            </section>

            <Separator className="my-10" />

            {/* 03 */}
            <section id="data-collected" aria-labelledby="h-data">
              <SectionHeading
                number="03"
                title="What Data We Collect — Complete & Verified"
              />
              <Prose>
                We follow the principle of <strong>Data Minimisation</strong> —
                collecting only what is strictly necessary. The following is a
                verified record of every category of personal data our platform
                processes.
              </Prose>

              <Accordion
                type="multiple"
                className="border border-border rounded-lg mb-6 divide-y divide-border"
              >
                {/* 3.1 */}
                <AccordionItem value="account" className="px-4">
                  <AccordionTrigger className="text-sm font-semibold">
                    3.1 — Account & Contact Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <PolicyTable
                      headers={["Data Item", "Reason Collected"]}
                      rows={[
                        [
                          "Full Name",
                          "Personalisation and order confirmation emails",
                        ],
                        [
                          "Email Address",
                          "Account access, order updates, and drop notifications",
                        ],
                        [
                          "Phone Number",
                          "SMS alerts for waitlisted drops and delivery coordination",
                        ],
                        [
                          "Password",
                          "Securely hashed and salted — we never store raw passwords",
                        ],
                        [
                          "Avatar (optional)",
                          "Profile personalisation",
                        ],
                      ]}
                    />
                    <NoteAlert>
                      We follow the principle of <strong>Data Minimisation</strong>. We only ask for information strictly required to fulfil your order or provide requested updates.
                    </NoteAlert>
                  </AccordionContent>
                </AccordionItem>

                {/* 3.3 */}
                <AccordionItem value="address" className="px-4">
                  <AccordionTrigger className="text-sm font-semibold">
                    3.2 — Shipping & Order Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <PolicyTable
                      headers={["Data Item", "Reason Collected"]}
                      rows={[
                        [
                          "Shipping & Billing Address",
                          "Physical delivery of orders and GST compliance",
                        ],
                        [
                          "Recipient Contact",
                          "Name and phone number for delivery coordination",
                        ],
                        [
                          "Order Contents & Status",
                          "Fulfilment tracking and invoice generation",
                        ],
                        [
                          "Transaction Amount",
                          "Invoicing and tax reporting",
                        ],
                      ]}
                    />
                  </AccordionContent>
                </AccordionItem>



                {/* 3.5 */}
                <AccordionItem value="payments" className="px-4">
                  <AccordionTrigger className="text-sm font-semibold">
                    3.3 — Payment Transaction Identifiers
                  </AccordionTrigger>
                  <AccordionContent>
                    <Prose>
                      We use <strong>PCI-DSS compliant payment partners</strong> for secure transactions. We{" "}
                      <strong>
                        do not store your card number, CVV, or banking
                        credentials
                      </strong>
                      .
                    </Prose>
                    <PolicyTable
                      headers={["Data Item", "Reason Collected"]}
                      rows={[
                        [
                          "Payment Reference IDs",
                          "Verifying and linking your payment to your order",
                        ],
                        [
                          "Payment Method & Status",
                          "Financial record-keeping and order fulfilment",
                        ],
                      ]}
                    />
                    <ImportantAlert>
                      Every payment is verified server-to-server using{" "}
                      <strong>
                        secure cryptographic signature verification
                      </strong>{" "}
                      before your order is confirmed. We also re-fetch the
                      transaction details directly from our payment partner&apos;s
                      servers to prevent client-side tampering. We never trust
                      client-reported payment status.
                    </ImportantAlert>
                  </AccordionContent>
                </AccordionItem>

                {/* 3.6 */}
                <AccordionItem value="technical" className="px-4">
                  <AccordionTrigger className="text-sm font-semibold">
                    3.4 — Standard Technical Logs
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm text-foreground/70 space-y-2 mb-4 ml-4 list-disc">
                      <li>
                        <strong>Session Cookies:</strong> Temporary identifiers
                        to keep you logged in.
                      </li>
                      <li>
                        <strong>Security Logs:</strong> Transient recording of
                        technical identifiers (like IP address) to prevent bot
                        abuse and fraud.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* 3.7 */}
                <AccordionItem value="shopping" className="px-4">
                  <AccordionTrigger className="text-sm font-semibold">
                    3.5 — Feedback & Cart Data
                  </AccordionTrigger>
                  <AccordionContent>
                    <PolicyTable
                      headers={["Data Item", "Reason Collected"]}
                      rows={[
                        [
                          "Cart Contents",
                          "Persisting your shopping bag across visits",
                        ],
                        [
                          "Product Reviews",
                          "Displaying your feedback and ratings on our products",
                        ],
                      ]}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <Separator className="my-10" />

            {/* 04 */}
            <section id="how-we-collect" aria-labelledby="h-collection">
              <SectionHeading number="04" title="How We Collect Data" />
              <PolicyTable
                headers={["Method", "What It Collects"]}
                rows={[
                  ["Account Registration Form", "Full name, email, password"],
                  ["Waitlist Sign-Up Form", "Email, phone number"],
                  ["Profile Update Form", "Full name, avatar (optional)"],
                  [
                    "Checkout Address Forms",
                    "Full shipping / billing address details",
                  ],
                  [
                    "Authorised Payment Gateway",
                    "Payment method and unique transaction IDs (processed server-side)",
                  ],
                  ["Product Reviews Form", "Star rating, written review text"],
                  [
                    "Middleware & Infrastructure (automatic)",
                    "IP address (transient), user-agent (transient), session cookies",
                  ],
                ]}
              />
            </section>

            <Separator className="my-10" />

            {/* 05 */}
            <section id="how-we-use" aria-labelledby="h-use">
              <SectionHeading number="05" title="How Your Data Is Used" />
              <Prose>
                We use your personal data <strong>solely</strong> for the
                following declared purposes:
              </Prose>
              <div className="grid gap-3 mb-6">
                {[
                  {
                    num: "01",
                    title: "Order Processing & Fulfilment",
                    desc: "Processing your purchase, coordinating with authorised logistics partners, and sending order confirmation updates.",
                  },
                  {
                    num: "02",
                    title: "Authentication & Account Security",
                    desc: "Managing your login session, email verification, and protecting your account through secure cloud infrastructure.",
                  },
                  {
                    num: "03",
                    title: "Customer Communication",
                    desc: "Sending transactional emails only (order confirmations, waitlist confirmations). We do not send marketing emails without a separate explicit opt-in.",
                  },
                  {
                    num: "04",
                    title: "Payment Verification & Fraud Prevention",
                    desc: "Secure cryptographic verification of every transaction through our payment processing partners before order confirmation.",
                  },
                  {
                    num: "05",
                    title: "Shipping Rate Calculation",
                    desc: "Passing your postal code to logistics rate engines to calculate and display dynamic shipping costs at checkout.",
                  },
                  {
                    num: "06",
                    title: "Legal & Tax Compliance",
                    desc: "Retaining transaction records as required under the GST Act and Indian accounting regulations.",
                  },
                  {
                    num: "07",
                    title: "Security Monitoring",
                    desc: "Logging technical identifiers on access to sensitive routes for intrusion and abuse prevention.",
                  },
                  {
                    num: "08",
                    title: "Platform Improvement",
                    desc: "Aggregate, non-identifiable analytics on order patterns. No individual profiling.",
                  },
                ].map(({ num, title, desc }) => (
                  <Card key={num} size="sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="font-mono text-xs text-primary">
                          {num}
                        </span>
                        <span className="text-sm text-foreground">{title}</span>
                      </CardTitle>
                      <CardDescription className="text-sm ml-7">
                        {desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>

            <Separator className="my-10" />

            {/* 06 */}
            <section id="consent" aria-labelledby="h-consent">
              <SectionHeading
                number="06"
                title="Consent Management & Right to Withdraw"
              />
              <Prose>
                <strong>Basis of Processing:</strong> Your data is processed on
                the basis of <strong>Explicit Consent</strong>, obtained when
                you create an account (Terms &amp; Conditions checkbox) or
                submit the waitlist form.
              </Prose>
              <Prose>
                <strong>Right to Withdraw:</strong> You may withdraw consent at
                any time by emailing{" "}
                <Link
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-primary underline"
                >
                  {siteConfig.contact.email}
                </Link>{" "}
                or navigating to Account Settings to request deletion.
              </Prose>
              <WarningAlert>
                Withdrawing consent for essential operational data (e.g.,
                shipping address on an active order) will result in the{" "}
                <strong>immediate cancellation of that order</strong>.
                Transaction records required under Indian law (GST Act) will be
                retained for the mandatory <strong>7-year period</strong> even
                after account deletion.
              </WarningAlert>
            </section>

            <Separator className="my-10" />

            {/* 07 */}
            <section id="processors" aria-labelledby="h-processors">
              <SectionHeading
                number="07"
                title="Data Processors & Third-Party Disclosures"
              />
              <Prose>
                We share your data only with authorised, vetted{" "}
                <strong>Data Processors</strong> who process data strictly on
                our behalf:
              </Prose>
              <PolicyTable
                headers={["Service Category", "Data Shared", "Purpose"]}
                rows={[
                  [
                    "Payment Processing Services",
                    "Contact info and order amount",
                    "Secure payment processing. We never store raw card numbers.",
                  ],
                  [
                    "Cloud Infrastructure Providers",
                    "All stored personal data",
                    "Secure database and authentication infrastructure.",
                  ],
                  [
                    "Logistics & Delivery Partners",
                    "Shipping address and contact info",
                    "Physical delivery of your orders.",
                  ],
                  [
                    "Email & Notification Services",
                    "Name and email address",
                    "Sending transactional and waitlist emails.",
                  ],
                ]}
              />
              <NoteAlert>
                <strong>Legal Disclosure:</strong> We may disclose your data if
                required by a valid court order or competent authority under
                Indian law. We will notify you to the extent permitted by law.
              </NoteAlert>
            </section>

            <Separator className="my-10" />

            {/* 08 */}
            <section id="retention" aria-labelledby="h-retention">
              <SectionHeading number="08" title="Data Retention Schedule" />
              <PolicyTable
                headers={["Data Category", "Retention Period", "Justification"]}
                rows={[
                  [
                    "Financial & Legal Records (Orders, Invoices)",
                    "7 years",
                    "Mandatory compliance — GST Act and Income Tax Act",
                  ],
                  [
                    "Account Profile & Settings",
                    "Until account deletion",
                    "Providing platform services and account management",
                  ],
                  [
                    "Waitlist & Marketing Data",
                    "Until drop concludes or opt-out",
                    "Product launch notifications",
                  ],
                  [
                    "Security & Audit Logs",
                    "Up to 1 year",
                    "Security governance and fraud prevention",
                  ],
                ]}
              />
            </section>

            <Separator className="my-10" />

            {/* 09 */}
            <section id="security" aria-labelledby="h-security">
              <SectionHeading
                number="09"
                title="Security Commitment"
              />
              <Prose>
                We implement <strong>appropriate technical and organisational measures</strong> to ensure a level of security appropriate to the risk of processing your personal data.
              </Prose>
              <ul className="text-sm text-foreground/70 space-y-2 mb-6 ml-4 list-disc">
                <li>
                  <strong>Encryption:</strong> We use industry-standard encryption protocols (TLS) for data in transit and at rest.
                </li>
                <li>
                  <strong>Access Controls:</strong> Strict internal access policies ensure that your data is only accessible to authorised personnel on a need-to-know basis.
                </li>
                <li>
                  <strong>Payment Security:</strong> All payments are processed through PCI-DSS compliant partners. We never store raw card or banking credentials.
                </li>
              </ul>
              <SubHeading>Breach Response Protocol</SubHeading>
              <Prose>
                In the event of a personal data breach, Vestrostyles will notify the{" "}
                <strong>Data Protection Board of India</strong> within the statutory period (typically 72 hours of discovery) and will inform affected users as required by law.
              </Prose>
            </section>

            <Separator className="my-10" />

            {/* 10 */}
            <section id="your-rights" aria-labelledby="h-rights">
              <SectionHeading
                number="10"
                title="Your Rights as Data Principal"
              />
              <Prose>Under the DPDP Act 2023, you are entitled to:</Prose>
              <PolicyTable
                headers={["Right", "How to Exercise"]}
                rows={[
                  [
                    "Right to Access",
                    `Email ${siteConfig.contact.email} to receive a summary of your data being processed`,
                  ],
                  [
                    "Right to Correction",
                    `Log in → Account Settings → Edit Profile; or email ${siteConfig.contact.email}`,
                  ],
                  [
                    "Right to Erasure (Account Deletion)",
                    `Email ${siteConfig.contact.email} with subject: 'Account Deletion Request'. We erase within 30 days, subject to legal retention requirements.`,
                  ],
                  [
                    "Right to Nomination",
                    `Designate someone to exercise your rights in event of death or incapacity. Contact ${siteConfig.contact.email}.`,
                  ],
                  [
                    "Right to Grievance Redressal",
                    "If unresolved within 30 days, escalate to the Data Protection Board of India.",
                  ],
                ]}
              />
            </section>

            <Separator className="my-10" />

            {/* 11 */}
            <section id="dark-patterns" aria-labelledby="h-dark">
              <SectionHeading
                number="11"
                title="Anti-Dark Pattern Commitment"
              />
              <Prose>
                Vestrostyles fully adheres to the{" "}
                <strong>
                  CCPA Guidelines for Prevention and Regulation of Dark Patterns
                  2023
                </strong>
                :
              </Prose>
              <PolicyTable
                headers={["Commitment", "Implementation"]}
                rows={[
                  [
                    "No Basket Sneaking",
                    "Only items you explicitly add are included. We never add products, insurance, or add-ons without your active selection.",
                  ],
                  [
                    "No Hidden Charges",
                    "Shipping cost is calculated and displayed transparently before payment confirmation.",
                  ],
                  [
                    "No Forced Continuity",
                    "Vestrostyles does not offer subscription products at this time.",
                  ],
                  [
                    "Transparent Pricing",
                    "The price displayed on the product page is the price you pay.",
                  ],
                  [
                    "Clear Consent",
                    "All consent checkboxes are unchecked by default and require your active selection.",
                  ],
                ]}
              />
            </section>

            <Separator className="my-10" />

            {/* 12 */}
            <section id="ai-disclosure" aria-labelledby="h-ai">
              <SectionHeading
                number="12"
                title="Mandatory AI & Synthetic Content Disclosure"
              />
              <Prose>
                In accordance with the <strong>IT Amendment Rules 2026</strong>:
              </Prose>
              <ul className="text-sm text-foreground/70 space-y-3 mb-6 ml-4 list-disc">
                <li>
                  <strong>Synthetic Media:</strong> If Vestrostyles uses
                  AI-generated imagery for product models, backgrounds, or
                  promotional content, it will be clearly labelled as{" "}
                  <em>&ldquo;Synthetically Generated&rdquo;</em> or{" "}
                  <em>&ldquo;AI-Generated Image&rdquo;</em> adjacent to the
                  content.
                </li>
                <li>
                  <strong>Automated Decisions:</strong> We do not use fully
                  automated decision-making processes that significantly affect
                  your legal rights without human oversight.
                </li>
                <li>
                  <strong>AI in Commerce:</strong> Product recommendations (if
                  any) use aggregate, non-personal signals. No individual
                  profiling is used for discriminatory pricing.
                </li>
              </ul>
            </section>

            <Separator className="my-10" />

            {/* 13 */}
            <section id="cookies" aria-labelledby="h-cookies">
              <SectionHeading number="13" title="Cookies & Tracking" />
              <PolicyTable
                headers={["Cookie", "Type", "Purpose", "Duration"]}
                rows={[
                  [
                    "Session Cookie",
                    "Strictly Necessary",
                    "Keeps you authenticated across pages",
                    "Until logout / expiry",
                  ],
                  [
                    "Auth Token",
                    "Strictly Necessary",
                    "Secure auth token — inaccessible to JavaScript",
                    "Session",
                  ],
                ]}
              />
              <NoteAlert>
                Vestrostyles uses <strong>Google Analytics</strong> to monitor platform performance and aggregate analytics to improve your experience. We do not engage in individual user profiling or utilize Facebook Pixel for advertising tracking.
              </NoteAlert>
            </section>

            <Separator className="my-10" />

            {/* 14 */}
            <section id="children" aria-labelledby="h-children">
              <SectionHeading number="14" title="Children's Privacy" />
              <Prose>
                Vestrostyles is not directed at individuals under the age of{" "}
                <strong>18 years</strong>. We do not knowingly collect personal
                data from minors. If you believe a child has submitted data to
                us, contact{" "}
                <Link
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-primary underline"
                >
                  {siteConfig.contact.email}
                </Link>{" "}
                immediately for prompt deletion.
              </Prose>
            </section>

            <Separator className="my-10" />

            {/* 15 */}
            <section id="changes" aria-labelledby="h-changes">
              <SectionHeading number="15" title="Changes to This Policy" />
              <Prose>
                We may update this Privacy Policy when our data practices
                change:
              </Prose>
              <ul className="text-sm text-foreground/70 space-y-2 mb-6 ml-4 list-disc">
                <li>
                  The <strong>&ldquo;Last Updated&rdquo;</strong> date at the
                  top will be revised
                </li>
                <li>
                  A notice will be displayed on the website for{" "}
                  <strong>14 days</strong> after any material change
                </li>
                <li>
                  For significant changes, we will email all registered users
                </li>
              </ul>
              <Prose>
                Continued use of our platform after a policy update constitutes
                acceptance of the revised terms.
              </Prose>
            </section>

            <Separator className="my-10" />

            {/* 16 */}
            <section id="contact" aria-labelledby="h-contact">
              <SectionHeading
                number="16"
                title="Contact & Grievance Redressal"
              />
              <PolicyTable
                headers={["Field", "Details"]}
                rows={[
                  ["Grievance Officer", siteConfig.business.legalName],
                  ["Designation", "Grievance Redressal Officer"],
                  ["Email", siteConfig.contact.email],
                  ["Response Time", "Within 30 days of receipt"],
                  [
                    "Registered Address",
                    siteConfig.business.address.full,
                  ],
                ]}
              />
              <NoteAlert>
                If your grievance is not resolved within 30 days, you may
                escalate to the <strong>Data Protection Board of India</strong>.
              </NoteAlert>
            </section>

            {/* Footer stamp */}
            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-primary shrink-0" />
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                  v{VERSION} — Vestrostyles Legal Team — {EFFECTIVE_DATE}
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Codebase-verified
              </Badge>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
