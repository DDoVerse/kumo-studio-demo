import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  LOCALES,
  alternatesFor,
  isLocale,
  localePath,
  SITE_URL,
  type Locale,
} from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import { getCaseStudies, getCaseStudy, getNextCaseStudy } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import VideoFacade from "@/components/VideoFacade";

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return LOCALES.flatMap((lang) => cases.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const c = await getCaseStudy(slug);
  if (!c) return {};
  const locale: Locale = lang;
  return {
    title: c.title[locale],
    description: c.summary[locale],
    // 언어 전환이 같은 글의 다른 언어판을 가리키는 근거가 여기서도 나온다.
    alternates: alternatesFor(locale, `/work/${slug}`),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);
  const c = await getCaseStudy(slug);
  if (!c) notFound();
  const next = await getNextCaseStudy(slug);

  return (
    <>
      <article>
        <header className="mx-auto max-w-[76rem] px-6 md:px-10 pt-14 pb-12 md:pt-20">
          <Link
            href={localePath(locale, "/work")}
            className="text-[13px] text-ink-3 underline underline-offset-[6px] decoration-rule-2 hover:decoration-ink"
          >
            {t.caseStudy.back}
          </Link>
          <h1 className="mt-10 max-w-[48rem] text-[clamp(1.9rem,5vw,3.6rem)] leading-[1.1] tracking-[-0.035em] font-medium">
            {c.title[locale]}
          </h1>

          <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3 md:max-w-[52rem]">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {t.work.client}
              </dt>
              <dd className="mt-2 text-[15px]">{c.client}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {t.work.year}
              </dt>
              <dd className="tnum mt-2 text-[15px]">{c.year}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {t.work.disciplines}
              </dt>
              <dd className="mt-2 text-[15px]">{c.disciplines[locale].join(", ")}</dd>
            </div>
          </dl>
        </header>

        <section className="border-t border-rule">
          <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-14 md:py-20">
            <div className="grid gap-x-10 gap-y-6 md:grid-cols-[12rem_1fr]">
              <h2 className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {t.caseStudy.overview}
              </h2>
              <div className="max-w-[40rem] space-y-6">
                {c.body[locale].map((p, i) => (
                  <p key={i} className="text-[1.0625rem] leading-[1.9] text-ink-2">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {c.vimeoId ? (
          <section className="border-t border-rule">
            <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-14 md:py-20">
              <div className="grid gap-x-10 gap-y-6 md:grid-cols-[12rem_1fr]">
                <h2 className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                  {t.caseStudy.film}
                </h2>
                <div className="max-w-[52rem]">
                  <VideoFacade
                    vimeoId={c.vimeoId}
                    title={c.title[locale]}
                    playLabel={t.caseStudy.playFilm}
                    note={t.caseStudy.filmNote}
                    length={c.filmLength}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-rule">
          <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-14 md:py-20">
            <div className="grid gap-x-10 gap-y-8 md:grid-cols-[12rem_1fr]">
              <h2 className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {t.caseStudy.results}
              </h2>
              <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
                {c.results[locale].map((r, i) => (
                  <div key={i}>
                    <dt className="tnum text-[clamp(1.5rem,3.4vw,2.3rem)] leading-none tracking-[-0.03em]">
                      {r.value}
                    </dt>
                    <dd className="mt-3 text-[13px] leading-[1.7] text-ink-2">{r.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </article>

      {next ? (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-12 md:py-16">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
              {t.caseStudy.next}
            </p>
            <Link
              href={localePath(locale, `/work/${next.slug}`)}
              className="mt-4 block max-w-[44rem] text-[clamp(1.3rem,3.4vw,2.4rem)] leading-tight tracking-[-0.03em] underline underline-offset-[10px] decoration-1 decoration-rule-2 hover:decoration-ink"
            >
              {next.title[locale]}
            </Link>
          </div>
        </section>
      ) : null}

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
              {
                "@type": "ListItem",
                position: 3,
                name: c.client,
                item: `${SITE_URL}${localePath(locale, `/work/${c.slug}`)}`,
              },
            ],
          },
          ...(c.vimeoId
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: c.title[locale],
                  description: c.summary[locale],
                  uploadDate: `${c.year}-01-01`,
                  embedUrl: `https://player.vimeo.com/video/${c.vimeoId}`,
                  publisher: { "@type": "Organization", name: "Kumo Studio" },
                },
              ]
            : []),
        ]}
      />
    </>
  );
}
