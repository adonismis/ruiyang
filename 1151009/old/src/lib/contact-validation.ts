export const contactCategories = [
  { value: "project", label: "工程諮詢" },
  { value: "business", label: "合作洽詢" },
  { value: "careers", label: "人才招募" },
  { value: "other", label: "其他需求" },
] as const;

export type ContactField =
  "name" | "company" | "phone" | "email" | "category" | "message" | "consent";
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactPayload = {
  name: string;
  company: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  consent: boolean;
  website: string;
  startedAt: number;
  submissionId: string;
};

export function validateContactPayload(
  input: unknown,
  now = Date.now(),
):
  | { ok: true; data: ContactPayload }
  | { ok: false; message: string; errors?: ContactErrors } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, message: "無法讀取表單內容，請重新填寫。" };
  }
  const raw = input as Record<string, unknown>;
  if (typeof raw.website !== "string" || raw.website.trim()) {
    return { ok: false, message: "無法驗證這次送出，請重新整理頁面後再試。" };
  }
  if (
    typeof raw.startedAt !== "number" ||
    !Number.isFinite(raw.startedAt) ||
    now - raw.startedAt < 3_000 ||
    now - raw.startedAt > 86_400_000 ||
    typeof raw.submissionId !== "string" ||
    !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(
      raw.submissionId,
    )
  ) {
    return {
      ok: false,
      message:
        "表單驗證已失效或填寫時間太短，請稍候再試；若仍無法送出，請重新整理頁面。",
    };
  }
  const text = (field: string) =>
    typeof raw[field] === "string" ? raw[field].trim() : "";
  const data: ContactPayload = {
    name: text("name"),
    company: text("company"),
    phone: text("phone"),
    email: text("email"),
    category: text("category"),
    message: text("message"),
    consent: raw.consent === true,
    website: "",
    startedAt: raw.startedAt,
    submissionId: raw.submissionId,
  };
  const errors: ContactErrors = {};
  const singleLine = /^[^\u0000-\u001f\u007f]*$/;
  if (!data.name || data.name.length > 80 || !singleLine.test(data.name))
    errors.name = "請填寫姓名（80 字以內）。";
  if (
    typeof raw.company !== "string" ||
    data.company.length > 120 ||
    !singleLine.test(data.company)
  )
    errors.company = "公司名稱請勿超過 120 字。";
  if (
    !/^[-+()\d\s.#extEXT]{7,30}$/.test(data.phone) ||
    data.phone.replace(/\D/g, "").length < 7 ||
    !singleLine.test(data.phone)
  )
    errors.phone = "請填寫有效的聯絡電話，可包含國碼或分機。";
  if (
    data.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) ||
    !singleLine.test(data.email)
  )
    errors.email = "請填寫有效的電子郵件。";
  if (!contactCategories.some(({ value }) => value === data.category))
    errors.category = "請選擇需求類別。";
  if (
    data.message.length < 10 ||
    data.message.length > 5_000 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data.message)
  )
    errors.message = "請填寫 10 至 5,000 字的諮詢內容。";
  if (!data.consent) errors.consent = "請先閱讀個資告知並勾選同意。";
  return Object.keys(errors).length
    ? { ok: false, message: "請確認標示的欄位後再送出。", errors }
    : { ok: true, data };
}
