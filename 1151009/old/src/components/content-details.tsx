import { careers, contact, jobs, offices } from "@/content/site";
import { ArrowIcon, LineIcon } from "./icons";

export const hasContactChannels = Boolean(
  contact.phone || contact.email || contact.lineUrl,
);

export function ContactChannels() {
  return (
    <>
      {contact.phone && (
        <p>
          <a href={`tel:${contact.phone.replace(/[()\s-]/g, "")}`}>
            電話｜{contact.phone}
          </a>
        </p>
      )}
      {contact.email && (
        <p>
          <a href={`mailto:${contact.email}`}>電子郵件｜{contact.email}</a>
        </p>
      )}
      {contact.lineUrl && (
        <p>
          <a href={contact.lineUrl} target="_blank" rel="noreferrer">
            LINE 聯絡我們 <ArrowIcon diagonal />
          </a>
        </p>
      )}
    </>
  );
}

export function ContactContent() {
  return (
    <>
      <p>歡迎與睿洋機電聯繫，洽談您的工程需求。</p>
      <div className="dialog-offices">
        {offices.map((office) => (
          <div key={office.id}>
            <h3>{office.name}</h3>
            <p>{office.address}</p>
            {office.confirmationStatus === "pending" && (
              <p className="content-notice">{contact.addressNote}</p>
            )}
          </div>
        ))}
      </div>
      {hasContactChannels ? (
        <ContactChannels />
      ) : (
        <div className="pending-message">
          <span className="status-dot" />
          <p>{contact.availabilityNote}</p>
        </div>
      )}
      {!contact.formEnabled && (
        <p className="content-notice">
          線上諮詢尚未開放
          {hasContactChannels
            ? "，請透過上述聯絡方式與我們洽談。"
            : "，待正式聯絡管道確認後提供。"}
        </p>
      )}
    </>
  );
}

export function CareersContent() {
  const publishedJobs = jobs.filter((job) => job.status === "published");

  return (
    <>
      <p>{careers.description}</p>
      {publishedJobs.length ? (
        <div className="job-list">
          {publishedJobs.map((job) => {
            const applicationUrl = job.applicationUrl || careers.applicationUrl;
            return (
              <article key={job.id} className="job-detail">
                <h3>{job.title}</h3>
                <p>工作地點｜{job.location}</p>
                {job.description.length > 0 && (
                  <>
                    <h4>工作內容</h4>
                    <ul>
                      {job.description.map((paragraph, index) => (
                        <li key={index}>{paragraph}</li>
                      ))}
                    </ul>
                  </>
                )}
                {job.requirements.length > 0 && (
                  <>
                    <h4>職務需求</h4>
                    <ul>
                      {job.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </>
                )}
                <h4>應徵方式</h4>
                {job.applicationInstructions && (
                  <p>{job.applicationInstructions}</p>
                )}
                {applicationUrl ? (
                  <a
                    className="text-link"
                    href={applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    應徵此職缺 <ArrowIcon diagonal />
                  </a>
                ) : (
                  !job.applicationInstructions && (
                    <p className="content-notice">應徵方式待公司提供。</p>
                  )
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <>
          <div className="pending-message">
            <LineIcon name="building" />
            <div>
              <h3>{careers.emptyJobsMessage}</h3>
              <p>職缺資訊確認後，將在此提供正式應徵方式。</p>
            </div>
          </div>
          {careers.applicationUrl && (
            <a
              className="text-link"
              href={careers.applicationUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看招募資訊 <ArrowIcon diagonal />
            </a>
          )}
        </>
      )}
      <p className="content-notice">
        {careers.developmentNote}
        <br />
        {careers.benefitsNote}
      </p>
    </>
  );
}
