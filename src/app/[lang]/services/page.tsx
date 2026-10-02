import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, alternatesFor, isLocale, localePath, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import { getServices } from "@/lib/content";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const ja = lang === "ja";
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return {
    title: ja ? "サービス" : "Services",
    description: ja
      ? "Kumo Studio が手がける3つの領域。"
      : "The three things Kumo Studio does.",
    alternates: alternatesFor(locale, "/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const services = await getServices();

  return (
    <>
      <section className="mx-auto max-w-[76rem] px-6 md:px-10 pt-20 pb-14 md:pt-28">
        <h1 className="text-[clamp(2rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.035em] font-medium">
          {t.services.title}
        </h1>
        <p className="mt-8 max-w-[38rem] text-[1rem] leading-[1.85] text-ink-2">
          {t.services.intro}
        </p>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10">
          {services.map((s, i) => (
            <article
              key={s.slug}
              className="grid gap-x-10 gap-y-5 border-b border-rule py-12 md:grid-cols-[3.5rem_18rem_1fr] md:py-16"
            >
              <span className="tnum text-[13px] text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[clamp(1.3rem,3vw,2rem)] leading-snug tracking-[-0.025em]">
                {s.title[locale]}
              </h2>
              <div>
                <p className="max-w-[34rem] text-[1rem] leading-[1.85] text-ink-2">
                  {s.summary[locale]}
                </p>
                <ul className="mt-6 space-y-2">
                  {s.bullets[locale].map((b, j) => (
                    <li
                      key={j}
                      className="grid grid-cols-[1.25rem_1fr] text-[14px] leading-[1.8] text-ink-2"
                    >
                      <span aria-hidden="true" className="text-ink-3">
                        &mdash;
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <div className="py-14">
            <Link
              href={localePath(locale, "/contact")}
              className="text-[clamp(1.3rem,3.4vw,2.4rem)] leading-tight tracking-[-0.03em] underline underline-offset-[10px] decoration-1 decoration-rule-2 hover:decoration-ink"
            >
              {t.home.enquire}
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          ...services.map((s) => ({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title[locale],
            description: s.summary[locale],
            provider: { "@type": "Organization", name: "Kumo Studio", url: SITE_URL },
            areaServed: "JP",
          })),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Kumo Studio",
                item: `${SITE_URL}${localePath(locale, "/")}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t.services.title,
                item: `${SITE_URL}${localePath(locale, "/services")}`,
              },
            ],
          },
        ]}
      />
    </>
  );
}
