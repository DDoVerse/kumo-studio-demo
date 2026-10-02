import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { DEFAULT_LOCALE, LOCALES, SITE_URL, alternatesFor, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

/**
 * Every route passes through [lang], so this is the root layout. It lives
 * here deliberately: it is the only place <html lang> can be set per locale.
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
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
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
    alternates: alternatesFor(locale, "/"),
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
        {/* The studio is fictional and says so. Invented case studies left
            to read as real client work is a worse problem than any missing
            feature. */}
        <p className="border-b border-rule bg-paper px-6 py-2.5 text-center text-[12.5px] leading-relaxed text-ink-3 md:px-10">
          {t.demoBanner}
        </p>
        <SiteHeader locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />

        {/* Organization and WebSite apply to every page, so they sit in the
            layout. Service, BreadcrumbList and VideoObject are emitted by the
            pages that own them. */}
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
