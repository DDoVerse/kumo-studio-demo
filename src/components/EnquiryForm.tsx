"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type FormState } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionary";

/**
 * Enquiry form.
 *
 * The point is that the form works without this component. The action is a
 * Server Action, so with JavaScript disabled the browser simply posts it.
 * Everything here is enhancement: a disabled button while sending, and
 * inline errors.
 *
 * One of the only two files on the site that ship client JavaScript.
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
