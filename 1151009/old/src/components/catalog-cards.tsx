import Link from "next/link";
import { ArrowIcon, LineIcon } from "@/components/icons";
import type { NewsArticle, Project, SiteImage } from "@/content/site";

export function CatalogImage({
  image,
  className = "",
}: {
  image: SiteImage;
  className?: string;
}) {
  return (
    <figure className={`catalog-image ${className}`}>
      {/* Content photographs can be local files or the company's image host. */}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
      />
      {image.usage === "illustrative" && (
        <figcaption>情境示意照片，非睿洋工程實績</figcaption>
      )}
    </figure>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="catalog-card">
      <Link href={`/projects/${project.slug}`} className="catalog-card-link">
        <CatalogImage image={project.coverImage} />
        <div className="catalog-card-body">
          <div className="catalog-meta">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3>{project.title}</h3>
          <p className="catalog-location">
            <LineIcon name="pin" />
            {project.location}
          </p>
          <span className="catalog-card-action">
            查看工程實績
            <ArrowIcon diagonal />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="catalog-card catalog-news-card">
      <Link href={`/news/${article.slug}`} className="catalog-card-link">
        {article.coverImage ? (
          <CatalogImage image={article.coverImage} />
        ) : (
          <div className="catalog-news-visual" aria-hidden="true">
            <LineIcon name="news" />
            <span>RUIYANG / NEWS CENTER</span>
          </div>
        )}
        <div className="catalog-card-body">
          <div className="catalog-meta">
            <span>{article.category}</span>
            <time dateTime={article.publishedAt}>
              {article.publishedAt.slice(0, 10).replaceAll("-", ".")}
            </time>
          </div>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <span className="catalog-card-action">
            閱讀文章
            <ArrowIcon diagonal />
          </span>
        </div>
      </Link>
    </article>
  );
}
