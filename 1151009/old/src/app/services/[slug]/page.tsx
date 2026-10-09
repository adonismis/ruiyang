import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, services } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { CatalogImage, ProjectCard } from "@/components/catalog-cards";
import {
  PageHero,
  SectionTitle,
  EmptyState,
  ContactBanner,
} from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return {
    ...pageMetadata(service.title, service.summary, `/services/${slug}`),
    ...(service.status === "pending"
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = projects.filter(
    (project) =>
      project.status === "published" &&
      service.relatedProjectIds.includes(project.id),
  );
  return (
    <>
      <PageHero
        title={service.title}
        englishTitle="SERVICE DETAIL"
        description={service.summary}
        breadcrumbs={[
          { label: "營業項目", href: "/services" },
          { label: service.title },
        ]}
      />
      <section className="inner-section">
        <div className="container catalog-detail-layout">
          <aside className="catalog-sidebar" aria-label="其他營業項目">
            <p className="eyebrow">OUR SERVICES</p>
            <h2>營業項目</h2>
            <nav>
              {services.map((item) => (
                <Link
                  key={item.id}
                  href={`/services/${item.slug}`}
                  aria-current={item.id === service.id ? "page" : undefined}
                >
                  {item.title}
                  <ArrowIcon />
                </Link>
              ))}
            </nav>
            <Link href="/contact" className="button button-green">
              聯絡諮詢
              <ArrowIcon />
            </Link>
          </aside>
          <div className="catalog-detail-content">
            <SectionTitle eyebrow="SERVICE OVERVIEW" title="服務介紹" />
            {service.status === "pending" ? (
              <EmptyState
                title="服務內容待公司確認"
                description="本項目的正式名稱、服務範圍、詳細說明及代表照片尚待提供。資料確認後將於本頁完整呈現。"
                kind="building"
              >
                <Link href="/contact" className="text-link">
                  前往聯絡我們
                  <ArrowIcon />
                </Link>
              </EmptyState>
            ) : (
              <div className="catalog-prose">
                <p className="catalog-lead">{service.summary}</p>
                {service.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
            {service.image && (
              <CatalogImage
                image={service.image}
                className="catalog-detail-photo"
              />
            )}
            <div className="catalog-related">
              <SectionTitle eyebrow="RELATED PROJECTS" title="相關工程實績" />
              {related.length ? (
                <div className="catalog-grid catalog-grid-two">
                  {related.map((project) => (
                    <ProjectCard project={project} key={project.id} />
                  ))}
                </div>
              ) : (
                <div className="catalog-inline-empty">
                  <p>目前尚無可公開的相關工程實績。</p>
                  <Link href="/projects" className="text-link">
                    瀏覽工程實績總覽
                    <ArrowIcon />
                  </Link>
                </div>
              )}
            </div>
            <Link href="/services" className="text-link catalog-return">
              <ArrowIcon className="catalog-arrow-back" />
              返回營業項目
            </Link>
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
