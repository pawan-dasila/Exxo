"use client";

import React, { useState } from "react";
import { Star, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedProduct } from "./types";
import { type Review } from "../../types";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ProductTabsProps {
  product: ExtendedProduct;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const reviews = product.reviews ?? [];
  const reviewCount = product.reviewCount ?? reviews.length;

  const [activeTab, setActiveTab] = useState<
    "details" | "reviews" | "location" | "rules"
  >("details");

  const tabs = [
    { id: "details" as const, label: "Details" },
    { id: "reviews" as const, label: `Reviews (${reviewCount})` },
    { id: "location" as const, label: "Location" },
    { id: "rules" as const, label: "Rules" },
  ];

  // Build spec rows from DB specifications JSON
  const specRows: [string, string][] = [
    ["Brand", product.brand?.name ?? "—"],
    ["Category", product.category?.name ?? "—"],
    ["Condition", product.condition ?? "Good"],
    ...(product.color ? [["Colour", product.color] as [string, string]] : []),
    ...(product.size ? [["Size", product.size] as [string, string]] : []),
    ["Pickup", product.pickupAddress ?? "Contact lender"],
    ...((product.specifications?.specs ?? [])
      .slice(0, 4)
      .map((s) => [s.label, s.value] as [string, string])),
  ];

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* ── Tab bar ── */}
      <div className="flex border-b border-neutral-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-4 text-xs font-bold tracking-wide transition-all duration-200 border-b-2 -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "text-blue-600 border-blue-600"
                : "text-neutral-400 border-transparent hover:text-neutral-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] md:divide-x divide-neutral-100">
        {/* ═══ LEFT: Tab-specific content ═══ */}
        <div className="p-6">
          {/* DETAILS */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr] gap-8">
              {/* Spec table from real data */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-extrabold text-neutral-900 tracking-wider">
                  Item Details
                </h4>
                <dl className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  {specRows.map(([dt, dd]) => (
                    <React.Fragment key={dt}>
                      <dt className="text-neutral-400 font-semibold capitalize truncate">
                        {dt}
                      </dt>
                      <dd className="text-neutral-800 font-semibold truncate">
                        {dd}
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>

              {/* Description + full specs */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold text-neutral-900 tracking-wider">
                    Description
                  </h4>
                  <p className="text-xs leading-relaxed text-neutral-600 font-medium">
                    {product.description || "No description provided."}
                  </p>
                </div>

                {/* Full specs list from DB */}
                {(product.specifications?.specs ?? []).length > 0 && (
                  <div className="border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50">
                    <h4 className="text-xs uppercase font-extrabold text-neutral-900 tracking-wider mb-3">
                      Specifications
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold text-neutral-700">
                      {(product.specifications?.specs ?? []).map((spec) => (
                        <li key={spec.label} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3px] shrink-0 mt-0.5" />
                          <span className="text-neutral-400 min-w-[80px]">
                            {spec.label}:
                          </span>
                          <span>{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REVIEWS (full panel when tab active) */}
          {activeTab === "reviews" && (
            <ReviewsContent
              reviews={reviews}
              avgRating={product.avgRating}
              reviewCount={reviewCount}
              showAll
            />
          )}

          {/* LOCATION */}
          {activeTab === "location" && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 bg-blue-50/40 p-4 border border-blue-100 rounded-2xl text-xs font-semibold text-neutral-700">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-neutral-950">
                    Pickup Location
                  </h4>
                  <p className="text-neutral-600 font-medium mt-1">
                    {product.pickupAddress ||
                      "Contact lender for exact address"}
                  </p>
                  {product.latitude && product.longitude && (
                    <p className="text-[10px] text-neutral-400 mt-0.5 font-bold uppercase">
                      {product.latitude}° N · {product.longitude}° E
                    </p>
                  )}
                </div>
              </div>
              {/* Map placeholder — replace with Mapbox/Leaflet when ready */}
              <Link
                href={
                  product.latitude && product.longitude
                    ? `https://www.google.com/maps?q=${product.latitude},${product.longitude}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(product.pickupAddress ?? "Bangalore")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-52 bg-neutral-100 border border-neutral-200/60 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner hover:opacity-90 transition-opacity"
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(#d4d4d4 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex flex-col items-center">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-600 items-center justify-center shadow-lg">
                      <MapPin className="h-4 w-4 text-white" />
                    </span>
                  </span>
                  <span className="mt-2 bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                    Open in Google Maps
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* RULES */}
          {activeTab === "rules" && (
            <div className="space-y-4 text-xs font-semibold text-neutral-700 leading-relaxed">
              <h4 className="text-xs uppercase font-extrabold text-neutral-900 tracking-wider">
                Safety &amp; Rental Rules
              </h4>
              <ul className="space-y-3.5">
                {[
                  {
                    title: "Security Deposit",
                    body: `A fully refundable deposit of ₹${product.depositAmount} is required before pick-up. Returned within 24 hours of successful item return.`,
                  },
                  {
                    title: "Verifiable ID Check",
                    body: "Lenders will check valid Govt ID (Aadhaar/Passport) during P2P exchange for safety.",
                  },
                  {
                    title: "Damage Protocol",
                    body: "Accidental damage is covered under our standard program. Inspect items thoroughly at pick-up.",
                  },
                  {
                    title: "On-time Return",
                    body: "Returns must be completed by 8:00 PM on the end date. Delays without notice may incur a fine.",
                  },
                ].map(({ title, body }) => (
                  <li
                    key={title}
                    className="flex items-start gap-2.5 list-none"
                  >
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                    <span>
                      <strong>{title}:</strong> {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ═══ RIGHT: Reviews panel — always visible except when reviews tab is active ═══ */}
        {activeTab !== "reviews" && (
          <div className="p-6 max-h-[520px] overflow-y-auto">
            <ReviewsContent
              reviews={reviews}
              avgRating={product.avgRating}
              reviewCount={reviewCount}
              showAll={false}
              onViewAll={() => setActiveTab("reviews")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/** Compute star distribution from real review data */
function computeDistribution(reviews: Review[]) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length || 1;
  return counts.map((c) => ({
    ...c,
    pct: Math.round((c.count / total) * 100),
  }));
}

/** Reviews content — used in both right panel and full Reviews tab */
function ReviewsContent({
  reviews,
  avgRating,
  reviewCount,
  showAll = false,
  onViewAll,
}: {
  reviews: Review[];
  avgRating?: number | null;
  reviewCount: number;
  showAll?: boolean;
  onViewAll?: () => void;
}) {
  const displayed = showAll ? reviews : reviews.slice(0, 3);
  const distribution = computeDistribution(reviews);
  const displayRating = avgRating ?? (reviewCount > 0 ? 0 : null);

  if (reviewCount === 0) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-extrabold text-neutral-900">Reviews</h4>
        <p className="text-xs text-neutral-400 font-medium">
          No reviews yet. Be the first to rent this item!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-extrabold text-neutral-900">Reviews</h4>

      {/* Overall score */}
      <div className="flex items-center gap-3">
        <span className="text-4xl font-black text-neutral-900">
          {displayRating?.toFixed(1)}
        </span>
        <div>
          <div className="flex text-amber-500 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(displayRating ?? 0)
                    ? "fill-amber-500 text-amber-500"
                    : "text-neutral-200 fill-neutral-200",
                )}
              />
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </p>
        </div>
      </div>

      {/* Star distribution bars — computed from real data */}
      <div className="space-y-1.5 text-xs font-semibold text-neutral-600">
        {distribution.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="w-2.5 text-right shrink-0">{star}</span>
            <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-4 text-right text-neutral-400 shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Review cards — from real DB */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        {displayed.map((review) => {
          const authorName =
            [review.author.firstName, review.author.lastName]
              .filter(Boolean)
              .join(" ") || "Anonymous";
          const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          });

          return (
            <div
              key={review.id}
              className="space-y-2 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {review.author.profileImageUrl ? (
                    <Image
                      src={review.author.profileImageUrl}
                      alt={authorName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-neutral-200 shrink-0"
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">
                      {authorName[0]}
                    </span>
                  )}
                  <div>
                    <div className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                      {authorName}
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">
                        Verified
                      </span>
                    </div>
                    <div className="flex text-amber-500 gap-0.5 mt-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-amber-500 text-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase shrink-0">
                  {timeAgo}
                </span>
              </div>
              {review.comment && (
                <p className="text-xs text-neutral-600 font-medium pl-10">
                  {review.comment}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* View all — only in right panel */}
      {!showAll && onViewAll && reviews.length > 3 && (
        <button
          onClick={onViewAll}
          className="w-full py-2.5 text-xs font-bold text-blue-600 hover:text-blue-700 border border-neutral-200 hover:border-blue-200 rounded-xl transition-all hover:bg-blue-50/50"
        >
          View all {reviewCount} reviews →
        </button>
      )}
    </div>
  );
}
