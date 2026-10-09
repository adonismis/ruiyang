import Link from "next/link";
import { ArrowIcon, LineIcon } from "@/components/icons";
import {
  ContactBanner,
  EmptyState,
  PageHero,
  SectionTitle,
} from "@/components/page-shell";
import { company, offices } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { aboutSections } from "./content";

export const metadata = pageMetadata(
  "關於我們",
  "認識睿洋機電工程有限公司的公司背景、經營理念、企業組織、經營團隊、服務據點、公司資質與發展歷程。",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="關於我們"
        englishTitle="ABOUT RUIYANG"
        description="專業為本，品質為先。認識睿洋機電。"
        image="/images/architecture-detail.jpg"
        breadcrumbs={[{ label: "關於我們" }]}
      />

      <nav className="company-section-nav" aria-label="關於我們頁面單元">
        <div className="container">
          {aboutSections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="inner-section" id="profile">
        <div className="container company-intro-grid">
          <div>
            <SectionTitle
              eyebrow="01 / COMPANY PROFILE"
              title="專業工程，始於用心"
            />
            <p className="company-lead">{company.brief}</p>
            <div className="company-founded">
              <span>EST.</span>
              <strong>{company.foundedYear}</strong>
              <p>
                從專業出發
                <br />
                持續累積每一步
              </p>
            </div>
            <Link className="text-link" href="/services">
              探索營業項目 <ArrowIcon diagonal />
            </Link>
          </div>
          <figure className="company-intro-photo">
            <img
              src="/images/architecture-detail.jpg"
              srcSet="/images/architecture-detail-small.jpg 600w, /images/architecture-detail.jpg 1200w"
              sizes="(max-width: 768px) 100vw, 48vw"
              width="1200"
              height="1798"
              alt="現代建築外牆與結構細節，情境示意照片"
              loading="lazy"
            />
            <figcaption>建築情境示意照片，非本公司工程實績</figcaption>
          </figure>
        </div>
        <div className="container company-facts-wrap">
          <dl className="company-facts">
            <div>
              <dt>公司名稱</dt>
              <dd>{company.name}</dd>
            </div>
            <div>
              <dt>成立年份</dt>
              <dd>{company.foundedYear} 年</dd>
            </div>
            <div>
              <dt>統一編號</dt>
              <dd>{company.registration.taxId}</dd>
            </div>
            <div>
              <dt>登記資本額</dt>
              <dd>
                新臺幣{" "}
                {(company.registration.capitalTwd / 10000).toLocaleString(
                  "zh-TW",
                )}{" "}
                萬元
              </dd>
            </div>
          </dl>
          {company.registration.confirmationStatus === "pending" && (
            <p className="company-data-note">
              公司登記資料依現有資料呈現，正式公開前待公司再次確認。
            </p>
          )}
        </div>
      </section>

      <section
        className="inner-section company-paper-section"
        id="organization"
      >
        <div className="container company-aside-grid">
          <SectionTitle
            eyebrow="02 / ORGANIZATION"
            title="企業組織"
            description="從組織分工，認識睿洋的團隊架構。"
          />
          <EmptyState
            kind="building"
            title="組織架構資料準備中"
            description="企業組織圖與各單位介紹將於公司確認後公開。"
          />
        </div>
      </section>

      <section className="inner-section" id="team">
        <div className="container company-aside-grid">
          <SectionTitle
            eyebrow="03 / LEADERSHIP"
            title="經營團隊"
            description="以專業服務態度，作為企業發展方向。"
          />
          <article className="company-person-card">
            <div className="company-person-symbol" aria-hidden="true">
              <LineIcon name="building" />
              <span>RUIYANG</span>
            </div>
            <div className="company-person-copy">
              <span className="company-label">公司代表人</span>
              <h3>{company.registration.representative}</h3>
              <p>代表人資料待公司確認。</p>
              <p className="company-muted">
                管理團隊介紹、正式照片與經歷將於資料確認後更新。
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="inner-section company-paper-section" id="locations">
        <div className="container">
          <SectionTitle
            eyebrow="04 / OUR LOCATIONS"
            title="服務據點"
            description="新竹總公司與台中辦公處。"
          />
          <div className="company-office-grid">
            {offices.map((office, index) => (
              <article className="company-office-card" key={office.id}>
                <div className="company-office-top">
                  <LineIcon name="pin" />
                  <span>0{index + 1}</span>
                </div>
                <p className="company-label">{office.englishName}</p>
                <h3>{office.name}</h3>
                <address>{office.address}</address>
                {office.confirmationStatus === "pending" && (
                  <p className="company-data-note">地址待公司確認</p>
                )}
                <Link href={`/contact#${office.id}`} className="text-link">
                  據點與聯絡資訊 <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="inner-section" id="certificates">
        <div className="container company-aside-grid">
          <div>
            <SectionTitle
              eyebrow="05 / QUALIFICATIONS"
              title="公司證件 / 資質"
              description="公司證件及資質文件資訊。"
            />
            <Link
              className="text-link company-section-action"
              href="/about/certificates"
            >
              查看證件專區 <ArrowIcon diagonal />
            </Link>
          </div>
          <EmptyState
            kind="shield"
            title="證件資料待提供"
            description="經公司確認的證件名稱、類型、有效期限及公開文件，將於證件專區呈現。"
          />
        </div>
      </section>

      <section className="inner-section company-paper-section" id="milestones">
        <div className="container company-aside-grid">
          <SectionTitle
            eyebrow="06 / MILESTONES"
            title="每一步，持續向前"
            description="睿洋機電的發展歷程。"
          />
          <ol className="company-timeline">
            <li>
              <span className="company-timeline-dot" />
              <time dateTime="2020">2020</time>
              <div>
                <h3>公司核准設立登記</h3>
                <p>睿洋機電工程有限公司成立。</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
