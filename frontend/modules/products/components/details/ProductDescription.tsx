"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExtendedProduct } from "./types";

interface ProductDescriptionProps {
  product: ExtendedProduct;
}

/**
 * "About this item" content block — no card wrapper, designed to be embedded.
 */
function ProductDescription({ product }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayDescription = product.description || "No description provided.";
  const words = displayDescription.split(" ");
  const needsTruncation = words.length > 50;
  const visibleText =
    !needsTruncation || isExpanded
      ? displayDescription
      : `${words.slice(0, 50).join(" ")}...`;

  return (
    <div className="space-y-2.5">
      <h2 className="text-sm uppercase font-bold text-neutral-950 tracking-wider">
        About this item
      </h2>
      <div className="text-sm leading-relaxed text-neutral-600 font-medium">
        <p>{visibleText}</p>

        {needsTruncation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-auto p-0 mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-transparent gap-1"
          >
            {isExpanded ? "Show less" : "Show more"}
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductDescription;
export { ProductDescription };
