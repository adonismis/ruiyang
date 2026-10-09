import Link from "next/link";
import { news } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { NewsCard } from "@/components/catalog-cards";
import { PageHero, SectionTitle, EmptyState } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "新聞中心",
  "掌握睿洋機電的最新消息、公司公告與工程動態。",
  "/news",
);
const PAGE_SIZE = 6;
type Props = {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const query = await searchParams;
  const category = typeof query.category === "string" ? query.category : "";
  const published = news
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const categories = [...new Set(published.map((article) => article.category))];
  const filtered = published.filter(
    (article) => !category || article.category === category,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = typeof query.page === "string" ? Number(query.page) : 1;
  const page = Number.isFinite(requestedPage)
    ? Math.min(totalPages, Math.max(1, Math.floor(requestedPage)))
    : 1;
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function pageHref(pageNumber: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    return `/news${params.size ? `?${params.toString()}` : ""}`;
  }
  return (
    <>
      <PageHero
        title="新聞中心"
        englishTitle="NEWS CENTER"
        description="關注睿洋，掌握最新消息與工程動態。"
        breadcrumbs={[{ label: "新聞中心" }]}
      />
      <section className="inner-section">
        <div className="container">
          <SectionTitle
            eyebrow="LATEST UPDATES"
            title="每一步，都是新的進展"
            description="公司消息、重要公告與工程現場的最新紀錄。"
          />
          <div className="catalog-news-toolbar">
            <nav className="catalog-category-tabs" aria-label="新聞分類">
              <Link href="/news" aria-current={!category ? "page" : undefined}>
                全部消息<span>{published.length}</span>
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/news?category=${encodeURIComponent(item)}`}
                  aria-current={category === item ? "page" : undefined}
                >
                  {item}
                  <span>
                    {
                      published.filter((article) => article.category === item)
                        .length
                    }
                  </span>
                </Link>
              ))}
            </nav>
            <p>共 {filtered.length} 則消息</p>
          </div>
          {visible.length ? (
            <div className="catalog-grid">
              {visible.map((article) => (
                <NewsCard article={article} key={article.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={category ? "此分類目前沒有公開消息" : "目前尚無公開消息"}
              description={
                category
                  ? "歡迎瀏覽其他分類，或回到全部消息。"
                  : "公司消息與工程動態將於確認後更新，敬請關注。"
              }
              kind="news"
            >
              <Link href={category ? "/news" : "/about"} className="text-link">
                {category ? "查看全部消息" : "認識睿洋機電"}
                <ArrowIcon />
              </Link>
            </EmptyState>
          )}
          {totalPages > 1 && (
            <nav className="catalog-pagination" aria-label="新聞列表分頁">
              {page > 1 && (
                <Link href={pageHref(page - 1)} aria-label="上一頁">
                  <ArrowIcon className="catalog-arrow-back" />
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (number) =>
                    number === 1 ||
                    number === totalPages ||
                    Math.abs(number - page) <= 2,
                )
                .map((number, index, pages) => (
                  <span className="catalog-pagination-item" key={number}>
                    {index > 0 && number - pages[index - 1] > 1 && (
                      <span className="catalog-pagination-gap">…</span>
                    )}
                    <Link
                      href={pageHref(number)}
                      aria-label={`第 ${number} 頁`}
                      aria-current={page === number ? "page" : undefined}
                    >
                      {number}
                    </Link>
                  </span>
                ))}
              {page < totalPages && (
                <Link href={pageHref(page + 1)} aria-label="下一頁">
                  <ArrowIcon />
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
