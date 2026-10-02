"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type FormState } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionary";

/**
 * 문의 폼.
 *
 * 핵심은 이 컴포넌트가 없어도 폼이 동작한다는 점이다. action 은 Server
 * Action 이라 JS 가 꺼져 있으면 브라우저가 그냥 POST 한다. 여기 있는
 * 클라이언트 코드는 전부 "보강"일 뿐이다 — 전송 중 버튼 비활성화와
 * 인라인 오류 표시.
 *
 * 사이트 전체에서 클라이언트 JS 가 실리는 두 곳 중 나머지 하나다.
 */

const field =
  "mt-2 w-full border border-rule bg-transparent px-3 py-2.5 text-[15px] " +
  "focus:border-ink focus:outline-none disabled:opacity-50";
const label = "text-[12px] uppercase tracking-[0.12em] text-ink-3";

function Submit({ t }: { t: Dict }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-10 border border-ink px-7 py-3 text-[15px] transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      {pending ? `${t.contact.sending}…` : t.contact.submit}
    </button>
  );
}

export default function EnquiryForm({ locale, t }: { locale: Locale; t: Dict }) {
  const [state, action] = useActionState<FormState, FormData>(submitEnquiry, {
    status: "idle",
  });
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} noValidate className="max-w-[40rem]">
      <input type="hidden" name="locale" value={locale} />

      {e.form ? (
        <p role="alert" className="mb-8 border-l-2 border-ink pl-4 text-[14px]">
          {t.contact.errors.generic}
        </p>
      ) : null}

      <div className="grid gap-7 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className={label} htmlFor="name">
            {t.contact.name}
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={v.name}
            aria-invalid={e.name ? true : undefined}
            aria-describedby={e.name ? "name-error" : undefined}
            className={field}
          />
          {e.name ? (
            <p id="name-error" className="mt-2 text-[13px]">
              {t.contact.errors.name}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-1">
          <label className={label} htmlFor="email">
            {t.contact.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={v.email}
            aria-invalid={e.email ? true : undefined}
            aria-describedby={e.email ? "email-error" : undefined}
            className={field}
          />
          {e.email ? (
            <p id="email-error" className="mt-2 text-[13px]">
              {t.contact.errors.email}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-1">
          <label className={label} htmlFor="company">
            {t.contact.company}
          </label>
          <input id="company" name="company" defaultValue={v.company} className={field} />
        </div>

        <div className="sm:col-span-1">
          <label className={label} htmlFor="budget">
            {t.contact.budget}
          </label>
          <select id="budget" name="budget" defaultValue={v.budget} className={field}>
            <option value="">—</option>
            {t.contact.budgetOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[13px] text-ink-3">{t.contact.budgetHelp}</p>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="message">
            {t.contact.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={7}
            required
            defaultValue={v.message}
            aria-invalid={e.message ? true : undefined}
            aria-describedby={e.message ? "message-error" : undefined}
            className={field}
          />
          {e.message ? (
            <p id="message-error" className="mt-2 text-[13px]">
              {t.contact.errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <Submit t={t} />
    </form>
  );
}
