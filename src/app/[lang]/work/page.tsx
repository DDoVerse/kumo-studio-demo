import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, alternatesFor, isLocale, localePath, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import { getCaseStudies } from "@/lib/content";
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
    title: ja ? "実績" : "Work",
    description: ja
      ? "Kumo Studio の主なプロジェクト。"
      : "Selected projects by Kumo Studio.",
    alternates: alternatesFor(locale, "/work"),
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const cases = await getCaseStudies();

  return (
    <>
      <section className="mx-auto max-w-[76rem] px-6 md:px-10 pt-20 pb-14 md:pt-28">
        <h1 className="text-[clamp(2rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.035em] font-medium">
          {t.work.title}
        </h1>
        <p className="mt-8 max-w-[38rem] text-[1rem] leading-[1.85] text-ink-2">
          {t.work.intro}
        </p>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10">
          {/* 표가 아니라 색인이라는 신호. 괘선과 열 제목만으로 구조를 만든다. */}
          <div className="hidden md:grid grid-cols-[3.5rem_1fr_12rem_5rem] gap-x-4 py-4 text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <span>{t.work.index}</span>
            <span>{t.work.client}</span>
            <span>{t.work.disciplines}</span>
            <span className="text-right">{t.work.year}</span>
          </div>
          <ul>
            {cases.map((c, i) => (
              <li key={c.slug} className="border-t border-rule">
                <Link
                  href={localePath(locale, `/work/${c.slug}`)}
                  className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr_12rem_5rem] items-baseline gap-x-4 gap-y-2 py-8 md:py-10"
                >
                  <span className="tnum text-[13px] text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[clamp(1.2rem,2.6vw,1.75rem)] leading-snug tracking-[-0.02em] group-hover:underline underline-offset-[7px] decoration-rule-2">
                      {c.client}
                    </span>
                    <span className="mt-2 block max-w-[34rem] text-[14px] leading-[1.75] text-ink-2">
                      {c.summary[locale]}
                    </span>
                  </span>
                  <span className="col-start-2 md:col-start-3 text-[13px] text-ink-2">
                    {c.disciplines[locale].join(", ")}
                  </span>
                  <span className="tnum col-start-2 md:col-start-4 md:text-right text-[13px] text-ink-3">
                    {c.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-rule" />
        </div>
      </section>

      <JsonLd
        data={[
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
                name: t.work.title,
                item: `${SITE_URL}${localePath(locale, "/work")}`,
              },
            ],
          },
        ]}
      />
    </>
  );
}
