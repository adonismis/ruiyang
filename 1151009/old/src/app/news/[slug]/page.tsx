import Link from "next/link";
import { notFound } from "next/navigation";
import { news } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { CatalogImage, NewsCard } from "@/components/catalog-cards";
import { CatalogGallery } from "@/components/catalog-gallery";
import { PageHero, SectionTitle } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = news.find(
    (item) => item.slug === slug && item.status === "published",
  );
  if (!article) notFound();
  return pageMetadata(article.title, article.summary, `/news/${slug}`);
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const published = news
    .filter((item) => item.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const index = published.findIndex((item) => item.slug === slug);
  const article = published[index];
  if (!article) notFound();
  const previous = published[index - 1];
  const next = published[index + 1];
  const related = published
    .filter(
      (item) => item.id !== article.id && item.category === article.category,
    )
    .slice(0, 3);
  return (
    <>
      <PageHero
        title={article.title}
        englishTitle="NEWS & UPDATES"
        breadcrumbs={[
          { label: "新聞中心", href: "/news" },
          { label: article.title },
        ]}
      />
      <section className="inner-section">
        <div className="container">
          <article className="catalog-article">
            <div className="catalog-article-meta">
              <Link
                href={`/news?category=${encodeURIComponent(article.category)}`}
              >
                {article.category}
              </Link>
              <time dateTime={article.publishedAt}>
                {article.publishedAt.slice(0, 10).replaceAll("-", ".")}
              </time>
            </div>
            <p className="catalog-article-summary">{article.summary}</p>
            {article.coverImage && (
              <CatalogImage
                image={article.coverImage}
                className="catalog-detail-photo"
              />
            )}
            <div className="catalog-prose">
              {article.content.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
            {article.images.length > 0 && (
              <div className="catalog-related">
                <h2 className="catalog-small-heading">相關照片</h2>
                <CatalogGallery images={article.images} title={article.title} />
              </div>
            )}
          </article>
          <nav className="catalog-detail-pagination" aria-label="瀏覽其他消息">
            {previous ? (
              <Link href={`/news/${previous.slug}`}>
                <span>上一則消息</span>
                <strong>
                  <ArrowIcon className="catalog-arrow-back" />
                  {previous.title}
                </strong>
              </Link>
            ) : (
              <div />
            )}
            <Link href="/news" className="catalog-return-list">
              返回新聞中心
            </Link>
            {next ? (
              <Link href={`/news/${next.slug}`} className="catalog-next">
                <span>下一則消息</span>
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
              <SectionTitle eyebrow="RELATED NEWS" title="更多相關消息" />
              <div className="catalog-grid">
                {related.map((item) => (
                  <NewsCard article={item} key={item.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
