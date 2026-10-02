import type { Locale } from "@/i18n/config";

export type L<T> = Record<Locale, T>;

export type CaseStudy = {
  slug: string;
  client: string;
  year: number;
  title: L<string>;
  summary: L<string>;
  disciplines: L<string[]>;
  /** 본문 문단. Sanity 전환 시 Portable Text 로 바뀔 자리. */
  body: L<string[]>;
  /** Vimeo 영상 ID. 있으면 클릭 후 로드 파사드를 띄운다(포스터 이미지 없이 타이포로). */
  vimeoId?: string;
  /** 파사드에 표시할 러닝타임. */
  filmLength?: string;
  /** 결과 수치 — 케이스 스터디의 설득력은 여기서 나온다. */
  results: L<{ value: string; label: string }[]>;
};

export type Service = {
  slug: string;
  title: L<string>;
  summary: L<string>;
  bullets: L<string[]>;
};

/**
 * 로컬 시드.
 *
 * Sanity 프로젝트가 연결되면(NEXT_PUBLIC_SANITY_PROJECT_ID) 이 파일은
 * 쓰이지 않는다. 자격 증명 없이도 사이트가 완전히 동작하도록 두는 것이
 * 목적이다 — 리뷰어가 아무것도 설정하지 않고 열어볼 수 있어야 한다.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "mori-no-oto",
    client: "Mori no Oto",
    year: 2026,
    title: {
      en: "Mori no Oto — a record label that sounds like a forest",
      ja: "森の音 — 森のように響くレーベル",
    },
    summary: {
      en: "A bilingual identity and release platform for an ambient label in Kichijoji, built so that a two-person team can publish a release in an afternoon.",
      ja: "吉祥寺のアンビエントレーベルのための二言語アイデンティティとリリース基盤。2人体制でも半日でリリースを公開できる設計です。",
    },
    disciplines: {
      en: ["Brand identity", "Art direction", "Web"],
      ja: ["ブランドアイデンティティ", "アートディレクション", "ウェブ"],
    },
    body: {
      en: [
        "The label had twelve years of catalogue living in a spreadsheet and a Dropbox folder. Every release announcement was a hand-built page, and the Japanese and English versions had drifted far enough apart that they described different track listings.",
        "We rebuilt the catalogue as structured content first and designed second. Each release is one document with paired Japanese and English fields, so a translator sees both languages on one screen and the publish button refuses to work until both are complete.",
        "The visual language came from the room the records are mastered in — long horizontals, a lot of air, and type that sits low on the page. Motion is used exactly twice on the site, both times to mark a transition between catalogue eras.",
      ],
      ja: [
        "12年分のカタログがスプレッドシートとDropboxに散在していました。リリース告知のたびにページを手作業で作り、日英版は乖離した結果、収録曲さえ食い違っていました。",
        "まず構造化コンテンツとしてカタログを再構築し、デザインはその後に行いました。1リリース＝1ドキュメントで日英フィールドを対で持ち、翻訳者は1画面で両言語を確認できます。両方が揃うまで公開ボタンは動作しません。",
        "ビジュアル言語はマスタリングルームそのものから導きました。長い水平線、豊かな余白、ページ下方に沈むタイポグラフィ。モーションはサイト全体で2箇所のみ、いずれもカタログの時代の変わり目を示すために使っています。",
      ],
    },
    vimeoId: "76979871",
    filmLength: "2:14",
    results: {
      en: [
        { value: "1 afternoon", label: "to publish a release, from three days" },
        { value: "0", label: "divergent translations after launch" },
        { value: "94", label: "Lighthouse mobile, catalogue page" },
      ],
      ja: [
        { value: "半日", label: "リリース公開まで（従来は3日）" },
        { value: "0件", label: "公開後の翻訳齟齬" },
        { value: "94", label: "Lighthouse モバイル（カタログページ）" },
      ],
    },
  },
  {
    slug: "kissa-hoshi",
    client: "Kissa Hoshi",
    year: 2025,
    title: {
      en: "Kissa Hoshi — forty years of a coffee shop, in one scroll",
      ja: "喫茶ほし — 40年の喫茶店を、ひとつのスクロールに",
    },
    summary: {
      en: "An archive site for a Showa-era kissaten, assembled from four decades of photographs that had never been catalogued.",
      ja: "昭和から続く喫茶店のアーカイブサイト。40年分の未整理写真を一から目録化しました。",
    },
    disciplines: {
      en: ["Archive design", "Photography direction", "Web"],
      ja: ["アーカイブ設計", "フォトディレクション", "ウェブ"],
    },
    body: {
      en: [
        "Three thousand photographs, no dates on most of them, and an owner who remembered every single one. The project was as much oral history as it was design.",
        "We built the sequencing tool before the website. The owner sorted photographs by what he remembered happening, not by date, and that ordering became the spine of the site.",
        "Image weight was the whole engineering problem. Scans arrived at 60 megabytes each. The published page loads a 34 kilobyte AVIF and upgrades only what enters the viewport.",
      ],
      ja: [
        "3000枚の写真、その多くに日付はなく、しかし店主はすべてを覚えていました。このプロジェクトはデザインであると同時に口述史の記録でした。",
        "ウェブサイトより先に並べ替えツールを作りました。店主は日付ではなく「何があった日か」で写真を並べ、その順序がサイトの背骨になりました。",
        "画像の重量がエンジニアリング上の全課題でした。スキャンは1枚60MB。公開ページは34KBのAVIFを読み込み、ビューポートに入ったものだけを段階的に高解像度化します。",
      ],
    },
    results: {
      en: [
        { value: "3,000", label: "photographs catalogued" },
        { value: "34 KB", label: "median image weight on the page" },
        { value: "0", label: "layout shift across the archive scroll" },
      ],
      ja: [
        { value: "3,000枚", label: "目録化した写真" },
        { value: "34 KB", label: "ページ上の画像中央値" },
        { value: "0", label: "アーカイブスクロール中のレイアウトシフト" },
      ],
    },
  },
  {
    slug: "tsuki-ichi",
    client: "Tsuki Ichi",
    year: 2025,
    title: {
      en: "Tsuki Ichi — a monthly market that needed to be found",
      ja: "月いち — 見つけてもらうための月例マーケット",
    },
    summary: {
      en: "Wayfinding, print and a single-page site for a once-a-month craft market that moves venue every season.",
      ja: "季節ごとに会場が変わる月例クラフトマーケットのためのサイン計画・印刷物・1ページサイト。",
    },
    disciplines: {
      en: ["Wayfinding", "Print", "Web"],
      ja: ["サイン計画", "印刷", "ウェブ"],
    },
    body: {
      en: [
        "The market moves four times a year and its audience is split almost evenly between residents and visitors who do not read Japanese. Every piece had to work in two languages without doubling in size.",
        "We designed the system around one rule: the date and the station exit are always the two largest things, in both languages, on every surface from the A5 flyer to the site.",
        "The site is a single page. There is no navigation because there is nothing to navigate to — the whole proposition fits above the fold on a phone.",
      ],
      ja: [
        "マーケットは年4回会場を移し、来場者は地元住民と日本語を読まない訪問者でほぼ半々でした。すべての制作物が、分量を倍にせずに二言語で機能する必要がありました。",
        "ひとつの規則を軸に設計しました。A5フライヤーからサイトまで、どの面でも「日付」と「駅の出口」が両言語で常に最大であること。",
        "サイトは1ページです。遷移先がないためナビゲーションもありません。提案のすべてがスマートフォンのファーストビューに収まります。",
      ],
    },
    results: {
      en: [
        { value: "+41%", label: "first-time visitors, season over season" },
        { value: "1 page", label: "the entire website" },
        { value: "2 languages", label: "on every printed surface" },
      ],
      ja: [
        { value: "+41%", label: "初来場者数（前シーズン比）" },
        { value: "1ページ", label: "ウェブサイト全体" },
        { value: "2言語", label: "すべての印刷面で" },
      ],
    },
  },
];

export const SERVICES: Service[] = [
  {
    slug: "brand-identity",
    title: { en: "Brand identity", ja: "ブランドアイデンティティ" },
    summary: {
      en: "Marks, type systems and the rules that keep them intact once we hand them over.",
      ja: "マーク、タイポグラフィシステム、そして引き渡し後もそれを保つための規則。",
    },
    bullets: {
      en: [
        "Naming and verbal identity in Japanese and English",
        "Type systems tested at Japanese text density, not Latin",
        "A usage guide short enough that people actually read it",
      ],
      ja: [
        "日英のネーミングと言語アイデンティティ",
        "欧文ではなく和文の文字密度で検証したタイポグラフィシステム",
        "実際に読まれる長さに収めた運用ガイド",
      ],
    },
  },
  {
    slug: "digital",
    title: { en: "Digital", ja: "デジタル" },
    summary: {
      en: "Sites that stay fast after the launch post, because the budget is enforced by the build.",
      ja: "公開告知の後も速度を保つサイト。予算をビルドが強制するからです。",
    },
    bullets: {
      en: [
        "Bilingual architecture with field-level localisation",
        "Performance budgets asserted in CI, not promised in a deck",
        "A CMS an editor can use without calling us",
      ],
      ja: [
        "フィールド単位の多言語化による二言語アーキテクチャ",
        "資料での約束ではなくCIで assert されるパフォーマンス予算",
        "問い合わせ不要で編集者が使えるCMS",
      ],
    },
  },
  {
    slug: "motion",
    title: { en: "Motion", ja: "モーション" },
    summary: {
      en: "Short films and interface motion, used where it carries meaning and nowhere else.",
      ja: "短編映像とインターフェースのモーション。意味を担う箇所にのみ用います。",
    },
    bullets: {
      en: [
        "Identity films and release trailers",
        "Interface motion that respects prefers-reduced-motion",
        "Delivery in the formats your platform actually serves",
      ],
      ja: [
        "アイデンティティ映像とリリーストレーラー",
        "prefers-reduced-motion を尊重するインターフェースモーション",
        "配信プラットフォームが実際に扱う形式での納品",
      ],
    },
  },
];
