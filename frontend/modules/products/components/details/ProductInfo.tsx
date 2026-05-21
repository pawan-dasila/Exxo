import React from "react";
import { Star, UserCheck, Info, Zap, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExtendedProduct } from "./types";
import { ProductAboutSection } from "./ProductAboutSection";
import { ProductShareButton } from "./ProductShareButton";

interface ProductInfoProps {
  product: ExtendedProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const basePricePerDay = product.rentalPrice;

  // Google Maps URL — coord-first, address fallback
  const lat = product.latitude;
  const lng = product.longitude;
  const mapsUrl =
    lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(
          product.pickupAddress || "Koramangala, Bangalore",
        )}`;

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 space-y-4">
        {/* ── 1. Title + Share icon ── */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[1.55rem] font-extrabold text-neutral-900 leading-tight tracking-tight flex-1 min-w-0">
            {product.name}
          </h1>
          <ProductShareButton name={product.name} price={product.rentalPrice} />
        </div>

        {/* ── 2. Price + Rating inline ── */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-neutral-900">
              ₹{product.rentalPrice}
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
              / day
            </span>
          </div>

          {product.avgRating != null && (
            <>
              <span className="h-5 w-px bg-neutral-200 shrink-0" />
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />
                <span className="font-bold text-neutral-800 text-sm">
                  {product.avgRating.toFixed(1)}
                </span>
                <span className="text-neutral-400 text-sm">
                  ({product.reviewCount ?? 0} {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            </>
          )}
        </div>


        {/* ── 3. Deposit + Verified ── */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-neutral-500">
            Security Deposit:{" "}
            <strong className="text-neutral-800">
              ₹{product.depositAmount}
            </strong>{" "}
            <span className="font-normal">(Refundable)</span>
          </span>
          <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <span className="h-3.5 w-px bg-neutral-200" />
          <Badge
            variant="outline"
            className="gap-1 text-blue-700 border-blue-200 bg-blue-50 text-[10px] font-bold uppercase tracking-wide"
          >
            <UserCheck className="h-3 w-3" /> Verified Item
          </Badge>
        </div>

        {/* ── 4. Savings promo banner ── */}
        <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shrink-0">
            <Zap className="h-3.5 w-3.5 fill-white" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">
              Save more with longer rentals
            </h4>
            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
              ₹{basePricePerDay}/day · ₹{Math.round(basePricePerDay * 0.9)}/day
              for 3+ days · ₹{Math.round(basePricePerDay * 0.8)}/day for 7+ days
            </p>
          </div>
        </div>

        {/* ── 5. Location + Google Maps link (plain <a>, no client needed) ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs font-semibold text-neutral-700">
            <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-neutral-900 font-bold">
                {product.pickupAddress || "Koramangala, Bangalore, 560034"}
              </span>
              <span className="block text-[10px] text-neutral-400 font-medium mt-0.5">
                1.2 km away from you
              </span>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Google Maps"
            className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 bg-blue-50/60 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap"
          >
            <ExternalLink className="h-3 w-3" />
            Maps
          </a>
        </div>
      </div>

      <Separator />

      {/* ── About this item + expandable specs ── */}
      <div className="px-6 py-5">
        <ProductAboutSection product={product} />
      </div>
    </div>
  );
}
