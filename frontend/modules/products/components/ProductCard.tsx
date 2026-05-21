"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, CheckCircle } from "lucide-react";
import { Product } from "../types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  const coverImage =
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400";

  const charSum = product.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.5 + (charSum % 5) * 0.1).toFixed(1);
  const reviewCount = 10 + (charSum % 41);
  const distance = (0.3 + (charSum % 21) * 0.1).toFixed(1);
  const isLowStock = charSum % 4 === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
    >
      {/* 1. Image Area with Aspect Ratio & Overlays */}
      <div className="relative overflow-hidden w-full">
        <AspectRatio ratio={4 / 3} className="bg-zinc-50 w-full relative">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Left Availability Pill - Only show if Low Stock */}
          {isLowStock && (
            <Badge className="absolute top-3.5 left-3.5 text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-xs border-none text-white bg-amber-500 hover:bg-amber-500">
              Low Stock
            </Badge>
          )}

          {/* Top Right Heart Outline Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3.5 right-3.5 w-7 h-7 bg-white/90 hover:bg-white text-zinc-600 rounded-full flex items-center justify-center shadow-xs transition-all group/btn cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-rose-500 transition-colors" />
          </button>
        </AspectRatio>
      </div>

      {/* 2. Detail Row & Specs */}
      <div className="p-4.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Title in one line */}
          <h4 className="text-[13px] font-bold text-zinc-900 leading-snug group-hover:text-primary transition-colors truncate w-full">
            {product.name}
          </h4>

          {/* Rating & Price on the same row */}
          <div className="flex items-center justify-between gap-2 mt-2">
            {/* Rating + Reviews */}
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-amber-500 font-bold">{rating}</span>
              <span className="text-zinc-400">({reviewCount})</span>
            </div>

            {/* Price Info */}
            <div className="text-right shrink-0">
              <span className="text-[13px] font-bold text-zinc-900">
                {formatPrice(product.rentalPrice)}
              </span>
              <span className="text-[10px] text-muted-foreground">/day</span>
            </div>
          </div>
        </div>

        {/* Footer row: Distance & Verified */}
        <div className="border-t border-zinc-100 pt-3 mt-1 flex items-center justify-between">
          {/* Distance */}
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <svg
              className="w-3 h-3 text-zinc-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">{distance} km</span>
          </div>

          {/* Verified tag badge */}
          <Badge className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-50 border-none px-2 py-0.5 rounded-md">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified
          </Badge>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
