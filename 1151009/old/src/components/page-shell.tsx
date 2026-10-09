import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, LineIcon } from "./icons";

type Breadcrumb = { label: string; href?: string };

export function PageHero({
  title,
  englishTitle,
  description,
  image = "/images/architecture-hero.jpg",
  breadcrumbs = [],
}: {
  title: string;
  englishTitle: string;
  description?: string;
  image?: string;
  breadcrumbs?: Breadcrumb[];
}) {
  const crumbs = breadcrumbs.length ? breadcrumbs : [{ label: title }];
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <img
        className="page-hero-image"
        src={image}
        alt="建築與工程情境示意，非睿洋工程實績"
        width="1800"
        height="900"
        fetchPriority="high"
      />
      <div className="page-hero-shade" />
      <div className="container page-hero-content">
        <nav aria-label="麵包屑導覽" className="breadcrumbs">
          <Link href="/">首頁</Link>
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`}>
              <i aria-hidden="true">/</i>
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="page-hero-eyebrow">
          <span />
          {englishTitle}
        </p>
        <h1 id="page-title">
          {title}
          <span>.</span>
        </h1>
        {description && <p className="page-hero-description">{description}</p>}
        <span className="page-photo-credit">建築／工程情境示意</span>
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="inner-section-title">
      {eyebrow && (
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </p>
      )}
      <h2>
        {title}
        <span className="green-period">.</span>
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  kind = "building",
  children,
}: {
  title: string;
  description: string;
  kind?: "building" | "news" | "shield";
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <LineIcon name={kind} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function ContactBanner() {
  return (
    <aside className="inner-contact-banner">
      <div className="container">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            LET’S BUILD TOGETHER
          </p>
          <h2>
            期待與您合作<span className="green-period">.</span>
          </h2>
          <p>讓專業連結需求，讓合作創造可能。</p>
        </div>
        <Link href="/contact" className="button button-green">
          聯絡睿洋
          <ArrowIcon diagonal />
        </Link>
      </div>
    </aside>
  );
}
