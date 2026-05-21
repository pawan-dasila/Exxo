"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { getProductsAction } from "@/modules/products/actions";
import { Product } from "@/modules/products/types";
import { ProductCard } from "@/modules/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchPopular() {
      try {
        setIsLoading(true);
        const data = await getProductsAction({ popular: "true", limit: 4 });
        if (isMounted) {
          setProducts(data);
          setIsError(false);
        }
      } catch (err) {
        console.error("Failed to fetch popular products:", err);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-full lg:px-[50px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-violet-600 bg-violet-50/80 border border-violet-100 mb-3 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>MOST POPULAR NOW</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              Popular in Bangalore
              <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-400 animate-pulse hidden md:inline-block" />
            </h2>
            <p className="text-zinc-500 text-[14px] md:text-[15px] mt-1 max-w-xl">
              High demand rental pieces, top-rated by our trust community. Secure your booking early.
            </p>
          </div>
          <Link
            href="/products?popular=true"
            className="group flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
          >
            <span>Explore popular gear</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-2xs flex flex-col h-[320px]"
              >
                <Skeleton className="w-full aspect-[4/3] bg-zinc-100" />
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-zinc-100 rounded" />
                    <Skeleton className="h-3 w-1/2 bg-zinc-100 rounded" />
                  </div>
                  <div className="border-t border-zinc-100 pt-3 flex justify-between">
                    <Skeleton className="h-3 w-12 bg-zinc-100 rounded" />
                    <Skeleton className="h-3 w-12 bg-zinc-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError || products.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50">
            <p className="text-sm text-zinc-500 italic">
              Unable to load trending products right now. Try refreshing the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.12)] hover:-translate-y-1 rounded-2xl"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
