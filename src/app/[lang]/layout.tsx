import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { DEFAULT_LOCALE, LOCALES, SITE_URL, alternatesFor, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

/**
 * 모든 경로가 [lang] 아래를 지나므로 이것이 루트 레이아웃이다.
 * html lang 을 로케일별로 세우기 위해 일부러 여기에 둔다.
 */

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const ja = lang === "ja";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: ja ? "Kumo Studio — 東京のデザインスタジオ" : "Kumo Studio — a design studio in Tokyo",
      template: "%s — Kumo Studio",
    },
    description: ja
      ? "東京・吉祥寺のデザインスタジオ。アイデンティティ、アーカイブ、二言語のウェブサイトを手がけます。"
      : "A design studio in Kichijoji, Tokyo. Identities, archives, and the bilingual websites that hold them.",
    alternates: alternatesFor("/"),
    openGraph: {
      type: "website",
      locale: ja ? "ja_JP" : "en_GB",
      alternateLocale: ja ? "en_GB" : "ja_JP",
      siteName: "Kumo Studio",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = getDict(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:border focus:border-ink"
        >
          {t.skip}
        </a>
        {/* 가상 스튜디오임을 숨기지 않는다. 가상 실적을 실제처럼 보이게 두면
            정직성 문제가 되고, 지원 맥락에서는 그게 가장 큰 감점이다. */}
        <p className="border-b border-rule bg-paper px-6 py-2.5 text-center text-[12.5px] leading-relaxed text-ink-3 md:px-10">
          {t.demoBanner}
        </p>
        <SiteHeader locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />

        {/* Organization + WebSite 는 전 페이지 공통이라 레이아웃에 둔다.
            Service·BreadcrumbList·VideoObject 는 해당 페이지에서 붙인다. */}
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kumo Studio",
              url: SITE_URL,
              email: "hello@example.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "2-14-7 Kichijoji-Honcho",
                addressLocality: "Musashino",
                addressRegion: "Tokyo",
                addressCountry: "JP",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kumo Studio",
              url: SITE_URL,
              inLanguage: ["en", "ja"],
            },
          ]}
        />
      </body>
    </html>
  );
}
