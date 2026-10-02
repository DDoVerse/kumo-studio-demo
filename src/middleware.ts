import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

/**
 * 로케일 라우팅.
 *
 * 외부에 보이는 URL          내부 라우트
 *   /work/abc        →   /en/work/abc   (rewrite — 주소는 그대로)
 *   /ja/work/abc     →   /ja/work/abc   (그대로 통과)
 *   /en/work/abc     →   /work/abc      (redirect — 중복 URL 제거)
 *
 * 기본 로케일에 접두사를 붙이지 않으면서도 앱 라우터에서는
 * [lang] 세그먼트 하나로 다룰 수 있게 하는 것이 목적이다.
 * /en 을 그냥 두면 같은 문서가 두 주소로 열려 hreflang 과 어긋난다.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/... 은 정규 주소가 아니다. 접두사를 떼고 영구 리다이렉트.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  // 접두사가 붙은 비기본 로케일(/ja)은 그대로 둔다.
  const prefixed = LOCALES.some(
    (l) => l !== DEFAULT_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
  );

  // 언어 전환 버튼이 "현재 글의 다른 언어판"을 가리키려면 현재 경로를 알아야
  // 한다. 레이아웃은 서버 컴포넌트라 pathname 을 직접 못 보므로 헤더로 넘긴다.
  // usePathname 을 쓰면 클라이언트 컴포넌트가 되어 JS 가 늘기 때문이다.
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);

  if (prefixed) return NextResponse.next({ request: { headers } });

  // 나머지는 전부 기본 로케일 — 주소를 바꾸지 않고 내부만 /en 으로.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // _next, api, 그리고 확장자가 있는 것(정적 파일)은 건드리지 않는다.
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
