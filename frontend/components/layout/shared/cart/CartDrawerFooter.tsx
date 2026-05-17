"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { ElitePrice } from "@/components/ui/elite-price";

interface CartDrawerFooterProps {
  subtotal: number;
  isSyncing: boolean;
  onCheckout: () => Promise<void>;
}

export const CartDrawerFooter = ({
  subtotal,
  isSyncing,
  onCheckout,
}: CartDrawerFooterProps) => {
  return (
    <SheetFooter className="p-6 pt-4 border-t border-border/40 bg-muted/5 block shrink-0">
      <div className="space-y-3 mb-10">
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground/70 text-[13px] uppercase tracking-wider font-medium">
            Subtotal
          </span>
          <ElitePrice
            amount={subtotal}
            className="text-2xl font-bold tracking-tight"
          />
        </div>
        <div className="flex justify-between items-center text-[15px] text-muted-foreground/70 uppercase">
          <span>Shipping</span>
          <span className="text-[10px] text-muted-foreground/50 lowercase tracking-wider italic font-medium">
            Calculated at checkout
          </span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={isSyncing}
        className="w-full h-14 bg-foreground text-background rounded-full text-[15px] uppercase hover:bg-primary transition-all shadow-2xl shadow-foreground/10 group overflow-hidden relative border-none"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isSyncing ? (
            <>
              Syncing Collection...
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Proceed to Checkout
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      </Button>
    </SheetFooter>
  );
};
