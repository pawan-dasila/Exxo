"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

interface CheckoutTransientErrorProps {
  orderId: string;
  paymentId: string;
}

export function CheckoutTransientError({
  orderId,
  paymentId,
}: CheckoutTransientErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-background">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
      </div>
      <div className="max-w-md space-y-3">
        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
          Payment Received
        </h1>
        <p className="text-muted-foreground text-xs font-medium leading-relaxed">
          Your payment was successful, but we encountered a technical issue
          confirming your order. This is usually resolved automatically within a
          few minutes.
        </p>
        <div className="mt-4 bg-muted/30 rounded-xl p-4 text-left space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Your Reference IDs
          </p>
          <p className="text-xs font-mono text-foreground">
            Order: {orderId.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs font-mono text-foreground">
            Payment: {paymentId}
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed">
          Please save these IDs. If your order is not confirmed within 30
          minutes, contact us at{" "}
          <Link
            href={`mailto:${siteConfig.contact.email}`}
            className="underline"
          >
            {siteConfig.contact.email}
          </Link>
          .
        </p>

      </div>
      <Link
        href="/orders"
        className="text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 bg-foreground text-background rounded-full hover:bg-primary transition-all"
      >
        Check My Orders
      </Link>
    </div>
  );
}
