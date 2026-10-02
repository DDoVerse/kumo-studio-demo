"use server";

import { redirect } from "next/navigation";
import { EnquirySchema } from "@/lib/enquiry";
import { deliver } from "@/lib/delivery";
import { isOutageSimulated } from "./outage";
import { localePath, isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export type FormState = {
  status: "idle" | "error";
  errors?: Partial<Record<"name" | "email" | "message" | "form", true>>;
  values?: Record<string, string>;
};

/**
 * 문의 제출.
 *
 * Server Action 이므로 JavaScript 가 꺼져 있어도 동작한다 — 브라우저가
 * form 을 그냥 POST 하고, 결과는 리다이렉트로 돌아온다. 그래서 성공 상태를
 * 클라이언트 state 가 아니라 쿼리스트링으로 넘긴다.
 */
export async function submitEnquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
    locale: String(formData.get("locale") ?? DEFAULT_LOCALE),
  };

  const parsed = EnquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: FormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "message") {
        errors[field] = true;
      }
    }
    // 어느 칸도 특정 못 했으면 폼 전체 오류로 돌린다.
    if (Object.keys(errors).length === 0) errors.form = true;
    return { status: "error", errors, values: raw };
  }

  const locale: Locale = isLocale(parsed.data.locale) ? parsed.data.locale : DEFAULT_LOCALE;

  let outcome: "sent" | "queued";
  try {
    outcome = await deliver(parsed.data, await isOutageSimulated());
  } catch {
    return { status: "error", errors: { form: true }, values: raw };
  }

  redirect(`${localePath(locale, "/contact")}?sent=${outcome}`);
}
