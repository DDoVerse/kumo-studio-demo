import { z } from "zod";

/**
 * Enquiry payload.
 *
 * This schema is the contract with the CRM. It is the single definition of
 * the shape, so the CRM side never has to guess at field names.
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

/** Reshape into what the HubSpot Forms API v3 accepts. */
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
 * Idempotency key, so a retry cannot create the same enquiry twice. The
 * message is part of the hash, so the same person sending the same thing
 * again produces the same key.
 */
export async function idempotencyKey(e: Enquiry): Promise<string> {
  const raw = `${e.email}|${e.message}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
