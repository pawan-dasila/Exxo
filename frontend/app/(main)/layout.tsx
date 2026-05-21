// import { Suspense } from "react";
import { Footer } from "@/components/layout/shared/Footer";
import { Navbar } from "@/components/layout/shared/Navbar";
// import { CartDrawer } from "@/components/layout/shared/CartDrawer";
// import { SplashScreen } from "@/components/layout/shared/SplashScreen";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { JsonLd } from "@/lib/seo/JsonLd";
import { SiteSchema } from "@/lib/seo/SiteSchema";
// import { getActiveDropAction } from "@/modules/drops/actions";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
  alternates: {
    canonical: "./",
  },
};

const LayoutContent = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {/* <CartDrawer /> */}
      <main id="main-content" role="main" className="grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    sameAs: [
      siteConfig.socials.instagram,
      siteConfig.socials.facebook,
      siteConfig.socials.twitter,
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
      <SiteSchema />

      <LayoutContent>{children}</LayoutContent>
    </>
  );
};

export default MainLayout;
