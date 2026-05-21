import React from "react";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { ProductRentalCard } from "./ProductRentalCard";
import { WhyRentExxo } from "./WhyRentExxo";
import { ExtendedProduct } from "./types";

interface ProductDetailContainerProps {
  product: ExtendedProduct;
}

export function ProductDetailContainer({ product }: ProductDetailContainerProps) {
  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-neutral-800 antialiased">
      <ProductBreadcrumbs product={product} />

      {/* ════════════════════════════════
          DESKTOP — explicit grid placement
          ════════════════════════════════ */}
      <div
        className="hidden lg:grid w-full px-6 xl:px-10 2xl:px-16 pt-6 gap-7 items-start"
        style={{
          gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1.3fr) minmax(0,0.82fr)",
          gridTemplateRows: "auto auto",
        }}
      >
        {/* ── Col 1 Row 1: Gallery ── */}
        <div style={{ gridColumn: "1", gridRow: "1" }}>
          <ProductGallery product={product} />
        </div>

        {/* ── Col 2 Row 1: Product Info ── */}
        <div style={{ gridColumn: "2", gridRow: "1" }}>
          <ProductInfo product={product} />
        </div>

        {/* ── Col 3 Row 1+2: Rental Card + Why Rent (sticky) ── */}
        <div
          style={{ gridColumn: 3, gridRow: "1 / 3" }}
          className="sticky top-6 space-y-5"
        >
          <ProductRentalCard product={product} />
          <WhyRentExxo />
        </div>

        {/* ── Col 1-2 Row 2: Tabs + Reviews ── */}
        <div style={{ gridColumn: "1 / 3", gridRow: 2 }} className="pt-1">
          <ProductTabs product={product} />
        </div>
      </div>

      {/* ════════════════════════════════
          MOBILE — stacked
          ════════════════════════════════ */}
      <div className="block lg:hidden w-full px-4 pt-5 space-y-6">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
        <ProductRentalCard product={product} />
        <ProductTabs product={product} />
        <WhyRentExxo />
      </div>
    </div>
  );
}
