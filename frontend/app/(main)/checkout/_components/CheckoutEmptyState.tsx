"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-background">
      <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
      <div className="max-w-md space-y-2">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-foreground">
          Bag Empty
        </h1>
        <p className="text-muted-foreground text-xs font-medium">
          Your collection is waiting to be built.
        </p>
      </div>
      <Link
        href="/products"
        className="text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 bg-foreground text-background rounded-full hover:bg-primary transition-all"
      >
        Explore Collection
      </Link>
    </div>
  );
}
