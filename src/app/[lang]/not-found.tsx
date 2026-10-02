import Link from "next/link";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";

/**
 * The 404 is a designed page in both languages, not a default.
 * notFound() does not pass params, so the locale is read back from the
 * path that middleware recorded.
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
