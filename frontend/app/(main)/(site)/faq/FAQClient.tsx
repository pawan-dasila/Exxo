"use client";

import { useEffect, useState } from "react";
import { MailIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { FAQ_DATA } from "@/lib/config/faq";

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <span className="font-mono text-xs tracking-widest text-primary shrink-0">
        {number}
      </span>
      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

export function FAQClient() {
  const [activeSection, setActiveSection] = useState<string>("orders");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    FAQ_DATA.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 items-start">
      {/* Sticky TOC */}
      <aside
        className="hidden lg:block sticky top-24 self-start"
        aria-label="Table of contents"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Jump To
        </p>
        <nav>
          <ul className="space-y-1">
            {FAQ_DATA.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "flex items-center gap-3 text-xs font-medium transition-all py-2 group",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full border transition-all shrink-0",
                        isActive
                          ? "bg-primary border-primary"
                          : "border-primary/40 group-hover:bg-primary group-hover:border-primary",
                      )}
                    />
                    <span className="leading-snug">{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
            Still have questions?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Our team responds within 48 hours, Monday to Saturday.
          </p>
          <Link
            href={`mailto:${siteConfig.contact.email}`}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-2"
          >
            <MailIcon className="size-3" />
            {siteConfig.contact.email}
          </Link>
        </div>
      </aside>

      {/* ── FAQ Content ─────────────────────────────────────────── */}
      <main className="min-w-0 space-y-24">
        {FAQ_DATA.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <SectionHeading number={section.number} title={section.title} />
            <div className="w-full space-y-4">
              {section.questions.map((q, idx) => (
                <details
                  key={`${section.id}-q-${idx}`}
                  className="group border border-border rounded-xl px-6 bg-muted/20 open:bg-muted/30 transition-colors"
                >
                  <summary className="list-none text-sm font-bold text-left py-5 cursor-pointer flex justify-between items-center outline-none">
                    {q.question}
                    <span className="text-muted-foreground group-open:hidden transition-transform">
                      +
                    </span>
                    <span className="text-muted-foreground hidden group-open:block transition-transform">
                      -
                    </span>
                  </summary>
                  <div className="text-sm text-muted-foreground leading-relaxed pb-6 space-y-4">
                    {Array.isArray(q.answer) ? (
                      q.answer.map((para, pIdx) => <p key={pIdx}>{para}</p>)
                    ) : (
                      <p>{q.answer}</p>
                    )}
                    {q.isImportant && section.id === "orders" && (
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-xs font-medium italic">
                        Join the waitlist at the bottom of our home page to be
                        the first to know when Drop 002 goes live.
                      </div>
                    )}
                    {q.isImportant && section.id === "sizing" && (
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-xs font-medium italic">
                        When in doubt, refer to the size chart on each product
                        page. It includes chest, length, and shoulder
                        measurements.
                      </div>
                    )}
                    {q.isImportant && section.id === "returns" && (
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-xs font-medium italic">
                        To initiate an exchange, email{" "}
                        {siteConfig.contact.email}
                        with your Order ID and reason.
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
