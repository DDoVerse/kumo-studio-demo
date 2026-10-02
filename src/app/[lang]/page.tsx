import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, alternatesFor, isLocale, localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import { getCaseStudies, getServices } from "@/lib/content";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return { alternates: alternatesFor(locale, "/") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const [cases, services] = await Promise.all([getCaseStudies(), getServices()]);
  const selected = cases.slice(0, 3);

  return (
    <>
      {/* Hero — large type whose rhythm comes from the line breaks, the way
          baqemono.jp sets "A / digital / creative / atelier,". */}
      <section className="mx-auto max-w-[76rem] px-6 md:px-10 pt-20 pb-16 md:pt-32 md:pb-24">
        <h1 className="text-[clamp(2.4rem,7.2vw,5.6rem)] leading-[1.04] tracking-[-0.035em] font-medium">
          {t.home.line.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </h1>
        <p className="mt-12 max-w-[42rem] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.85] text-ink-2">
          {t.home.intro}
        </p>
      </section>

      {/* Selected work — index rows divided by rules, not cards. */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10">
          <h2 className="py-6 text-[12px] uppercase tracking-[0.14em] text-ink-3">
            {t.home.selected}
          </h2>
          <ul>
            {selected.map((c, i) => (
              <li key={c.slug} className="border-t border-rule">
                <Link
                  href={localePath(locale, `/work/${c.slug}`)}
                  className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr_9rem_5rem] items-baseline gap-x-4 gap-y-1 py-7 md:py-9"
                >
                  <span className="tnum text-[13px] text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1.15rem,2.6vw,1.9rem)] leading-snug tracking-[-0.02em] group-hover:underline underline-offset-[7px] decoration-rule-2">
                    {c.title[locale]}
                  </span>
                  <span className="col-start-2 md:col-start-3 text-[13px] text-ink-2">
                    {c.disciplines[locale][0]}
                  </span>
                  <span className="tnum col-start-2 md:col-start-4 md:text-right text-[13px] text-ink-3">
                    {c.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-rule py-6">
            <Link
              href={localePath(locale, "/work")}
              className="text-[14px] underline underline-offset-[6px] decoration-rule-2 hover:decoration-ink"
            >
              {t.home.allWork}
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10">
          <h2 className="py-6 text-[12px] uppercase tracking-[0.14em] text-ink-3">
            {t.home.capabilities}
          </h2>
          <dl className="grid gap-x-10 md:grid-cols-3 border-t border-rule">
            {services.map((s) => (
              <div key={s.slug} className="py-8 md:py-10 border-b border-rule md:border-b-0">
                <dt className="text-[1.0625rem] tracking-[-0.01em]">{s.title[locale]}</dt>
                <dd className="mt-3 text-[14px] leading-[1.8] text-ink-2">{s.summary[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-16 md:py-24">
          <Link
            href={localePath(locale, "/contact")}
            className="text-[clamp(1.6rem,4.2vw,3rem)] leading-tight tracking-[-0.03em] underline underline-offset-[10px] decoration-1 decoration-rule-2 hover:decoration-ink"
          >
            {t.home.enquire}
          </Link>
        </div>
      </section>
    </>
  );
}
