import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import {
  ContactBanner,
  EmptyState,
  PageHero,
  SectionTitle,
} from "@/components/page-shell";
import { careers, jobs } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "加入我們",
  "認識睿洋機電的人才理念、人才培育、薪酬福利及公開職缺，與睿洋一起打造更多可能。",
  "/careers",
);

export default function CareersPage() {
  const publishedJobs = jobs.filter((job) => job.status === "published");

  return (
    <>
      <PageHero
        title="加入我們"
        englishTitle="CAREERS AT RUIYANG"
        description="與睿洋一起，打造更多可能。"
        image="/images/construction-careers.jpg"
        breadcrumbs={[{ label: "加入我們" }]}
      />
      <nav className="company-section-nav" aria-label="加入我們頁面單元">
        <div className="container">
          <a href="#people">企業理念與人才培育</a>
          <a href="#benefits">薪酬與員工福利</a>
          <a href="#openings">我要應徵</a>
        </div>
      </nav>
      <section className="inner-section" id="people">
        <div className="container career-intro-grid">
          <figure className="career-intro-photo">
            <img
              src="/images/construction-careers.jpg"
              srcSet="/images/construction-careers-small.jpg 900w, /images/construction-careers.jpg 1800w"
              sizes="(max-width: 768px) 100vw, 50vw"
              width="1800"
              height="2250"
              alt="工程施工現場情境示意照片"
              loading="lazy"
            />
            <figcaption>工程情境示意照片，非本公司員工或工程實績</figcaption>
          </figure>
          <div className="career-intro-copy">
            <SectionTitle
              eyebrow="PEOPLE & GROWTH"
              title="同心前行，一起成長"
            />
            <p className="company-lead">{careers.description}</p>
            <div className="career-training">
              <span className="company-label">TALENT DEVELOPMENT</span>
              <h3>人才培育</h3>
              <p>{careers.developmentNote}</p>
            </div>
            <a className="text-link" href="#openings">
              查看公開職缺 <ArrowIcon diagonal />
            </a>
          </div>
        </div>
      </section>
      <section className="inner-section company-paper-section" id="benefits">
        <div className="container company-aside-grid">
          <SectionTitle
            eyebrow="COMPENSATION & BENEFITS"
            title="薪酬與員工福利"
            description="與工作、生活及成長相關的制度資訊。"
          />
          <EmptyState
            kind="building"
            title="福利制度資訊準備中"
            description={careers.benefitsNote}
          />
        </div>
      </section>
      <section className="inner-section" id="openings">
        <div className="container">
          <div className="career-openings-heading">
            <SectionTitle
              eyebrow="OPEN POSITIONS"
              title="尋找你的下一步"
              description="公開職缺與應徵資訊。"
            />
            <p>
              <strong>{String(publishedJobs.length).padStart(2, "0")}</strong>
              <span>公開職缺</span>
            </p>
          </div>
          {publishedJobs.length ? (
            <div className="career-jobs">
              {publishedJobs.map((job) => (
                <details className="career-job" key={job.id}>
                  <summary>
                    <div>
                      <span className="company-label">{job.location}</span>
                      <h3>{job.title}</h3>
                    </div>
                    <span className="career-job-toggle" aria-hidden="true">
                      ＋
                    </span>
                  </summary>
                  <div className="career-job-details">
                    <section>
                      <h4>工作內容</h4>
                      <ul>
                        {job.description.map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>職務需求</h4>
                      <ul>
                        {job.requirements.map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>應徵方式</h4>
                      <p>{job.applicationInstructions}</p>
                      {job.applicationUrl && (
                        <a
                          className="button button-green"
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          前往應徵 <ArrowIcon diagonal />
                        </a>
                      )}
                    </section>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="company-section-body">
              <EmptyState
                kind="news"
                title={careers.emptyJobsMessage}
                description="未來招募機會將於本頁更新，歡迎持續關注。"
              />
            </div>
          )}
          {careers.applicationUrl && (
            <a
              className="button button-green company-section-action"
              href={careers.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往招募平台 <ArrowIcon diagonal />
            </a>
          )}
          <Link className="text-link company-section-action" href="/about">
            進一步認識睿洋 <ArrowIcon diagonal />
          </Link>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
