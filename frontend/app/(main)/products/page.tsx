import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProductListContent } from "@/modules/products/components/ProductListContent";
import { getProductsAction } from "@/modules/products/actions";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { dropService } from "@/modules/drops/services/drop-service";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ drop?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { drop } = await searchParams;
  const supabase = await createClient();
  const activeDrop = await dropService.getActiveDrop(supabase);

  const dropName = drop === "active" ? activeDrop?.title : drop;
  const title = dropName
    ? `Shop ${dropName} — Limited Streetwear | Vestrostyles`
    : "Shop All Collections — Limited Streetwear | Vestrostyles";

  const description = activeDrop
    ? `Browse Vestrostyles ${activeDrop.title}. Premium 240 GSM oversized tees, limited quantities. Each piece ships in a collector's box. New Delhi.`
    : "Browse Vestrostyles premium minimal streetwear. Limited quantities, high-quality wearable art.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.vestrostyles.com/products",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductListPage({ searchParams }: Props) {
  const { drop } = await searchParams;
  const queryClient = new QueryClient();

  const options = {
    dropSlug: drop && drop !== "active" ? drop : undefined,
    activeDropOnly: drop === "active",
  };

  const products = await queryClient.fetchQuery({
    queryKey: ["products", options],
    queryFn: () => getProductsAction(options),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListContent initialProducts={products} />
    </HydrationBoundary>
  );
}
