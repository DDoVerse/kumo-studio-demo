import Link from "next/link";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";

/**
 * 404 는 두 언어 모두 디자인된 페이지여야 한다(공고 요건).
 * notFound() 는 params 를 넘겨주지 않으므로 미들웨어가 심어둔 경로에서
 * 로케일을 되읽는다.
 */
export default async function NotFound() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const locale: Locale =
    pathname === "/ja" || pathname.startsWith("/ja/") ? "ja" : DEFAULT_LOCALE;
  const t = getDict(locale);

  return (
    <section className="mx-auto max-w-[76rem] px-6 md:px-10 pt-24 pb-28 md:pt-36">
      <p className="tnum text-[13px] uppercase tracking-[0.14em] text-ink-3">
        {t.notFound.code}
      </p>
      <h1 className="mt-6 text-[clamp(1.9rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.035em] font-medium">
        {t.notFound.title}
      </h1>
      <p className="mt-6 max-w-[34rem] text-[1rem] leading-[1.85] text-ink-2">
        {t.notFound.intro}
      </p>
      <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
        <Link
          href={localePath(locale, "/")}
          className="underline underline-offset-[6px] decoration-rule-2 hover:decoration-ink"
        >
          {t.notFound.home}
        </Link>
        <Link
          href={localePath(locale, "/work")}
          className="underline underline-offset-[6px] decoration-rule-2 hover:decoration-ink"
        >
          {t.notFound.work}
        </Link>
      </nav>
    </section>
  );
}
