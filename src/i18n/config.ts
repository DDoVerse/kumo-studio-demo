export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

/** 기본 로케일은 URL 접두사가 없다. 영어는 /work, 일본어는 /ja/work. */
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://prototype.ddoverse.com";

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/**
 * 로케일이 붙은 경로를 만든다.
 * 기본 로케일에는 접두사를 붙이지 않는 것이 이 사이트의 규칙이다.
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean || "/" : `/${locale}${clean}`;
}

/**
 * 절대 URL. hreflang·sitemap·JSON-LD 가 모두 이걸 쓴다.
 * 한 곳에서만 만들어야 세 군데가 어긋나지 않는다.
 */
export function absoluteUrl(locale: Locale, path = "/"): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * generateMetadata 용 alternates.
 * x-default 는 영어로 보낸다 — 어느 언어도 아닌 방문자의 기본값.
 */
export function alternatesFor(path = "/") {
  return {
    canonical: absoluteUrl(DEFAULT_LOCALE, path),
    languages: {
      en: absoluteUrl("en", path),
      ja: absoluteUrl("ja", path),
      "x-default": absoluteUrl("en", path),
    },
  };
}
