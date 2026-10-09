import {
  checkContactRateLimit,
  getContactConfig,
  readBoundedContactBody,
  sendContactEmail,
} from "@/lib/contact-server";
import { validateContactPayload } from "@/lib/contact-validation";

export const runtime = "nodejs";

const reply = (
  body: object,
  status: number,
  headers?: Record<string, string>,
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export async function POST(request: Request) {
  const config = getContactConfig();
  if (!config)
    return reply({ message: "線上諮詢尚未開放，目前無法送出表單。" }, 503);

  // Browsers attach Origin to same-origin POSTs. Reject missing/foreign origins.
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL || request.url;
  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(expectedOrigin).origin;
  } catch {
    return reply({ message: "線上諮詢暫時無法使用。" }, 503);
  }
  if (
    origin !== allowedOrigin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return reply({ message: "無法驗證表單來源，請從本站聯絡頁面送出。" }, 403);
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return reply({ message: "不支援的表單格式。" }, 415);
  }

  let input: unknown;
  try {
    input = await readBoundedContactBody(request);
  } catch (error) {
    return error instanceof Error && error.message === "too-large"
      ? reply({ message: "表單內容過長，請縮短後再試。" }, 413)
      : reply({ message: "無法讀取表單內容，請重新填寫。" }, 400);
  }
  const validated = validateContactPayload(input);
  if (!validated.ok)
    return reply({ message: validated.message, errors: validated.errors }, 400);
  const retryAfter = checkContactRateLimit(validated.data.email);
  if (retryAfter)
    return reply({ message: "送出次數過於頻繁，請稍後再試。" }, 429, {
      "Retry-After": String(retryAfter),
    });

  try {
    if (await sendContactEmail(validated.data, config)) {
      return reply({ message: "郵件服務已受理您的諮詢，謝謝您的聯繫。" }, 200);
    }
  } catch {
    // Do not write personal details, API keys, or provider responses to logs.
  }
  return reply(
    {
      message:
        "目前無法確認諮詢是否送出，請稍後再試。您填寫的內容已保留在此頁面。",
    },
    502,
  );
}
