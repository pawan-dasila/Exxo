"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { getProductsAction } from "@/modules/products/actions";
import { Product } from "@/modules/products/types";
import { ProductCard } from "@/modules/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function StudentStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchStudents() {
      try {
        setIsLoading(true);
        const data = await getProductsAction({ student: "true", limit: 10 });
        if (isMounted) {
          setProducts(data);
          setIsError(false);
        }
      } catch (err) {
        console.error("Failed to fetch student products:", err);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchStudents();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-4">
      <div className="max-w-full lg:px-12.5 mx-auto px-6">
        {/* User Specific Custom Gradient wrapper */}
        <div className="rounded-3xl shadow-xs ">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-white border border-indigo-100 mb-3 shadow-2xs">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>STUDENT CORNER</span>
              </div>
              <h2 className="text-[28px] md:text-[32px] font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
                Study Essentials & Gear
                <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-400/30 animate-pulse hidden md:inline-block" />
              </h2>
              <p className="text-zinc-600 text-[14px] md:text-[15px] mt-1 max-w-xl">
                Rent laptops, ergonomic furniture, iPads and academic setups at
                special pocket-friendly student rates.
              </p>
            </div>
            <Link
              href="/products?category=laptops-study-gear"
              className="group flex items-center gap-1.5 text-sm font-bold text-indigo-700 hover:text-indigo-800 transition-colors"
            >
              <span>Browse All Student Gear</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-2xs flex flex-col h-80 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[20%] shrink-0"
                >
                  <Skeleton className="w-full aspect-4/3 bg-zinc-100" />
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
            <div className="text-center py-12 rounded-2xl border border-dashed border-indigo-200 bg-white/60">
              <p className="text-sm text-zinc-500 italic">
                No student store offerings found. Update your search filters or
                check again later.
              </p>
            </div>
          ) : (
            <Carousel
              opts={{ align: "start", loop: false }}
              className="w-full relative px-1"
            >
              <CarouselContent className="-ml-4">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[20%]"
                  >
                    <div className="transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.18)] hover:-translate-y-1 rounded-2xl bg-white pb-1 h-full">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-6 bg-white border border-indigo-100 hover:bg-zinc-50 shadow-sm" />
              <CarouselNext className="hidden md:flex -right-6 bg-white border border-indigo-100 hover:bg-zinc-50 shadow-sm" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
