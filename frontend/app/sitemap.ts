import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // 1. Static Pages
  const staticPages = [
    "",
    "/products",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Dynamic Categories (Pattern for when you fetch from DB)
  const categories = [
    "drones",
    "cameras",
    "electronics",
    "fashion",
    "trekking",
  ].map((cat) => ({
    url: `${baseUrl}/products/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categories];
}
