import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtendedProduct } from "./types";

interface ProductSpecsProps {
  product: ExtendedProduct;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = product.specifications?.specs ?? [];

  // Don't render the card at all if no specs
  if (specs.length === 0) return null;

  return (
    <Card className="rounded-3xl border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="text-sm uppercase font-bold text-neutral-800 tracking-wider">
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specs.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 text-xs font-semibold text-neutral-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 border border-neutral-100 shadow-sm shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span>
                <span className="text-neutral-400">{label}: </span>
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
