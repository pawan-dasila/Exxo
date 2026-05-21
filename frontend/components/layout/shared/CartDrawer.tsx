"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/context/UIContext";
import {
  useCartItems,
  useRemoveFromCart,
  useCartSync,
} from "@/modules/cart/hooks";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CartDrawerHeader } from "./cart/CartDrawerHeader";
import { CartDrawerFooter } from "./cart/CartDrawerFooter";
import { CartItem } from "./cart/CartItem";
import { CartItemType } from "@/modules/cart/types/types";

export const CartDrawer = () => {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUI();
  const { data: cartItems = [], isLoading } = useCartItems();
  const { mutate: removeFromCart } = useRemoveFromCart();

  const { localQuantities, isSyncing, updateLocalQuantity, syncCart } =
    useCartSync(cartItems);

  const handleProceedToCheckout = async () => {
    try {
      await syncCart();
      closeCart();
      router.push("/checkout");
    } catch {
      // Error is handled in the hook (logger)
    }
  };

  const subtotal = cartItems.reduce((acc: number, item: CartItemType) => {
    const price = item.product_variants?.products?.base_price ?? 0;
    const quantity = localQuantities[item.id] ?? item.quantity;
    return acc + Number(price) * quantity;
  }, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        data-nosnippet
        className="w-full sm:max-w-[450px] p-0 flex flex-col gap-0 border-l border-border/40 shadow-2xl"
      >
        <CartDrawerHeader itemCount={cartItems.length} />

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
              {isLoading ? (
                <div className="h-[40vh] flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                      Looks like you haven&apos;t added any premium streetwear
                      to your collection yet.
                    </p>
                  </div>
                  <Button
                    variant="link"
                    onClick={closeCart}
                    className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item: CartItemType) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      localQuantity={localQuantities[item.id] ?? item.quantity}
                      isSyncing={isSyncing}
                      onUpdateQuantity={updateLocalQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {cartItems.length > 0 && (
          <CartDrawerFooter
            subtotal={subtotal}
            isSyncing={isSyncing}
            onCheckout={handleProceedToCheckout}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
