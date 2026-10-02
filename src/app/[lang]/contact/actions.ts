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
 * Enquiry submission.
 *
 * A Server Action, so this works with JavaScript disabled — the browser
 * posts the form and the result comes back as a redirect. That is also why
 * the success state travels in the query string rather than client state.
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
    // If no single field can be blamed, report it against the form.
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
