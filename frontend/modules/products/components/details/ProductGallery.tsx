"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedProduct } from "./types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  product: ExtendedProduct;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => img.imageUrl);
    }
    return ["/images/placeholder.jpg"];
  }, [product.images]);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-4/3 md:aspect-14/12 overflow-hidden rounded-2xl bg-neutral-50 group border border-neutral-100/50 shadow-sm flex items-center justify-center">
        <Image
          src={images[activeImageIndex]}
          alt={`${product.name} view ${activeImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          priority
          className="h-full w-full object-cover transition-all duration-700 ease-out"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevImage}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 h-10 w-10 rounded-full bg-white/95 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextImage}
          aria-label="Next image"
          className="absolute right-3 top-1/2  h-10 w-10 rounded-full bg-white/95 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/95 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isWishlisted && "fill-red-500 text-red-500",
            )}
          />
        </Button>

        {/* Dot indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeImageIndex
                    ? "w-4 bg-white shadow"
                    : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-200">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImageIndex(index)}
            className={cn(
              "relative aspect-4/3 h-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border transition-all duration-300",
              index === activeImageIndex
                ? "border-blue-600 ring-2 ring-blue-600/20 ring-offset-1 scale-95"
                : "border-neutral-200 hover:border-neutral-400 hover:scale-95",
            )}
          >
            <Image
              src={img}
              alt="Thumbnail view"
              width={80}
              height={60}
              className="h-full w-full object-cover"
            />
          </button>
        ))}

        {images.length > 5 && (
          <div className="relative aspect-4/3 h-16 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-neutral-200 flex items-center justify-center text-white text-xs font-bold">
            <span className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              +6
            </span>
            <Image
              src={images[0]}
              alt="Extras"
              width={80}
              height={60}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
