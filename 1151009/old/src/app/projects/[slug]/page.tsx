import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { ProjectCard } from "@/components/catalog-cards";
import { CatalogGallery } from "@/components/catalog-gallery";
import { PageHero, SectionTitle, ContactBanner } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(
    (item) => item.slug === slug && item.status === "published",
  );
  if (!project) notFound();
  return pageMetadata(project.title, project.summary, `/projects/${slug}`);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const published = projects
    .filter((item) => item.status === "published")
    .sort((a, b) => b.year - a.year);
  const index = published.findIndex((item) => item.slug === slug);
  const project = published[index];
  if (!project) notFound();
  const previous = published[index - 1];
  const next = published[index + 1];
  const related = published
    .filter(
      (item) =>
        item.id !== project.id &&
        (project.relatedProjectIds.includes(item.id) ||
          item.category === project.category),
    )
    .slice(0, 3);
  const images = [
    project.coverImage,
    ...project.images.filter((image) => image.src !== project.coverImage.src),
  ];

  return (
    <>
      <PageHero
        title={project.title}
        englishTitle="PROJECT DETAIL"
        description={project.summary}
        breadcrumbs={[
          { label: "營業實績", href: "/projects" },
          { label: project.title },
        ]}
      />
      <section className="inner-section">
        <div className="container">
          <div className="catalog-project-intro">
            <div>
              <SectionTitle eyebrow="PROJECT OVERVIEW" title="工程概要" />
              <div className="catalog-prose">
                {project.description.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
            <dl className="catalog-project-facts">
              <div>
                <dt>工程分類</dt>
                <dd>
                  <Link
                    href={`/projects?category=${encodeURIComponent(project.category)}`}
                  >
                    {project.category}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>工程地點</dt>
                <dd>{project.location}</dd>
              </div>
              <div>
                <dt>工程年度</dt>
                <dd>{project.year} 年</dd>
              </div>
              <div>
                <dt>工程內容</dt>
                <dd>
                  {project.scope.length ? (
                    <ul>
                      {project.scope.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    "待補充"
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="catalog-related">
            <SectionTitle eyebrow="PROJECT GALLERY" title="工程照片" />
            <CatalogGallery images={images} title={project.title} />
          </div>
          <nav className="catalog-detail-pagination" aria-label="瀏覽其他工程">
            {previous ? (
              <Link href={`/projects/${previous.slug}`}>
                <span>上一項工程</span>
                <strong>
                  <ArrowIcon className="catalog-arrow-back" />
                  {previous.title}
                </strong>
              </Link>
            ) : (
              <div />
            )}
            <Link href="/projects" className="catalog-return-list">
              返回工程總覽
            </Link>
            {next ? (
              <Link href={`/projects/${next.slug}`} className="catalog-next">
                <span>下一項工程</span>
                <strong>
                  {next.title}
                  <ArrowIcon />
                </strong>
              </Link>
            ) : (
              <div />
            )}
          </nav>
          {related.length > 0 && (
            <div className="catalog-related">
              <SectionTitle eyebrow="RELATED PROJECTS" title="相關工程實績" />
              <div className="catalog-grid">
                {related.map((item) => (
                  <ProjectCard project={item} key={item.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
