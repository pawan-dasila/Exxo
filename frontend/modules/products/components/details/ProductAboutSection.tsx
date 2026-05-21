"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedProduct } from "./types";

const PREVIEW_WORD_COUNT = 20;

interface ProductAboutSectionProps {
  product: ExtendedProduct;
}

export function ProductAboutSection({ product }: ProductAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const description = product.description || "No description provided.";
  const words = description.split(" ");
  const isTruncated = words.length > PREVIEW_WORD_COUNT;
  const previewText = isTruncated
    ? `${words.slice(0, PREVIEW_WORD_COUNT).join(" ")}...`
    : description;

  // Use real specs from DB, fall back to empty
  const specs = product.specifications?.specs ?? [];
  const hasSpecs = specs.length > 0;

  return (
    <div className="space-y-3">
      <h2 className="text-sm uppercase font-bold text-neutral-950 tracking-wider">
        About this item
      </h2>

      <p className="text-sm leading-relaxed text-neutral-600 font-medium">
        {expanded ? description : previewText}
      </p>

      {/* {expanded && hasSpecs && (
        <ul className="space-y-1.5 mt-1">
          {specs.map((spec) => (
            <li
              key={spec.label}
              className="flex items-start gap-2 text-xs font-semibold text-neutral-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span className="text-neutral-500 min-w-[80px]">{spec.label}:</span>
              <span>{spec.value}</span>
            </li>
          ))}
        </ul>
      )} */}

      {(isTruncated || hasSpecs) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((prev) => !prev)}
          className="h-auto p-0 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-transparent gap-1"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
