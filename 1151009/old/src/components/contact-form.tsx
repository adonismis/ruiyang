"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "./icons";
import {
  contactCategories,
  validateContactPayload,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact-validation";

export function ContactForm({ available }: { available: boolean }) {
  const [startedAt, setStartedAt] = useState(0);
  const [submissionId, setSubmissionId] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);

  useEffect(() => {
    setStartedAt(Date.now());
    setSubmissionId(crypto.randomUUID());
  }, []);
  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  const errorAttributes = (field: ContactField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `error-${field}` : undefined,
  });
  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <span id={`error-${field}`} className="form-field-error">
        {errors[field]}
      </span>
    ) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || submitting.current) return;
    const form = event.currentTarget;
    const entries = new FormData(form);
    const payload = {
      name: entries.get("name"),
      company: entries.get("company"),
      phone: entries.get("phone"),
      email: entries.get("email"),
      category: entries.get("category"),
      message: entries.get("message"),
      consent: entries.get("consent") === "on",
      website: entries.get("website"),
      startedAt,
      submissionId,
    };
    const validation = validateContactPayload(payload);
    setErrors({});
    if (!validation.ok) {
      setErrors(validation.errors ?? {});
      setFeedback({ kind: "error", message: validation.message });
      return;
    }
    submitting.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
        signal: AbortSignal.timeout(20_000),
      });
      const result: { message?: string; errors?: ContactErrors } =
        await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setFeedback({
          kind: "error",
          message: result.message || "目前無法送出諮詢，請稍後再試。",
        });
        return;
      }
      form.reset();
      setStartedAt(Date.now());
      setSubmissionId(crypto.randomUUID());
      setFeedback({
        kind: "success",
        message: result.message || "郵件服務已受理您的諮詢。",
      });
    } catch {
      setFeedback({
        kind: "error",
        message:
          "目前無法確認諮詢是否送出，請稍後再試。您填寫的內容仍保留在此頁面。",
      });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-describedby={
        !available ? "inquiry-unavailable" : "inquiry-instructions"
      }
    >
      <div className="inquiry-heading">
        <p className="eyebrow">
          <span className="eyebrow-line" />
          ONLINE INQUIRY
        </p>
        <h2>
          線上諮詢<span className="green-period">.</span>
        </h2>
        <p id="inquiry-instructions">
          請留下您的需求與聯絡方式。標示{" "}
          <span className="required-mark">*</span> 為必填欄位。
        </p>
      </div>
      {!available && (
        <div className="inquiry-unavailable" id="inquiry-unavailable">
          <span className="status-dot" />
          <div>
            <strong>線上諮詢尚未開放</strong>
            <p>
              正式聯絡方式確認後將開放送出。目前表單僅供瀏覽，網站不會送出或儲存您填寫的內容。
            </p>
          </div>
        </div>
      )}
      <fieldset disabled={pending}>
        <legend className="contact-visually-hidden">
          您的聯絡資訊與諮詢需求
        </legend>
        <div className="contact-form-grid">
          <label className="form-field">
            <span>
              姓名{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <input
              name="name"
              autoComplete="name"
              placeholder="請填寫您的姓名"
              required
              maxLength={80}
              {...errorAttributes("name")}
            />
            {fieldError("name")}
          </label>
          <label className="form-field">
            <span>
              公司名稱 <small>選填</small>
            </span>
            <input
              name="company"
              autoComplete="organization"
              placeholder="請填寫公司名稱"
              maxLength={120}
              {...errorAttributes("company")}
            />
            {fieldError("company")}
          </label>
          <label className="form-field">
            <span>
              聯絡電話{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="含區碼或國碼"
              required
              minLength={7}
              maxLength={30}
              {...errorAttributes("phone")}
            />
            {fieldError("phone")}
          </label>
          <label className="form-field">
            <span>
              電子郵件{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              maxLength={254}
              {...errorAttributes("email")}
            />
            {fieldError("email")}
          </label>
          <label className="form-field form-field-wide">
            <span>
              需求類別{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <select
              name="category"
              required
              defaultValue=""
              {...errorAttributes("category")}
            >
              <option value="" disabled>
                請選擇需求類別
              </option>
              {contactCategories.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            {fieldError("category")}
          </label>
          <label className="form-field form-field-wide">
            <span>
              諮詢內容{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <textarea
              name="message"
              placeholder="請簡述您的需求、地點或其他希望我們了解的資訊（至少 10 字）"
              rows={6}
              required
              minLength={10}
              maxLength={5000}
              {...errorAttributes("message")}
            />
            {fieldError("message")}
            <small>
              請勿填寫身分證字號、帳戶資料或其他非諮詢必要的敏感資訊。
            </small>
          </label>
        </div>
        <div className="contact-trap" aria-hidden="true">
          <label>
            請留空
            <input name="website" autoComplete="off" tabIndex={-1} />
          </label>
        </div>
        <label className="contact-consent">
          <input
            type="checkbox"
            name="consent"
            required
            {...errorAttributes("consent")}
          />
          <span>
            我已閱讀
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              個資告知（另開視窗）
            </Link>
            ，同意為回覆本次諮詢使用所填資料。
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </span>
        </label>
        {fieldError("consent")}
      </fieldset>
      {feedback && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className={`contact-feedback contact-feedback-${feedback.kind}`}
          role={feedback.kind === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </div>
      )}
      <button
        className="button button-green contact-submit"
        type="submit"
        disabled={!available || pending || !startedAt}
      >
        {pending ? "正在送出…" : available ? "送出諮詢" : "尚未開放送出"}
        <ArrowIcon diagonal />
      </button>
      <noscript>
        <p className="form-field-error">
          請開啟 JavaScript 後使用線上諮詢表單。
        </p>
      </noscript>
    </form>
  );
}
