import Link from "next/link";
import { connection } from "next/server";
import { PageHero } from "@/components/page-shell";
import { ArrowIcon } from "@/components/icons";
import { company } from "@/content/site";
import { getContactConfig } from "@/lib/contact-server";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "個資告知",
  "睿洋機電網站線上諮詢表單的資料使用說明；正式告知內容待公司確認。",
  "/privacy",
);

export default async function PrivacyPage() {
  await connection();
  const available = Boolean(getContactConfig());
  return (
    <>
      <PageHero
        title="個資告知"
        englishTitle="PRIVACY NOTICE"
        description="了解線上諮詢資料的使用方式。"
      />
      <section className="section">
        <div className="container privacy-content">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            ONLINE INQUIRY NOTICE
          </p>
          <h2>
            線上諮詢資料說明<span className="green-period">.</span>
          </h2>
          <div className="privacy-draft-note">
            <strong>告知內容草案・待公司確認</strong>
            <p>
              {available
                ? "以下說明線上諮詢表單的資料處理方式。正式保存期限、個資聯絡窗口與完整告知內容，仍待公司確認。"
                : "線上諮詢目前尚未開放送出。您在表單內輸入的內容，不會由網站送出或儲存；以下為未來開放後的資料使用說明草案。"}
            </p>
          </div>
          <article className="privacy-item">
            <span>01</span>
            <div>
              <h3>填寫哪些資料</h3>
              <p>
                表單包含姓名、公司名稱（選填）、聯絡電話、電子郵件、需求類別、諮詢內容與同意欄位。請僅提供本次諮詢所需資訊。
              </p>
            </div>
          </article>
          <article className="privacy-item">
            <span>02</span>
            <div>
              <h3>資料使用目的</h3>
              <p>
                表單開放後，您主動送出的資料將供{company.name}
                了解需求、處理與回覆本次諮詢。網站不會將這些內容加入電子報訂閱名單。
              </p>
            </div>
          </article>
          <article className="privacy-item">
            <span>03</span>
            <div>
              <h3>送出與保存方式</h3>
              <p>
                表單開放後，諮詢內容會透過郵件服務傳送至公司指定的收件信箱。本網站沒有建立諮詢資料庫；郵件服務與公司信箱的保存期限及管理方式，將由公司正式確認後公告。
              </p>
            </div>
          </article>
          <article className="privacy-item">
            <span>04</span>
            <div>
              <h3>聯絡與資料處理需求</h3>
              <p>
                正式個資聯絡窗口、資料查詢或更正方式與完整告知內容，待公司確認後公告於本頁。線上諮詢開放前，請勿在表單填入敏感個人資料。
              </p>
            </div>
          </article>
          <Link
            className="button button-green privacy-back"
            href="/contact#inquiry"
          >
            返回聯絡我們
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
