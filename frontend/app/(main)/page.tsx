import { Suspense } from "react";
import { Metadata } from "next";
import Hero from "@/components/layout/landing/Hero";
import PopularCategories from "@/components/layout/landing/PopularCategories";
import PopularProducts from "@/components/layout/landing/PopularProducts";
import StudentStore from "@/components/layout/landing/StudentStore";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "EXXO — Why buy, when you can rent anything nearby?",
  description:
    "India's #1 peer-to-peer rental platform. Rent cameras, laptops, clothes, and more from people near you in Bangalore.",
  openGraph: {
    title: "EXXO — Borrow Anything Near You",
    description:
      "Before You Buy, Check if You Can Borrow. Join the community sharing revolution in India.",
    url: "/",
    siteName: "EXXO",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXXO — Borrow Anything Near You",
    description: "India's first peer-to-peer item sharing platform.",
    images: ["/og-image.png"],
  },
  keywords: [
    "rental",
    "peer-to-peer",
    "Bangalore",
    "rent cameras",
    "rent laptops",
    "share items",
  ],
};

const HeroSkeleton = () => (
  <div className="w-full h-[600px] animate-pulse bg-muted/20" />
);

const CategoriesSkeleton = () => (
  <div className="w-full h-[200px] animate-pulse bg-muted/10 px-[50px] py-10">
    <Skeleton className="h-8 w-64 mb-4" />
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-32 w-52 rounded-2xl" />
      ))}
    </div>
  </div>
);

const ProductsSkeleton = () => (
  <div className="w-full h-[320px] animate-pulse bg-muted/5 px-[50px] py-10">
    <Skeleton className="h-8 w-64 mb-4" />
    <div className="flex gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

export default function Home() {
  return (
    <main id="main-content">
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <PopularCategories />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <PopularProducts />
      </Suspense>

      <Suspense fallback={<ProductsSkeleton />}>
        <StudentStore />
      </Suspense>

      <div className="relative w-full px-10 mx-auto my-12">
        <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-sm">
          <Image
            src="/assets/banner/prod-banner.png"
            alt="Premium Rent Smart Trust Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
