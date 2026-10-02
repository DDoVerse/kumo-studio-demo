import { toHubSpotPayload, idempotencyKey, type Enquiry } from "./enquiry";

export type DeliveryResult = "sent" | "queued";

/**
 * 문의 전달.
 *
 * 성공 경로는 HubSpot Forms API v3 한 번의 POST 다. 중요한 건 실패 경로다 —
 * CRM 이 죽어도 문의는 사라지면 안 된다.
 *
 *   HubSpot 실패 → Redis 큐에 적재 → 이메일로 즉시 폴백 → 크론이 지수 백오프 재시도
 *
 * 멱등 키를 같이 저장하므로 재시도가 연락처를 중복 생성하지 않는다.
 * 재시도 자체가 중복을 만드는 것이 이 구조에서 가장 흔한 사고다.
 */
export async function deliver(
  enquiry: Enquiry,
  forcedOutage = false,
): Promise<DeliveryResult> {
  const key = await idempotencyKey(enquiry);

  if (!forcedOutage) {
    try {
      const portal = process.env.HUBSPOT_PORTAL_ID;
      const form = process.env.HUBSPOT_FORM_ID;

      if (portal && form) {
        const res = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${form}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toHubSpotPayload(enquiry)),
            signal: AbortSignal.timeout(8000),
          },
        );
        if (res.ok) return "sent";
      } else {
        // 자격 증명이 없는 리뷰 환경. 전송을 성공으로 위장하지 않고
        // 큐 경로로 보낸다 — 그래야 화면이 사실을 말한다.
        await enqueue(key, enquiry, "no-credentials");
        await emailFallback(enquiry);
        return "queued";
      }
    } catch {
      // 아래 큐 경로로 떨어진다.
    }
  }

  await enqueue(key, enquiry, forcedOutage ? "simulated-outage" : "crm-error");
  await emailFallback(enquiry);
  return "queued";
}

/**
 * Redis 큐 적재. REDIS_URL 이 없으면 서버 로그에만 남긴다 —
 * 리뷰어가 인프라 없이 열어봐도 흐름이 보이게 하기 위함이다.
 */
async function enqueue(key: string, enquiry: Enquiry, reason: string): Promise<void> {
  const url = process.env.REDIS_URL;
  const record = { key, reason, at: new Date().toISOString(), enquiry, attempts: 0 };

  if (!url) {
    console.warn("[enquiry] queued (no REDIS_URL)", JSON.stringify(record));
    return;
  }

  const { createClient } = await import("redis");
  const client = createClient({ url });
  try {
    await client.connect();
    // 멱등 키를 그대로 필드명으로 쓴다. 같은 문의는 덮어쓰기만 되고 늘지 않는다.
    await client.hSet("enquiry:queue", key, JSON.stringify(record));
  } finally {
    await client.quit().catch(() => {});
  }
}

/** Resend 이메일 폴백. 큐가 비워지기 전에도 사람이 먼저 읽을 수 있게 한다. */
async function emailFallback(enquiry: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL ?? "hello@example.com";
  const body = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Company: ${enquiry.company || "—"}`,
    `Budget: ${enquiry.budget || "—"}`,
    `Language: ${enquiry.locale}`,
    "",
    enquiry.message,
  ].join("\n");

  if (!apiKey) {
    console.warn("[enquiry] email fallback (no RESEND_API_KEY)\n" + body);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Kumo Studio <site@example.com>",
      to: [to],
      subject: `Enquiry — ${enquiry.name}`,
      text: body,
    }),
    signal: AbortSignal.timeout(8000),
  }).catch((e) => console.error("[enquiry] email fallback failed", e));
}
