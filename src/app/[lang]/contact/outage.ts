"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { localePath, isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const OUTAGE_COOKIE = "kumo_simulate_outage";

/**
 * Simulated CRM outage toggle.
 *
 * Kept in a cookie rather than an environment variable. An env var needs a
 * redeploy, so a reviewer could not turn it on themselves and "the fallback
 * works" would go back to being a claim. A cookie is also per visitor, so
 * one person testing it does not affect anyone else.
 *
 * Used as a form action, so it works with JavaScript disabled.
 */
export async function toggleOutage(formData: FormData) {
  const jar = await cookies();
  const now = jar.get(OUTAGE_COOKIE)?.value === "1";
  jar.set(OUTAGE_COOKIE, now ? "0" : "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  const raw = String(formData.get("locale") ?? DEFAULT_LOCALE);
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  revalidatePath(localePath(locale, "/contact"));
}

export async function isOutageSimulated(): Promise<boolean> {
  // The env var stays as an "always on" switch, e.g. for recording a demo.
  if (process.env.SIMULATE_CRM_OUTAGE === "1") return true;
  const jar = await cookies();
  return jar.get(OUTAGE_COOKIE)?.value === "1";
}
