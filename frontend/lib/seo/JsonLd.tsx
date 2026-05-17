
interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * A simple component to inject JSON-LD into the page for SEO.
 * Use this to provide Schema.org structured data to search engines.
 */
export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
