export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

/** The default locale carries no URL prefix: /work in English, /ja/work in Japanese. */
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://prototype.ddoverse.com";

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/**
 * Build a locale-aware path. The rule on this site is that the default
 * locale is never prefixed.
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean || "/" : `/${locale}${clean}`;
}

/**
 * Absolute URL. hreflang, the sitemap and JSON-LD all go through this, so
 * that the three cannot disagree with each other.
 */
export function absoluteUrl(locale: Locale, path = "/"): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * alternates for generateMetadata.
 *
 * The canonical must be the page itself. Pinning it to the default locale
 * makes every Japanese page declare itself a duplicate of the English one,
 * which contradicts the hreflang emitted directly beneath it and takes the
 * Japanese pages out of the index entirely.
 *
 * Only x-default goes to English — the fallback for a visitor who is
 * neither.
 */
export function alternatesFor(locale: Locale, path = "/") {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      en: absoluteUrl("en", path),
      ja: absoluteUrl("ja", path),
      "x-default": absoluteUrl("en", path),
    },
  };
}
