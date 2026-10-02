import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

/**
 * Locale routing.
 *
 *   Public URL              Internal route
 *   /work/abc        →      /en/work/abc    (rewrite — address unchanged)
 *   /ja/work/abc     →      /ja/work/abc    (passes through)
 *   /en/work/abc     →      /work/abc       (redirect — removes the duplicate)
 *
 * The point is to keep the default locale unprefixed while still handling
 * both languages with a single [lang] segment in the app router. Leaving
 * /en reachable would open every document at two addresses, which
 * contradicts the hreflang block those pages emit.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/... is not a canonical address. Strip the prefix permanently.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  // A prefixed non-default locale (/ja) is already in its final form.
  const prefixed = LOCALES.some(
    (l) => l !== DEFAULT_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
  );

  // The language switch has to point at the counterpart of the current
  // document, so it needs the current path. The layout is a server component
  // and cannot read it; usePathname would turn the whole header into a client
  // component for the sake of one link. Passing it as a header avoids that.
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);

  if (prefixed) return NextResponse.next({ request: { headers } });

  // Everything else is the default locale: rewrite internally, leave the
  // address alone.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Leave _next, api and anything with an extension (static files) alone.
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
