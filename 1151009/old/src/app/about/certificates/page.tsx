import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import {
  ContactBanner,
  EmptyState,
  PageHero,
  SectionTitle,
} from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";
import { certificates } from "../content";

export const metadata = pageMetadata(
  "公司證件與資質",
  "睿洋機電工程有限公司證件及資質文件專區，提供經確認的證件資訊與公開文件。",
  "/about/certificates",
);

export default function CertificatesPage() {
  const publishedCertificates = certificates.filter(
    (certificate) => certificate.status === "published",
  );

  return (
    <>
      <PageHero
        title="公司證件 / 資質"
        englishTitle="QUALIFICATIONS"
        description="企業資質與公開文件。"
        breadcrumbs={[
          { label: "關於我們", href: "/about" },
          { label: "公司證件 / 資質" },
        ]}
      />
      <section className="inner-section">
        <div className="container">
          <SectionTitle
            eyebrow="COMPANY DOCUMENTS"
            title="證件資訊"
            description="本專區呈現經公司確認、可供公開查閱的正式證件。"
          />
          {publishedCertificates.length ? (
            <div className="company-certificate-grid">
              {publishedCertificates.map((certificate) => (
                <article
                  className="company-certificate-card"
                  key={certificate.id}
                >
                  {certificate.imageUrl && (
                    <a
                      href={certificate.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`開啟${certificate.title}圖片`}
                    >
                      <img
                        src={certificate.imageUrl}
                        alt={certificate.title}
                        width="720"
                        height="960"
                        loading="lazy"
                      />
                    </a>
                  )}
                  <span className="company-label">{certificate.type}</span>
                  <h3>{certificate.title}</h3>
                  {certificate.validUntil && (
                    <p>
                      有效期限：
                      <time dateTime={certificate.validUntil}>
                        {certificate.validUntil}
                      </time>
                    </p>
                  )}
                  {certificate.pdfUrl && (
                    <a
                      className="text-link"
                      href={certificate.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      檢視 PDF <ArrowIcon diagonal />
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="company-section-body">
              <EmptyState
                kind="shield"
                title="目前尚無公開證件"
                description="證件資料與公開文件待公司提供及確認後更新。"
              />
            </div>
          )}
          <Link href="/about" className="text-link company-section-action">
            返回關於我們 <ArrowIcon />
          </Link>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
