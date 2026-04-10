import { getPageSchema } from '@/lib/seo';

type JsonLdProps = {
  slug: string;
};

/**
 * Server component that renders a JSON-LD `<script>` tag when a schema
 * is configured for the given page slug in the admin SEO dashboard.
 */
export default async function JsonLd({ slug }: JsonLdProps) {
  const schema = await getPageSchema(slug);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}
