import type { MetadataRoute } from "next";
import { absoluteUrl, DEFAULT_LOCALE } from "@/i18n/config";
import { getCaseStudies } from "@/lib/content";

/**
 * sitemap.xml.
 *
 * Every URL carries alternates.languages. These come from the same helper
 * (absoluteUrl) that generateMetadata uses for hreflang, so the sitemap and
 * the page metadata cannot drift apart.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getCaseStudies();
  const paths = [
    "/",
    "/work",
    "/services",
    "/contact",
    ...cases.map((c) => `/work/${c.slug}`),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(DEFAULT_LOCALE, path),
    lastModified: new Date(),
    alternates: {
      languages: {
        en: absoluteUrl("en", path),
        ja: absoluteUrl("ja", path),
        "x-default": absoluteUrl("en", path),
      },
    },
  }));
}
