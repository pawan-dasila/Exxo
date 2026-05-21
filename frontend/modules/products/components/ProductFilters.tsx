"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, MapPin, Edit2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Category } from "@/modules/category/types";

interface ProductFiltersProps {
  categories?: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedSize: string | null;
  onSelectSize: (size: string | null) => void;
  priceRange: [number, number];
  onChangePriceRange: (range: [number, number]) => void;
  ratingFilter: number | null;
  onSelectRating: (rating: number | null) => void;
  availableOnly: boolean;
  onChangeAvailableOnly: (available: boolean) => void;
  availableSizes?: string[];
  location: string;
  onChangeLocation: (location: string) => void;
  radius: number;
  onChangeRadius: (radius: number) => void;
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

export const ProductFiltersSidebar = React.memo<ProductFiltersProps>(({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  priceRange,
  onChangePriceRange,
  ratingFilter,
  onSelectRating,
  availableOnly,
  onChangeAvailableOnly,
  availableSizes = DEFAULT_SIZES,
  location,
  onChangeLocation,
  radius,
  onChangeRadius,
}) => {
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);

  // Compute categories list dynamically based on database input
  const categoriesList = useMemo(() => {
    const allCount = categories
      ? categories.reduce((sum, cat) => sum + (cat._count?.products ?? 0), 0)
      : 1248;

    return categories
      ? [
          { name: "All Categories", count: allCount, slug: null },
          ...categories.map((cat) => ({
            name: cat.name,
            count: cat._count?.products ?? 0,
            slug: cat.slug,
          })),
        ]
      : [
          { name: "All Categories", count: 1248, slug: null },
          { name: "Electronics", count: 342, slug: "electronics" },
          { name: "Books & Study", count: 168, slug: "books-study" },
          { name: "Fashion", count: 210, slug: "fashion" },
          { name: "Fitness", count: 98, slug: "fitness" },
          { name: "Photography", count: 146, slug: "photography" },
          { name: "Travel & Outdoor", count: 132, slug: "travel-outdoor" },
          { name: "Home & Kitchen", count: 92, slug: "home-kitchen" },
        ];
  }, [categories]);

  const handleClearAll = () => {
    onSelectCategory(null);
    onSelectSize(null);
    onChangePriceRange([0, 5000]);
    onSelectRating(null);
    onChangeAvailableOnly(false);
    onChangeLocation("Koramangala, Bangalore");
    onChangeRadius(5);
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-5.5 shadow-xs flex flex-col gap-6.5">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <h2 className="text-[13px] font-bold uppercase text-zinc-900 flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-800" /> Filters
        </h2>
        <Button
          variant="link"
          onClick={handleClearAll}
          className="text-[10px] cursor-pointer font-extrabold text-blue-600 hover:text-blue-700 transition-colors uppercase h-auto p-0"
        >
          Clear all
        </Button>
      </div>

      {/* 2. Category List */}
      <div>
        <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-1.5">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <Button
                key={cat.name}
                variant="ghost"
                onClick={() => onSelectCategory(cat.slug)}
                className={cn(
                  "flex cursor-pointer items-center text-xs px-3 py-2 h-auto rounded-xl transition-all text-left justify-start w-full font-medium hover:bg-zinc-50 hover:text-zinc-900",
                  isSelected &&
                    "bg-blue-50 text-blue-700 font-bold shadow-2xs hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                <span className="truncate">{cat.name}</span>
                <Badge
                  variant={isSelected ? "default" : "secondary"}
                  className="font-bold text-[9px] rounded-md leading-none bg-zinc-100 text-zinc-600 border-none shrink-0"
                >
                  {cat.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 3. Location Section */}
      <div className="border-t border-zinc-100 pt-5">
        <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-3">
          Location
        </h3>
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-xl px-3.5 py-2.5">
          <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
          {isEditingLocation ? (
            <Input
              type="text"
              value={location}
              onChange={(e) => onChangeLocation(e.target.value)}
              onBlur={() => setIsEditingLocation(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingLocation(false);
              }}
              autoFocus
              className="text-xs bg-transparent border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-6 p-0 w-full text-zinc-800 shadow-none"
            />
          ) : (
            <span
              onClick={() => setIsEditingLocation(true)}
              className="text-xs text-zinc-700 font-medium truncate w-full cursor-pointer hover:text-zinc-900"
            >
              {location}
            </span>
          )}
          <Edit2
            className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-700 cursor-pointer shrink-0"
            onClick={() => setIsEditingLocation(true)}
          />
        </div>

        {/* Distance Radius Slider */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase">
              Within {radius} km
            </span>
          </div>
          <Slider
            min={1}
            max={20}
            step={1}
            value={[radius]}
            onValueChange={(val) => onChangeRadius(val[0])}
            className="my-3 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-semibold">
            <span>1 km</span>
            <span>5 km</span>
            <span>10 km</span>
            <span>20 km</span>
          </div>
        </div>
      </div>

      {/* 4. Price Slider Section */}
      <div className="border-t border-zinc-100 pt-5">
        <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-3">
          Price per day
        </h3>
        <div className="flex justify-between items-center text-xs font-bold text-zinc-800 mb-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1] === 5000 ? "5000+" : priceRange[1]}</span>
        </div>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={(val) => onChangePriceRange(val as [number, number])}
          className="my-3 cursor-pointer"
        />
      </div>

      {/* 5. Filter by Size Section */}
      <div className="border-t border-zinc-100 pt-5">
        <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-3">
          Filter by Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <Button
                key={size}
                variant="outline"
                onClick={() => onSelectSize(isSelected ? null : size)}
                className={cn(
                  "w-9 h-9 rounded-xl text-xs font-bold border transition-all flex items-center justify-center shadow-2xs cursor-pointer p-0",
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-900 hover:text-white"
                    : "bg-white text-zinc-600 border-zinc-100 hover:bg-zinc-50",
                )}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 6. Rating Section */}
      <div className="border-t border-zinc-100 pt-5">
        <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-3">
          Rating
        </h3>
        <div className="flex flex-col gap-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => {
            const isSelected = ratingFilter === rating;
            return (
              <Button
                key={rating}
                variant="ghost"
                onClick={() => onSelectRating(isSelected ? null : rating)}
                className="flex items-center gap-2.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-transparent transition-colors text-left justify-start w-full h-auto p-0"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-zinc-300 bg-white",
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                      key={i}
                        className={cn(
                          "w-3.5 h-3.5 fill-current",
                          i < Math.floor(rating)
                            ? "text-amber-400"
                            : "text-zinc-200",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-zinc-700 ml-1">
                    {rating.toFixed(1)} & above
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 7. Availability Section */}
      <div className="border-t border-zinc-100 pt-5 flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-bold uppercase text-zinc-400 mb-0.5">
            Availability
          </h3>
          <span className="text-[11.5px] font-medium text-zinc-600">
            Available Now
          </span>
        </div>
        <Switch
          checked={availableOnly}
          onCheckedChange={onChangeAvailableOnly}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
});

ProductFiltersSidebar.displayName = "ProductFiltersSidebar";
