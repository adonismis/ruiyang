import { createHash } from "node:crypto";
import { contact } from "@/content/site";
import { contactCategories, type ContactPayload } from "./contact-validation";

// Only import this module from Server Components or Route Handlers.
export function getContactConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const mailbox = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (
    !contact.formEnabled ||
    !apiKey ||
    !to ||
    !from ||
    !mailbox.test(to) ||
    !mailbox.test(from)
  )
    return null;
  return { apiKey, to, from };
}

type Bucket = { count: number; expiresAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60 * 1000;

// Basic, per-process protection: 3 attempts / email / 15 minutes, 20 total.
// Stores only hashed email keys, never form text. Multi-instance deployments
// must replace this with a shared rate limiter or an edge rate limiting rule.
export function checkContactRateLimit(email: string, now = Date.now()) {
  for (const [key, bucket] of buckets)
    if (bucket.expiresAt <= now) buckets.delete(key);
  const emailKey = createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex");
  const limits: [string, number][] = [
    ["total", 20],
    [emailKey, 3],
  ];
  for (const [key, maximum] of limits) {
    const bucket = buckets.get(key);
    if (bucket && bucket.count >= maximum)
      return Math.max(1, Math.ceil((bucket.expiresAt - now) / 1000));
  }
  for (const [key] of limits) {
    const bucket = buckets.get(key) ?? { count: 0, expiresAt: now + WINDOW_MS };
    bucket.count += 1;
    buckets.set(key, bucket);
  }
  return 0;
}

export async function readBoundedContactBody(request: Request) {
  const maximum = 32_768;
  if (Number(request.headers.get("content-length")) > maximum)
    throw new Error("too-large");
  if (!request.body) throw new Error("invalid-json");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new Error("too-large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

// Resend API: https://resend.com/docs/api-reference/emails/send-email
// No HTML interpolation; provider success must include an email ID.
export async function sendContactEmail(
  data: ContactPayload,
  config: NonNullable<ReturnType<typeof getContactConfig>>,
) {
  const category = contactCategories.find(
    ({ value }) => value === data.category,
  )!.label;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact/${data.submissionId}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: data.email,
      subject: `官網諮詢｜${category}`,
      text: [
        `需求類別：${category}`,
        `姓名：${data.name}`,
        `公司名稱：${data.company || "未填寫"}`,
        `聯絡電話：${data.phone}`,
        `電子郵件：${data.email}`,
        "",
        "諮詢內容：",
        data.message,
        "",
        "送出者已勾選個資告知與同意。",
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result: unknown = await response.json();
  return Boolean(
    result &&
    typeof result === "object" &&
    "id" in result &&
    typeof result.id === "string" &&
    result.id,
  );
}
