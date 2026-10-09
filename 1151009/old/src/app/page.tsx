import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { NewsFeed } from "@/components/interactions";
import { ArrowIcon, LineIcon } from "@/components/icons";
import {
  ContactChannels,
  hasContactChannels,
} from "@/components/content-details";
import {
  careers,
  company,
  contact,
  homepage,
  offices,
  projects,
  services,
  sustainability,
} from "@/content/site";

function Eyebrow({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-line" />
      {children}
      {number && <span className="section-number">{number}</span>}
    </p>
  );
}

export const metadata = pageMetadata(
  "專業為本・品質為先",
  "認識睿洋機電工程有限公司，探索專業工程服務、營業實績與企業資訊。",
  "/",
);

export default function Home() {
  const publishedProjects = projects
    .filter((project) => project.status === "published" && project.featured)
    .slice(0, 3);
  const serviceImages = [
    "architecture-detail",
    "construction-careers",
    "architecture-hero",
  ];
  const heroDescriptionBreak = homepage.hero.description.indexOf("，");
  return (
    <>
      <section
        id="home"
        className="hero"
        tabIndex={-1}
        aria-labelledby="hero-title"
      >
        <img
          className="hero-image"
          src="/images/architecture-hero.jpg"
          srcSet="/images/architecture-hero-small.jpg 900w, /images/architecture-hero.jpg 2200w"
          sizes="100vw"
          width="2200"
          height="1467"
          alt="仰望現代商辦建築的玻璃帷幕，建築情境示意"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <p className="hero-eyebrow">
            <span />
            PRECISION IN EVERY DETAIL
          </p>
          <h1 id="hero-title">
            {homepage.hero.title[0]}
            <br />
            {homepage.hero.title[1]}
            <span className="hero-period">.</span>
          </h1>
          <p className="hero-english">
            {homepage.hero.englishTitle.split(" ")[0]}
            <br />
            {homepage.hero.englishTitle.split(" ").slice(1).join(" ")}
          </p>
          <p className="hero-description">
            {heroDescriptionBreak >= 0 ? (
              <>
                {homepage.hero.description.slice(0, heroDescriptionBreak + 1)}
                <br className="mobile-break" />
                {homepage.hero.description.slice(heroDescriptionBreak + 1)}
              </>
            ) : (
              homepage.hero.description
            )}
          </p>
          <div className="hero-actions">
            <Link
              className="button button-green"
              href={homepage.hero.primaryAction.href}
            >
              {homepage.hero.primaryAction.label}
              <ArrowIcon />
            </Link>
            <Link
              className="button button-outline"
              href={homepage.hero.secondaryAction.href}
            >
              {homepage.hero.secondaryAction.label}
              <ArrowIcon diagonal />
            </Link>
          </div>
        </div>
        <div className="hero-bottom container">
          <Link href="#about" className="scroll-cue">
            <span className="scroll-line" />
            SCROLL TO EXPLORE
          </Link>
          <span className="photo-note">
            <span />
            建築情境示意 · 非本公司工程實績
          </span>
          <span className="hero-index" aria-hidden="true">
            01<span>/ 08</span>
          </span>
        </div>
      </section>

      <div className="principles-bar">
        <div className="container principles-inner">
          <span className="principles-brand">
            RUIYANG <span>ELECTROMECHANICAL</span>
          </span>
          <div>
            <span>專業技術</span>
            <i />
            <span>工程品質</span>
            <i />
            <span>永續經營</span>
          </div>
          <span className="principles-since">EST. {company.foundedYear}</span>
        </div>
      </div>

      <section
        id="about"
        className="section about-section"
        tabIndex={-1}
        aria-labelledby="about-title"
      >
        <div className="container about-grid">
          <div className="about-visual" data-reveal>
            <figure className="about-photo">
              <img
                src="/images/architecture-detail.jpg"
                srcSet="/images/architecture-detail-small.jpg 600w, /images/architecture-detail.jpg 1200w"
                sizes="(max-width: 767px) 100vw, 50vw"
                alt="現代建築的銀灰色立面與結構線條，情境示意"
                width="1200"
                height="1798"
                loading="lazy"
              />
              <figcaption>ARCHITECTURAL PERSPECTIVE · 建築情境示意</figcaption>
            </figure>
            <div className="since-badge">
              <span>BUILDING OUR FUTURE</span>
              <strong>
                {company.foundedYear}
                <span>年</span>
              </strong>
              <p>睿洋機電・成立起點</p>
            </div>
            <span className="visual-axis" aria-hidden="true">
              ENGINEERING WITH PURPOSE
            </span>
          </div>
          <div className="about-copy" data-reveal>
            <Eyebrow number="02">{homepage.about.englishTitle}</Eyebrow>
            <h2 id="about-title">
              {homepage.about.title[0]}
              <br />
              {homepage.about.title[1]}
              <span className="green-period">.</span>
            </h2>
            <div className="short-rule" />
            <p className="body-large">
              從專業出發，
              <br />
              以品質回應每一份信任。
            </p>
            <p className="body-copy">{homepage.about.description}</p>
            <Link href="/about" className="text-link">
              認識睿洋
              <ArrowIcon diagonal />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="section services-section"
        tabIndex={-1}
        aria-labelledby="services-title"
      >
        <div className="container">
          <div className="section-heading" data-reveal>
            <div>
              <Eyebrow number="03">{homepage.services.englishTitle}</Eyebrow>
              <h2 id="services-title">
                {homepage.services.title}
                <span className="green-period">.</span>
              </h2>
            </div>
            <p className="section-intro">
              以專業服務為基礎，連結建築的每個環節。
              {services.some((service) => service.status === "pending") && (
                <>
                  <br />
                  <span>{homepage.services.emptyMessage}</span>
                </>
              )}
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article key={service.id} className="service-card" data-reveal>
                <img
                  src={
                    service.image?.src ||
                    `/images/${serviceImages[index % 3]}.jpg`
                  }
                  alt={
                    service.image?.alt || "工程與建築情境示意，服務內容待確認"
                  }
                  loading="lazy"
                  width="800"
                  height="1000"
                />
                <div className="service-shade" />
                <span className="card-index">
                  0{index + 1}
                  <span> / SERVICES</span>
                </span>
                <span className="service-image-note">
                  {service.image?.usage === "company" ? "" : "情境示意"}
                </span>
                <div className="service-copy">
                  <span className="pending-tag">
                    {service.status === "pending"
                      ? "營業項目待確認"
                      : "專業工程服務"}
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="service-link"
                  >
                    查看服務內容
                    <ArrowIcon diagonal />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="section projects-section"
        tabIndex={-1}
        aria-labelledby="projects-title"
      >
        <div className="container">
          <div className="section-heading" data-reveal>
            <div>
              <Eyebrow number="04">{homepage.projects.englishTitle}</Eyebrow>
              <h2 id="projects-title">
                {homepage.projects.title[0]}
                <br />
                {homepage.projects.title[1]}
                <span className="green-period">.</span>
              </h2>
            </div>
            <div className="projects-heading-aside">
              <p>每一項工程，都是專業的累積。</p>
              {!publishedProjects.length && (
                <span className="subtle-status">
                  <span className="status-dot" />
                  工程實績資料準備中
                </span>
              )}
            </div>
          </div>
          {publishedProjects.length ? (
            <div className="project-grid">
              {publishedProjects.map((project) => (
                <article className="project-card" key={project.id}>
                  <img
                    src={project.coverImage.src}
                    alt={project.coverImage.alt}
                    loading="lazy"
                  />
                  <p className="eyebrow">
                    {project.category} · {project.year}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-link"
                  >
                    查看工程
                    <ArrowIcon diagonal />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="portfolio-empty" data-reveal>
              <div className="project-placeholders" aria-hidden="true">
                {[1, 2, 3].map((item) => (
                  <div className="project-placeholder" key={item}>
                    <span className="placeholder-index">0{item}</span>
                    <LineIcon name="building" />
                    <span className="placeholder-caption">PROJECT TO COME</span>
                    <span className="drawing-corner" />
                  </div>
                ))}
              </div>
              <div className="portfolio-empty-caption">
                <div>
                  <h3>{homepage.projects.emptyTitle}</h3>
                  <p>{homepage.projects.emptyMessage}</p>
                </div>
                <span className="portfolio-wordmark">BUILT ON TRUST.</span>
              </div>
            </div>
          )}
          <div className="home-archive-link">
            <Link className="text-link" href="/projects">
              查看更多工程實績
              <ArrowIcon diagonal />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="sustainability"
        className="section sustainability-section"
        tabIndex={-1}
        aria-labelledby="sustainability-title"
      >
        <div className="container">
          <div className="sustainability-heading" data-reveal>
            <Eyebrow number="05">ESG & ESH</Eyebrow>
            <div>
              <h2 id="sustainability-title">
                {homepage.sustainability.title[0]}
                <span>{homepage.sustainability.title[1]}</span>
                <br />
                {homepage.sustainability.title[2]}
                <span className="green-period">.</span>
              </h2>
              <p>
                {homepage.sustainability.englishTitle.split(" & ")[0]}
                <br />&{" "}
                {homepage.sustainability.englishTitle
                  .split(" & ")
                  .slice(1)
                  .join(" & ")}
              </p>
            </div>
          </div>
          <div className="sustainability-grid">
            {sustainability.map((policy, index) => (
              <article className="policy-card" key={policy.id} data-reveal>
                <div className="policy-top">
                  <LineIcon
                    name={(["shield", "quality", "leaf"] as const)[index]}
                  />
                  <span>0{index + 1}</span>
                </div>
                <span className="policy-english">{policy.englishTitle}</span>
                <h3>{policy.title}</h3>
                <p>{policy.summary}</p>
                <Link
                  href={`/sustainability/${policy.id}`}
                  className="policy-link"
                >
                  了解更多
                  <ArrowIcon diagonal />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="news"
        className="section news-section"
        tabIndex={-1}
        aria-labelledby="news-title"
      >
        <div className="container news-layout">
          <div data-reveal>
            <Eyebrow number="06">{homepage.news.englishTitle}</Eyebrow>
            <h2 id="news-title">
              {homepage.news.title}
              <span className="green-period">.</span>
            </h2>
            <p className="news-intro">
              關注睿洋，
              <br />
              掌握我們的最新動態。
            </p>
          </div>
          <div data-reveal>
            <NewsFeed />
            <div className="home-archive-link">
              <Link className="text-link" href="/news">
                前往新聞中心
                <ArrowIcon diagonal />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="careers"
        className="careers-section"
        tabIndex={-1}
        aria-labelledby="careers-title"
      >
        <img
          src="/images/construction-careers.jpg"
          srcSet="/images/construction-careers-small.jpg 900w, /images/construction-careers.jpg 1800w"
          sizes="100vw"
          width="1800"
          height="2250"
          alt="建築施工現場與吊車，工程情境示意"
          loading="lazy"
        />
        <div className="careers-shade" />
        <div className="container careers-content" data-reveal>
          <Eyebrow number="07">{homepage.careers.englishTitle}</Eyebrow>
          <h2 id="careers-title">
            {homepage.careers.title[0]}
            <br />
            {homepage.careers.title[1]}
            <span className="green-period">.</span>
          </h2>
          <p>{careers.description}</p>
          <Link href="/careers" className="button button-white">
            加入我們
            <ArrowIcon diagonal />
          </Link>
        </div>
        <span className="careers-photo-note">
          工程情境示意 · 非本公司工地或團隊照片
        </span>
      </section>

      <section
        id="contact"
        className="section contact-section"
        tabIndex={-1}
        aria-labelledby="contact-title"
      >
        <div className="container">
          <div className="contact-heading" data-reveal>
            <div>
              <Eyebrow number="08">{homepage.contact.englishTitle}</Eyebrow>
              <h2 id="contact-title">
                {homepage.contact.title}
                <span className="green-period">.</span>
              </h2>
              <p>讓專業連結需求，讓合作創造可能。</p>
            </div>
            <Link href="/contact" className="button button-green">
              立即聯絡我們
              <ArrowIcon diagonal />
            </Link>
          </div>
          <div className="contact-offices" data-reveal>
            {offices.map((office) => (
              <div className="office" key={office.id}>
                <LineIcon name="pin" />
                <div>
                  <span className="office-english">{office.englishName}</span>
                  <h3>{office.name}</h3>
                  <p>{office.address}</p>
                  {office.confirmationStatus === "pending" && (
                    <span className="address-note">地址待公司確認</span>
                  )}
                </div>
              </div>
            ))}
            <div className="contact-availability">
              <span className="status-dot" />
              <div>
                <h3>{hasContactChannels ? "聯絡資訊" : "聯絡資訊準備中"}</h3>
                {hasContactChannels ? (
                  <ContactChannels />
                ) : (
                  <p>{contact.availabilityNote}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
