import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { ArrowIcon, LineIcon } from "@/components/icons";
import { PageHero } from "@/components/page-shell";
import { company, contact } from "@/content/site";
import { getContactConfig } from "@/lib/contact-server";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "聯絡我們",
  "睿洋機電工程有限公司聯絡資訊、新竹總公司、台中辦公處與線上諮詢。",
  "/contact",
);

export default async function ContactPage() {
  await connection();
  const available = Boolean(getContactConfig());
  return (
    <>
      <PageHero
        title="聯絡我們"
        englishTitle="CONTACT US"
        description="期待與您合作，讓專業連結每一個需求。"
      />
      <section className="section contact-page-section">
        <div className="container contact-page-grid">
          <div className="contact-information">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              GET IN TOUCH
            </p>
            <h2>
              期待與您合作<span className="green-period">.</span>
            </h2>
            <p className="contact-company-name">{company.name}</p>
            <div className="contact-office-list">
              {contact.offices.map((office, index) => (
                <article className="contact-office-card" id={office.id} key={office.id}>
                  <div className="contact-office-top">
                    <LineIcon name="pin" />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="contact-office-english">{office.englishName}</p>
                  <h3>{office.name}</h3>
                  <address>{office.address}</address>
                  {office.confirmationStatus === "pending" && (
                    <p className="contact-office-pending">地址待公司確認</p>
                  )}
                  <a
                    className="contact-map-link"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Maps 查看地址
                    <span className="contact-visually-hidden">
                      ：{office.name}，另開視窗
                    </span>
                    <ArrowIcon diagonal />
                  </a>
                </article>
              ))}
            </div>
            <div className="contact-channel-list" aria-label="聯絡方式">
              <div>
                <span>聯絡電話</span>
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                    {contact.phone}
                  </a>
                ) : (
                  <p>待公司提供</p>
                )}
              </div>
              <div>
                <span>電子郵件</span>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                ) : (
                  <p>待公司提供</p>
                )}
              </div>
              <div>
                <span>LINE</span>
                {contact.lineUrl ? (
                  <a
                    href={contact.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    透過 LINE 聯絡（另開視窗）
                    <ArrowIcon diagonal />
                  </a>
                ) : (
                  <p>待公司提供</p>
                )}
              </div>
            </div>
            <p className="contact-address-note">{contact.addressNote}</p>
          </div>
          <div id="inquiry" className="contact-inquiry">
            <ContactForm available={available} />
          </div>
        </div>
      </section>
    </>
  );
}
