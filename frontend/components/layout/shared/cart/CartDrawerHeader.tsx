"use client";

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export const CartDrawerHeader = ({ itemCount }: { itemCount: number }) => {
  return (
    <SheetHeader className="p-6 border-b border-border/40 shrink-0 text-left">
      <div aria-hidden="true" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SheetTitle className="text-xl font-medium text-foreground font-serif">
            Shopping Bag
          </SheetTitle>
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0.5 text-[10px] font-black"
          >
            {itemCount}
          </Badge>
        </div>
      </div>
      <SheetDescription className="sr-only">
        View your selected premium streetwear and manage your collection before
        checkout.
      </SheetDescription>
    </SheetHeader>
  );
};
