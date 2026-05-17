import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/layout/products/detail/ProductGallery";
import { ProductInfo } from "@/components/layout/products/detail/ProductInfo";
import { ProductTabs } from "@/components/layout/products/detail/ProductTabs";
import { ProductReviews } from "@/components/layout/products/detail/ProductReviews";
import { RelatedProducts } from "@/components/layout/products/detail/RelatedProducts";
import {
  getProductBySlugAction,
  getTrendingProductsAction,
} from "@/modules/products/actions";
import { siteConfig } from "@/lib/config/site";
import { createClient } from "@supabase/supabase-js";
import { sanitizeJsonLd } from "@/utils/security";

import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) return {};

  const title = `Buy ${product.title} - Shop Premium Streetwear | VESTROSTYLES`;
  const description =
    product.description?.substring(0, 160) || siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/products/${product.slug}`,
      images: [
        {
          url: product.image_url || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${product.title} — Vestrostyles oversized tee`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image_url || siteConfig.ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  const productPromise = queryClient.fetchQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugAction(slug),
  });

  const trendingProductsPromise = queryClient.fetchQuery({
    queryKey: ["products", "trending"],
    queryFn: () => getTrendingProductsAction(),
  });

  const [product, trendingProducts] = await Promise.all([
    productPromise,
    trendingProductsPromise,
  ]);

  if (!product) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image_url,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.base_price,
      availability:
        product.variants &&
        product.variants.some((v) => (v.stock_quantity ?? 0) > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 5,
      reviewCount: product.reviewsCount || 0,
    },
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <article className="pb-24 max-w-full mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(jsonLd) }}
        />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 mt-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-black transition-colors"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/products"
                    className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-black transition-colors"
                  >
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[10px] font-bold tracking-widest uppercase text-[#090A0A]">
                  {product.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <div className="flex flex-col lg:grid lg:grid-cols-[0.6fr_0.4fr] gap-6 mb-20 items-start">
          <div className="w-full">
            <ProductGallery
              primaryImage={product.image_url || ""}
              galleryImages={product.images || []}
              title={product.title || ""}
            />
          </div>
          <div className="w-full lg:sticky lg:top-20">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductTabs
          product={{
            id: product.id,
            title: product.title || "",
            reviewsCount: product.reviewsCount || 0,
            description: product.description || "",
            details: product.details,
            washcare: product.washcare,
            images: product.images || [],
          }}
        />

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm uppercase font-bold text-[#090A0A]">
              Customer Reviews
            </h2>
          </div>
          <ProductReviews productId={product.id} />
        </section>

        <RelatedProducts products={trendingProducts || []} />
      </article>
    </HydrationBoundary>
  );
}
