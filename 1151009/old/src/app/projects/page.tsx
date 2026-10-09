import Link from "next/link";
import { projects } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { ProjectCard } from "@/components/catalog-cards";
import {
  PageHero,
  SectionTitle,
  EmptyState,
  ContactBanner,
} from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "營業實績",
  "瀏覽睿洋機電工程實績，依工程分類及年度探索案例、工程內容與現場照片。",
  "/projects",
);

type SearchParams = Promise<{
  category?: string | string[];
  year?: string | string[];
}>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const category = typeof query.category === "string" ? query.category : "";
  const year = typeof query.year === "string" ? query.year : "";
  const published = projects
    .filter((project) => project.status === "published")
    .sort((a, b) => b.year - a.year);
  const categories = [...new Set(published.map((project) => project.category))];
  const years = [...new Set(published.map((project) => String(project.year)))];
  const filtered = published.filter(
    (project) =>
      (!category || project.category === category) &&
      (!year || String(project.year) === year),
  );
  const isFiltered = Boolean(category || year);

  return (
    <>
      <PageHero
        title="營業實績"
        englishTitle="PROJECT PORTFOLIO"
        description="以工程紀錄，呈現每一項專業的實踐。"
        image="/images/architecture-hero.jpg"
        breadcrumbs={[{ label: "營業實績" }]}
      />
      <section className="inner-section">
        <div className="container">
          <SectionTitle
            eyebrow="OUR PROJECTS"
            title="工程實績總覽"
            description="依工程分類與年度，探索工程內容與照片紀錄。"
          />
          <form className="catalog-filters" action="/projects" method="get">
            <div className="catalog-filter-field">
              <label htmlFor="project-category">工程分類</label>
              <select
                id="project-category"
                name="category"
                defaultValue={category}
                key={`category-${category}`}
              >
                <option value="">全部分類</option>
                {category && !categories.includes(category) && (
                  <option value={category}>{category}（無相符分類）</option>
                )}
                {categories.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="catalog-filter-field">
              <label htmlFor="project-year">工程年度</label>
              <select
                id="project-year"
                name="year"
                defaultValue={year}
                key={`year-${year}`}
              >
                <option value="">全部年度</option>
                {year && !years.includes(year) && (
                  <option value={year}>{year}（無相符年度）</option>
                )}
                {years.map((item) => (
                  <option value={item} key={item}>
                    {item} 年
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button button-green">
              篩選實績
              <ArrowIcon />
            </button>
            {isFiltered && (
              <Link href="/projects" className="catalog-reset">
                清除篩選
              </Link>
            )}
            <span className="catalog-result-count">
              共 <strong>{filtered.length}</strong> 項工程實績
            </span>
          </form>
          {filtered.length ? (
            <div className="catalog-grid">
              {filtered.map((project) => (
                <ProjectCard project={project} key={project.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                isFiltered ? "沒有符合條件的工程實績" : "工程實績，持續整理中"
              }
              description={
                isFiltered
                  ? "請調整工程分類或年度，瀏覽其他工程紀錄。"
                  : "工程資料與實際案例照片尚待公司提供。確認後將於此公開工程分類、地點、年度及完整照片。"
              }
              kind="building"
            >
              {isFiltered ? (
                <Link href="/projects" className="text-link">
                  查看全部工程實績
                  <ArrowIcon />
                </Link>
              ) : (
                <Link href="/services" className="text-link">
                  了解營業項目
                  <ArrowIcon />
                </Link>
              )}
            </EmptyState>
          )}
          {!published.length && (
            <p className="catalog-footnote">
              僅刊登經公司確認的真實工程資料與具使用授權的照片。
            </p>
          )}
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
