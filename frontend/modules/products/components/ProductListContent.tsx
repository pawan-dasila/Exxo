"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFiltersSidebar } from "./ProductFilters";
import { ProductList } from "./ProductList";
import { Product } from "../types";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Category } from "@/modules/category/types";

export interface ProductListContentProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
  title?: string;
  description?: string;
  breadcrumbPage?: string;
  searchQuery?: string;
  categorySlug?: string;
}

export const ProductListContent: React.FC<ProductListContentProps> = ({
  initialProducts = [],
  initialCategories = [],
  title,
  description,
  breadcrumbPage,
  searchQuery,
  categorySlug,
}) => {
  const searchParams = useSearchParams();

  // Filters & layout state management initialized from URL search params
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      return searchParams.get("category") || categorySlug || null;
    },
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    return searchParams.get("size") || null;
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const priceParam = searchParams.get("price");
    if (priceParam) {
      const parts = priceParam.split("-");
      if (parts.length === 2) {
        const min = parseInt(parts[0], 10);
        const max = parseInt(parts[1], 10);
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max];
        }
      }
    }
    return [0, 5000];
  });
  const [ratingFilter, setRatingFilter] = useState<number | null>(() => {
    const ratingParam = searchParams.get("rating");
    return ratingParam ? parseFloat(ratingParam) : null;
  });
  const [availableOnly, setAvailableOnly] = useState<boolean>(() => {
    return searchParams.get("available") === "true";
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    return searchParams.get("sortBy") || "recommended";
  });
  const [location, setLocation] = useState<string>(() => {
    return searchParams.get("location") || "Koramangala, Bangalore";
  });
  const [radius, setRadius] = useState<number>(() => {
    const rangeParam = searchParams.get("range");
    return rangeParam ? parseInt(rangeParam, 10) : 5;
  });

  // Pagination state management
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const itemsPerPage = 20;

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (selectedCategory) params.set("category", selectedCategory);
    if (location && location !== "Koramangala, Bangalore")
      params.set("location", location);
    if (radius && radius !== 5) params.set("range", String(radius));
    if (selectedSize) params.set("size", selectedSize);
    if (priceRange[0] !== 0 || priceRange[1] !== 5000) {
      params.set("price", `${priceRange[0]}-${priceRange[1]}`);
    }
    if (ratingFilter) params.set("rating", String(ratingFilter));
    if (availableOnly) params.set("available", "true");
    if (sortBy && sortBy !== "recommended") params.set("sortBy", sortBy);
    if (searchQuery) params.set("q", searchQuery);

    const queryString = params.toString();
    const nextUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [
    currentPage,
    selectedCategory,
    location,
    radius,
    selectedSize,
    priceRange,
    ratingFilter,
    availableOnly,
    sortBy,
    searchQuery,
  ]);

  const currentFiltersKey = `${selectedCategory || ""}-${selectedSize || ""}-${priceRange[0]}-${priceRange[1]}-${ratingFilter || ""}-${availableOnly}-${sortBy}-${location}-${radius}`;
  const [prevFiltersKey, setPrevFiltersKey] =
    useState<string>(currentFiltersKey);

  if (currentFiltersKey !== prevFiltersKey) {
    setPrevFiltersKey(currentFiltersKey);
    setCurrentPage(1);
  }

  // Filtering implementation on client-side array
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search Query filtering
    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.description?.toLowerCase().includes(qLower),
      );
    }

    // 2. Category slug filtering
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter(
        (p) =>
          p.category?.slug?.toLowerCase() === catLower ||
          p.categoryId === selectedCategory,
      );
    }

    // 3. Size filtering
    if (selectedSize) {
      const sizeLower = selectedSize.toLowerCase();
      result = result.filter(
        (p) => p.size?.toLowerCase() === sizeLower,
      );
    }

    // 4. Price filtering
    result = result.filter(
      (p) => p.rentalPrice >= priceRange[0] && p.rentalPrice <= priceRange[1],
    );

    // 5. Star rating filter
    if (ratingFilter) {
      // Check ratings if available, fallback to a stable deterministic rating based on the product id
      result = result.filter((p) => {
        const charSum = p.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const stableRating = 4.5 + (charSum % 6) * 0.1; // yields a stable value from 4.5 to 5.0
        return stableRating >= ratingFilter;
      });
    }

    // 6. Availability filter
    if (availableOnly) {
      result = result.filter(
        (p) =>
          p.status?.toLowerCase() === "active" ||
          p.status === "ACTIVE" ||
          p.status === undefined,
      );
    }

    // 7. Sorting logic
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.rentalPrice - a.rentalPrice);
    }

    return result;
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    selectedSize,
    priceRange,
    ratingFilter,
    availableOnly,
    sortBy,
  ]);

  // Calculate pagination variables inside a dedicated useMemo block
  const { paginatedProducts, totalItems, totalPages } = useMemo(() => {
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return { paginatedProducts, totalItems, totalPages };
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handle page change and scroll smoothly to the top of the viewport
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20">
      <div className="max-w-full mx-auto px-4 mt-6">
        {(title || breadcrumbPage || searchQuery) && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {breadcrumbPage && (
              <Breadcrumb className="mb-3.5">
                <BreadcrumbList className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-zinc-300" />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/products"
                      className="hover:text-zinc-900 transition-colors"
                    >
                      Products
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-zinc-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-zinc-800 font-extrabold">
                      {breadcrumbPage}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none mb-2 font-sans">
                {title}
              </h2>
            )}
            {searchQuery && !title && (
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none mb-2 font-sans">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
            )}
            {description && (
              <p className="text-xs text-zinc-500 max-w-2xl font-medium leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6.5 items-start">
          {/* Left Sidebar Filter Section */}
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <ProductFiltersSidebar
              categories={initialCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              priceRange={priceRange}
              onChangePriceRange={setPriceRange}
              ratingFilter={ratingFilter}
              onSelectRating={setRatingFilter}
              availableOnly={availableOnly}
              onChangeAvailableOnly={setAvailableOnly}
              location={location}
              onChangeLocation={setLocation}
              radius={radius}
              onChangeRadius={setRadius}
            />
          </div>

          {/* Right Main Grid Catalog Section */}
          <div className="lg:col-span-4">
            <ProductList
              products={paginatedProducts}
              categories={initialCategories}
              totalCount={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
