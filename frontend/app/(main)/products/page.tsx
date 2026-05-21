import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProductListContent } from "@/modules/products/components/ProductListContent";
import { getProductsAction } from "@/modules/products/actions";
import { categoryApi } from "@/modules/category/actions";
import { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ drop?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { drop } = await searchParams;

  const title = drop
    ? `Shop ${drop} — Limited Premium Gear | Exxo`
    : "Shop All Collections — Premium P2P Rental Catalog | Exxo";

  const description =
    "Browse Exxo premium peer-to-peer rental collections. High-quality items on demand.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.exxo.co/products",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

import { Suspense } from "react";
import Loading from "./loading";

export default async function ProductListPage({ searchParams }: Props) {
  const { drop } = await searchParams;
  const queryClient = new QueryClient();

  const options = {
    dropSlug: drop && drop !== "active" ? drop : undefined,
    activeDropOnly: drop === "active",
  };

  // Prefetch products & categories concurrently
  const [products, categories] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["products", options],
      queryFn: () => getProductsAction(options),
    }),
    queryClient.fetchQuery({
      queryKey: ["categories"],
      queryFn: () => categoryApi.getAll(),
    }).catch((err) => {
      console.error("Failed to prefetch categories in page.tsx", err);
      return [];
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <ProductListContent initialProducts={products} initialCategories={categories} />
      </Suspense>
    </HydrationBoundary>
  );
}
