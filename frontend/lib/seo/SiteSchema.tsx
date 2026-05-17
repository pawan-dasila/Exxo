import { siteConfig } from "@/lib/config/site";
import { JsonLd } from "./JsonLd";

interface SiteSchemaProps {
  breadcrumbs?: { name: string; item: string }[];
}

/**
 * SiteSchema Component
 * Renders advanced JSON-LD structured data for the Vestrostyles platform.
 * Includes SiteNavigation and Breadcrumbs to enable site-links in search results.
 */
export function SiteSchema({ breadcrumbs }: SiteSchemaProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
    },
    sameAs: [
      siteConfig.socials.instagram,
      siteConfig.socials.facebook,
      siteConfig.socials.twitter,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: siteConfig.navigation.main.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: `${siteConfig.url}${item.href}`,
    })),
  };

  const breadcrumbSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${siteConfig.url}${crumb.item}`,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={navSchema} />
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
    </>
  );
}
