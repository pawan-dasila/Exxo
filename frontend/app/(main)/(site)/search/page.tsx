import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProductListContent } from "@/modules/products/components/ProductListContent";
import {
  searchProductsAction,
  getProductsByCategoryAction,
} from "@/modules/products/actions";
import { getCategoryBySlugAction } from "@/modules/category/actions";
import { Product } from "@/modules/products/types";
import { redirect } from "next/navigation";
import { Metadata } from "next";

const UNIFIED_CATEGORY_DESCRIPTION =
  "Explore our curated collection of premium streetwear, designed for individuals who value minimal aesthetics and high-quality materials.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}): Promise<Metadata> {
  const { q, category } = await searchParams;

  if (category) {
    const cat = await getCategoryBySlugAction(category);
    return {
      title: cat?.name || "Collection",
      description: `Shop our curated ${cat?.name || ""} collection at Vestrostyles.`,
      alternates: {
        canonical: "/products",
      },
    };
  }

  return {
    title: q ? `Search results for "${q}"` : "Search",
    description: `Explore search results for ${q} on Vestrostyles.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: "/products",
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  // If neither query nor category is present, go to products
  if (!q?.trim() && !category?.trim()) {
    redirect("/products");
  }

  const queryClient = new QueryClient();
  let products: Product[] = [];
  let title = "Search Results";
  let description = "";

  if (category) {
    // Vercel Best Practice: parallel-fetching
    const [catData, catProducts] = await Promise.all([
      getCategoryBySlugAction(category),
      getProductsByCategoryAction(category),
    ]);

    title = catData?.name || "Collection";
    description = UNIFIED_CATEGORY_DESCRIPTION;

    // Seed the query client with the data we just fetched
    queryClient.setQueryData(["products", "category", category], catProducts);
    products = catProducts;
  } else if (q) {
    title = `Search results for "${q}"`;
    // Fetch once and seed the cache
    const searchResults = await searchProductsAction(q);
    queryClient.setQueryData(["products", "search", q], searchResults);
    products = searchResults;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListContent
        initialProducts={products}
        title={title}
        description={description}
        breadcrumbPage={category ? title : "Search"}
        searchQuery={q}
        categorySlug={category}
      />
    </HydrationBoundary>
  );
}
