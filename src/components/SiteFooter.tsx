import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const year = new Date().getFullYear();

  const pages = [
    { href: "/work", label: t.nav.work },
    { href: "/services", label: t.nav.services },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-rule mt-24">
      <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
          <div className="max-w-sm">
            <p className="text-[15px] tracking-[0.14em] uppercase">Kumo Studio</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{t.footer.office}</p>
            <p className="mt-3 text-[14px]">
              <a href="mailto:hello@example.com" className="underline underline-offset-[5px] decoration-rule-2 hover:decoration-ink">
                hello@example.com
              </a>
            </p>
          </div>

          <nav aria-label={t.footer.nav}>
            <h2 className="text-[12px] uppercase tracking-[0.12em] text-ink-3">{t.footer.nav}</h2>
            <ul className="mt-4 space-y-2 text-[14px]">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={localePath(locale, p.href)} className="text-ink-2 hover:text-ink">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[12px] uppercase tracking-[0.12em] text-ink-3">
              {t.footer.elsewhere}
            </h2>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li><span className="text-ink-2">Instagram</span></li>
              <li><span className="text-ink-2">Vimeo</span></li>
              <li><span className="text-ink-2">note</span></li>
            </ul>
          </div>
        </div>

        {/* A year range is the convention on the reference sites. */}
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-6 text-[13px] text-ink-3">
          <p className="tnum">© 2019 – {year} Kumo Studio</p>
          <p>{t.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
