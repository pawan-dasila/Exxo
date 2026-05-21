import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getProductBySlugAction,
  getTrendingProductsAction,
} from "@/modules/products/actions";
import { siteConfig } from "@/lib/config/site";
import { Metadata } from "next";
import { ProductDetailContainer } from "@/modules/products/components/details/ProductDetailContainer";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) return {};

  const title = `${product.name} - Rent Premium Peer-to-Peer Gear | Exxo`;
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
          url: product.images?.[0]?.imageUrl || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${product.name} — Premium P2P gear`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.images?.[0]?.imageUrl || siteConfig.ogImage],
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

  const [product] = await Promise.all([
    productPromise,
    trendingProductsPromise,
  ]);

  if (!product) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.[0]?.imageUrl || "",
    description: product.description,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.rentalPrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailContainer product={product} />
    </HydrationBoundary>
  );
}
