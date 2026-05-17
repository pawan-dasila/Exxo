import { siteConfig } from "@/lib/config/site";

export async function GET() {
  const baseUrl = siteConfig.url;

  // Pattern: In production, you would fetch your latest rental items from your API here
  const items = [
    {
      title: "DSLR Camera for Rent",
      description:
        "Professional DSLR camera available for neighbors in Bengaluru.",
      link: `${baseUrl}/products/dslr-camera`,
      date: new Date().toUTCString(),
    },
  ];

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en-in</language>
    ${items
      .map(
        (item) => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.date}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
