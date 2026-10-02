import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";

/**
 * Allow crawling; block indexing only.
 *
 * Disallowing the crawl would stop a crawler fetching the page at all, so
 * it would never read the X-Robots-Tag: noindex response header — leaving
 * the URL indexable from external links, which is the opposite of the
 * intent. The noindex itself is served by nginx.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
