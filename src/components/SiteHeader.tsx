import Link from "next/link";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";

/**
 * Strip the locale prefix to get a language-neutral path:
 * /ja/work/abc → /work/abc. The other locale's URL is built from that.
 */
function neutralPath(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname || "/";
  const stripped = pathname.slice(`/${locale}`.length);
  return stripped || "/";
}

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const neutral = neutralPath(pathname, locale);
  const other: Locale = locale === "en" ? "ja" : "en";

  const items = [
    { href: "/work", label: t.nav.work },
    { href: "/services", label: t.nav.services },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-[76rem] px-6 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 py-5">
          <Link
            href={localePath(locale, "/")}
            className="text-[15px] tracking-[0.14em] uppercase"
          >
            Kumo Studio
          </Link>

          <nav aria-label={locale === "ja" ? "メインナビゲーション" : "Main"}>
            <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-2 text-[14px]">
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={localePath(locale, it.href)}
                    className="text-ink-2 hover:text-ink underline-offset-[6px] hover:underline"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
              <li>
                {/* The switch goes to the counterpart of this document, never
                    back to the home page. Spelling the language out is the
                    convention on sites such as mount.jp. */}
                <Link
                  href={localePath(other, neutral)}
                  hrefLang={other}
                  lang={other}
                  className="text-ink-2 hover:text-ink underline-offset-[6px] hover:underline"
                  aria-label={`${t.langSwitch.label}: ${t.langSwitch.to}`}
                >
                  {t.langSwitch.to}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
