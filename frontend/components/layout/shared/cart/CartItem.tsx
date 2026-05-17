"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { CartItem as CartItemType } from "@/modules/cart/types";
import { ElitePrice } from "@/components/ui/elite-price";

type CartItemType = {
  id: string;
  quantity: number;
  product_variants: {
    products: {
      id: string;
      title: string;
      image_url: string;
      base_price: string;
    };
    size: string;
    color_name: string;
  };
};

interface CartItemProps {
  item: CartItemType;
  localQuantity: number;
  isSyncing: boolean;
  onUpdateQuantity: (id: string, currentQty: number, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  item,
  localQuantity,
  isSyncing,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const product = item.product_variants?.products;
  const variant = item.product_variants;
  if (!product || !variant) return null;

  return (
    <div className="flex gap-6 group animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="relative w-24 h-32 bg-muted/20 rounded-2xl overflow-hidden shrink-0 border border-border/40 shadow-sm group-hover:shadow-md transition-all duration-500">
        <Image
          src={product.image_url ?? "/placeholder.png"}
          alt={product.title ?? "Product"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="96px"
        />
      </div>
      <div className="flex flex-col justify-between flex-1 py-1">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-xs uppercase tracking-tight text-foreground transition-colors pr-4 line-clamp-2">
              {product.title ?? "Unknown Product"}
            </h3>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(item.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 py-1">
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 rounded-sm bg-muted/40 border-border/40"
            >
              {variant.size ?? "Standard"}
            </Badge>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 rounded-sm bg-muted/40 border-border/40"
            >
              {variant.color_name ?? "Default"}
            </Badge>
          </div>
          <ElitePrice
            amount={Number(product.base_price ?? 0)}
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center bg-muted/20 rounded-full border border-border/40 p-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onUpdateQuantity(item.id, item.quantity ?? 1, -1)}
              disabled={isSyncing}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background shadow-xs active:scale-95 transition-all"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-[10px] font-black text-foreground">
              {localQuantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onUpdateQuantity(item.id, item.quantity ?? 1, 1)}
              disabled={isSyncing}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background shadow-xs active:scale-95 transition-all"
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
