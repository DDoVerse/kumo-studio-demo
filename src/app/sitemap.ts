import type { MetadataRoute } from "next";
import { absoluteUrl, DEFAULT_LOCALE } from "@/i18n/config";
import { getCaseStudies } from "@/lib/content";

/**
 * sitemap.xml.
 *
 * 각 URL 에 alternates.languages 를 넣는다 — 공고가 요구하는 항목이고,
 * generateMetadata 의 hreflang 과 같은 헬퍼(absoluteUrl)에서 나오므로
 * 둘이 어긋날 수 없다.
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
