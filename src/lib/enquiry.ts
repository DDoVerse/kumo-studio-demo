import { z } from "zod";

/**
 * 문의 페이로드.
 *
 * 이 스키마가 CRM 연동의 계약서다. JSON Schema 로 내보내 저장소에
 * 동봉하므로(scripts/emit-schema.ts) CRM 쪽이 추측할 일이 없다.
 */
export const EnquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(12).max(4000),
  locale: z.enum(["en", "ja"]),
});

export type Enquiry = z.infer<typeof EnquirySchema>;

/** HubSpot Forms API v3 가 받는 모양으로 변환. */
export function toHubSpotPayload(e: Enquiry) {
  return {
    fields: [
      { objectTypeId: "0-1", name: "firstname", value: e.name },
      { objectTypeId: "0-1", name: "email", value: e.email },
      { objectTypeId: "0-1", name: "company", value: e.company ?? "" },
      { objectTypeId: "0-1", name: "message", value: e.message },
      { objectTypeId: "0-1", name: "budget_range", value: e.budget ?? "" },
      { objectTypeId: "0-1", name: "preferred_language", value: e.locale },
    ],
    context: { pageName: "Kumo Studio — Contact" },
  };
}

/**
 * 멱등 키. 재시도가 같은 문의를 두 번 만들지 않게 한다.
 * 같은 사람이 같은 내용을 다시 보내면 같은 키가 나오도록 본문까지 넣는다.
 */
export async function idempotencyKey(e: Enquiry): Promise<string> {
  const raw = `${e.email}|${e.message}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
