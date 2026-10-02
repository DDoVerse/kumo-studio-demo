import type { Locale } from "./config";

/**
 * UI strings. Content — case studies and services — comes from Sanity or
 * the seed; only chrome lives here.
 *
 * The navigation labels follow the convention on the reference sites, which
 * use plain nouns: mount.jp has About / Approach / Services / Portfolio /
 * Members, baqemono.jp has Creation / Atelier / Recruit / Contact.
 */
export const DICT = {
  en: {
    nav: { work: "Work", services: "Services", contact: "Contact" },
    langSwitch: { label: "Language", to: "日本語" },
    skip: "Skip to content",
    demoBanner:
      "Demo build — Kumo Studio is a fictional studio. The work, clients and contact details on this site are invented for a portfolio piece.",
    home: {
      line: ["A design", "studio in", "Tokyo,", "working in", "two languages."],
      intro:
        "Kumo Studio makes identities, archives and the websites that hold them. We work in Japanese and English from the first sketch, because a thing translated afterwards is never quite the same thing.",
      selected: "Selected work",
      allWork: "All work",
      capabilities: "What we do",
      enquire: "Start a project",
    },
    work: {
      title: "Work",
      intro:
        "Three projects that show how we think. Each one is written up in full — what was wrong, what we changed, and what it measured afterwards.",
      index: "Index",
      year: "Year",
      client: "Client",
      disciplines: "Disciplines",
      viewCase: "Read the case study",
    },
    caseStudy: {
      back: "All work",
      overview: "Overview",
      results: "Results",
      film: "Film",
      playFilm: "Play film",
      filmNote: "Nothing is loaded from Vimeo until you press play.",
      next: "Next project",
    },
    services: {
      title: "Services",
      intro:
        "Three things, done properly, rather than a list that covers everything. Most projects use two of them.",
    },
    studio: {
      title: "Studio",
      intro:
        "Kumo Studio is a small practice in Tokyo. We take on a handful of projects a year so that the people who sold the work are the people who make it.",
      approach: "How we work",
    },
    contact: {
      title: "Contact",
      intro:
        "Tell us what you are making and when it needs to exist. We reply to everything within two working days.",
      name: "Name",
      email: "Email",
      company: "Company",
      budget: "Budget",
      budgetHelp: "Rough is fine — it tells us what shape the project is.",
      budgetOptions: ["Under ¥1M", "¥1M – ¥3M", "¥3M – ¥10M", "Over ¥10M", "Not sure yet"],
      message: "What are you making?",
      submit: "Send enquiry",
      sending: "Sending",
      ok: "Thank you — your enquiry is with us. We will reply within two working days.",
      okQueued:
        "Thank you — your enquiry is safely recorded. Our CRM is not responding, so it has been queued and emailed to us directly; nothing is lost.",
      errors: {
        name: "Please tell us your name.",
        email: "That email address does not look right.",
        message: "Please tell us a little about the project.",
        generic: "Something went wrong. Please email us directly at hello@example.com.",
      },
      demoTitle: "Demo control",
      demoNote:
        "This build carries a switch that makes the CRM fail on purpose, so the fallback path can be seen rather than described.",
      demoToggle: "Simulate CRM outage",
      demoOn: "Turn the outage off",
      demoOff: "Turn the outage on",
    },
    notFound: {
      code: "404",
      title: "This page does not exist.",
      intro: "It may have moved, or the address may have a typo in it.",
      home: "Go to the home page",
      work: "See the work",
    },
    footer: {
      nav: "Pages",
      elsewhere: "Elsewhere",
      legal: "Privacy policy",
      office: "2-14-7 Kichijoji-Honcho, Musashino, Tokyo",
    },
  },

  ja: {
    nav: { work: "実績", services: "サービス", contact: "お問い合わせ" },
    langSwitch: { label: "言語", to: "English" },
    skip: "本文へスキップ",
    demoBanner:
      "デモ用ビルド — Kumo Studio は架空のスタジオです。掲載している実績・クライアント・連絡先はポートフォリオ用の創作です。",
    home: {
      line: ["東京の", "デザイン", "スタジオ、", "二つの言語で", "つくる。"],
      intro:
        "Kumo Studio はアイデンティティ、アーカイブ、そしてそれらを収めるウェブサイトをつくります。最初のスケッチから日本語と英語で考えます。あとから翻訳したものは、もう同じものではないからです。",
      selected: "主な実績",
      allWork: "すべての実績",
      capabilities: "できること",
      enquire: "プロジェクトの相談",
    },
    work: {
      title: "実績",
      intro:
        "考え方が分かる3つのプロジェクト。何が問題で、何を変え、その後どう計測されたかまで記録しています。",
      index: "一覧",
      year: "年",
      client: "クライアント",
      disciplines: "領域",
      viewCase: "ケーススタディを読む",
    },
    caseStudy: {
      back: "すべての実績",
      overview: "概要",
      results: "結果",
      film: "映像",
      playFilm: "映像を再生",
      filmNote: "再生を押すまで Vimeo からは何も読み込みません。",
      next: "次のプロジェクト",
    },
    services: {
      title: "サービス",
      intro:
        "すべてを網羅した一覧ではなく、きちんとできる3つだけ。多くのプロジェクトはこのうち2つを使います。",
    },
    studio: {
      title: "スタジオ",
      intro:
        "Kumo Studio は東京の小さな事務所です。受注した人間がそのまま手を動かせるよう、年に数件のみお引き受けしています。",
      approach: "進め方",
    },
    contact: {
      title: "お問い合わせ",
      intro:
        "何をつくろうとしていて、いつ必要かをお聞かせください。2営業日以内に必ず返信します。",
      name: "お名前",
      email: "メールアドレス",
      company: "会社・団体名",
      budget: "ご予算",
      budgetHelp: "おおよそで構いません。プロジェクトの規模感が分かります。",
      budgetOptions: ["100万円未満", "100万〜300万円", "300万〜1000万円", "1000万円以上", "未定"],
      message: "つくろうとしているもの",
      submit: "送信する",
      sending: "送信中",
      ok: "ありがとうございます。お問い合わせを受け付けました。2営業日以内に返信します。",
      okQueued:
        "ありがとうございます。お問い合わせは確実に記録されました。CRM が応答しないためキューに保存し、担当者へ直接メールしました。内容が失われることはありません。",
      errors: {
        name: "お名前をご記入ください。",
        email: "メールアドレスの形式が正しくないようです。",
        message: "プロジェクトについて少しお聞かせください。",
        generic: "送信に失敗しました。hello@example.com まで直接ご連絡ください。",
      },
      demoTitle: "デモ用スイッチ",
      demoNote:
        "このビルドには CRM を意図的に失敗させるスイッチがあります。フォールバック動作を説明ではなく実際に確認できます。",
      demoToggle: "CRM 障害をシミュレート",
      demoOn: "障害をオフにする",
      demoOff: "障害をオンにする",
    },
    notFound: {
      code: "404",
      title: "このページは存在しません。",
      intro: "移動したか、アドレスに誤りがある可能性があります。",
      home: "ホームへ",
      work: "実績を見る",
    },
    footer: {
      nav: "ページ",
      elsewhere: "その他",
      legal: "プライバシーポリシー",
      office: "東京都武蔵野市吉祥寺本町2-14-7",
    },
  },
} as const;

export type Dict = (typeof DICT)[Locale];
export const getDict = (locale: Locale): Dict => DICT[locale];
