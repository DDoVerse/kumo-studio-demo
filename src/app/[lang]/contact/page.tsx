import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, alternatesFor, isLocale, localePath, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { isOutageSimulated } from "./outage";
import { toggleOutage } from "./outage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const ja = lang === "ja";
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return {
    title: ja ? "お問い合わせ" : "Contact",
    description: ja
      ? "プロジェクトのご相談。2営業日以内に返信します。"
      : "Start a project with Kumo Studio. We reply within two working days.",
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { lang } = await params;
  const { sent } = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);

  const outage = await isOutageSimulated();

  return (
    <>
      <section className="mx-auto max-w-[76rem] px-6 md:px-10 pt-20 pb-14 md:pt-28">
        <h1 className="text-[clamp(2rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.035em] font-medium">
          {t.contact.title}
        </h1>
        <p className="mt-8 max-w-[38rem] text-[1rem] leading-[1.85] text-ink-2">
          {t.contact.intro}
        </p>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[76rem] px-6 md:px-10 py-14 md:py-20">
          {/* The success state arrives in the query string: it has to render
              with JavaScript disabled, so it cannot live in client state. */}
          {sent ? (
            <p
              role="status"
              className="mb-12 max-w-[40rem] border-l-2 border-ink pl-5 text-[1rem] leading-[1.85]"
            >
              {sent === "queued" ? t.contact.okQueued : t.contact.ok}
            </p>
          ) : null}

          <EnquiryForm locale={locale} t={t} />

          {/* Demo switch. A real delivery would drop this section. */}
          <aside className="mt-16 max-w-[40rem] border-t border-rule pt-6">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-ink-3">
              {t.contact.demoTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.8] text-ink-2">{t.contact.demoNote}</p>
            {/* A form action, so it works without JavaScript. */}
            <form action={toggleOutage} className="mt-5 flex items-baseline gap-4">
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                aria-pressed={outage}
                className="border border-ink px-5 py-2 text-[14px] transition-colors hover:bg-ink hover:text-paper"
              >
                {outage ? t.contact.demoOn : t.contact.demoOff}
              </button>
              <span className="text-[14px] text-ink-3">
                {t.contact.demoToggle}: <span className="tnum">{outage ? "ON" : "OFF"}</span>
              </span>
            </form>
          </aside>
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
                name: t.contact.title,
                item: `${SITE_URL}${localePath(locale, "/contact")}`,
              },
            ],
          },
        ]}
      />
    </>
  );
}
