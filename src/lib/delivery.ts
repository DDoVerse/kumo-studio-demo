import { toHubSpotPayload, idempotencyKey, type Enquiry } from "./enquiry";

export type DeliveryResult = "sent" | "queued";

/**
 * Enquiry delivery.
 *
 * The happy path is a single POST to the HubSpot Forms API v3. The failure
 * path is the interesting one: an enquiry must not disappear because the
 * CRM is down.
 *
 *   HubSpot fails → queue in Redis → email immediately → cron retries with backoff
 *
 * The idempotency key is stored alongside, so retries cannot create
 * duplicate contacts — retries producing duplicates being the usual way
 * this design goes wrong.
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
        // A review environment with no credentials. Rather than fake a
        // success, take the queue path so the page tells the truth.
        await enqueue(key, enquiry, "no-credentials");
        await emailFallback(enquiry);
        return "queued";
      }
    } catch {
      // Falls through to the queue path below.
    }
  }

  await enqueue(key, enquiry, forcedOutage ? "simulated-outage" : "crm-error");
  await emailFallback(enquiry);
  return "queued";
}

/**
 * Queue in Redis. With no REDIS_URL the record goes to the server log
 * instead, so the flow is still visible to someone running this with no
 * infrastructure at all.
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
    // The idempotency key is the field name: the same enquiry overwrites
    // rather than accumulating.
    await client.hSet("enquiry:queue", key, JSON.stringify(record));
  } finally {
    await client.quit().catch(() => {});
  }
}

/** Email fallback, so a person has the enquiry before the queue drains. */
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
