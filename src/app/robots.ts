import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";

/**
 * 크롤링은 허용하고 색인만 막는다.
 *
 * Disallow 로 막으면 크롤러가 페이지를 아예 가져가지 않아 응답 헤더의
 * X-Robots-Tag: noindex 를 볼 기회가 없다. 그러면 외부 링크를 통해 URL 만
 * 색인되는, 막으려던 것과 정반대의 결과가 난다.
 * 색인 차단은 nginx 의 X-Robots-Tag 가 담당한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
