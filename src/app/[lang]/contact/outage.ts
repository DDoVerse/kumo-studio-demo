"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { localePath, isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const OUTAGE_COOKIE = "kumo_simulate_outage";

/**
 * CRM 장애 시뮬레이션 토글.
 *
 * 환경변수가 아니라 쿠키로 둔다. 환경변수는 컨테이너를 다시 띄워야 하므로
 * 리뷰어가 직접 켜고 끌 수 없고, 그러면 "폴백이 동작한다"가 다시 말로만
 * 남는다. 쿠키면 방문자마다 독립적이라 서로 영향도 주지 않는다.
 *
 * form action 으로 쓰므로 JavaScript 가 꺼져 있어도 눌린다.
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
  // 환경변수는 "항상 켜짐" 용도로 남겨둔다(데모 녹화 등).
  if (process.env.SIMULATE_CRM_OUTAGE === "1") return true;
  const jar = await cookies();
  return jar.get(OUTAGE_COOKIE)?.value === "1";
}
