import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, LineIcon } from "@/components/icons";
import { ContactBanner, PageHero } from "@/components/page-shell";
import { sustainability } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { policyPresentation } from "../policy-content";

type PolicyPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sustainability.map((policy) => ({ slug: policy.id }));
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = sustainability.find((item) => item.id === slug);
  if (!policy) notFound();
  return pageMetadata(
    policy.title,
    policy.summary,
    `/sustainability/${policy.id}`,
  );
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = sustainability.find((item) => item.id === slug);
  if (!policy) notFound();
  const presentation = policyPresentation[policy.id];

  return (
    <>
      <PageHero
        title={policy.title}
        englishTitle={policy.englishTitle}
        description={policy.summary}
        breadcrumbs={[
          { label: "企業永續與品質工安", href: "/sustainability" },
          { label: policy.title },
        ]}
      />
      <section className="inner-section">
        <div className="container policy-detail-grid">
          <aside className="policy-side-nav">
            <span className="company-label">ESG & ESH</span>
            <nav aria-label="企業永續與品質工安專區">
              {sustainability.map((item) => (
                <Link
                  key={item.id}
                  href={`/sustainability/${item.id}`}
                  aria-current={item.id === policy.id ? "page" : undefined}
                >
                  {item.title}
                  <ArrowIcon />
                </Link>
              ))}
            </nav>
            <Link className="text-link" href="/sustainability">
              返回專區總覽 <ArrowIcon diagonal />
            </Link>
          </aside>
          <article className="policy-article">
            <div className="policy-article-heading">
              <LineIcon name={presentation?.icon ?? "shield"} />
              <h2>{policy.title}</h2>
            </div>
            {policy.status === "pending" ? (
              <>
                <div className="content-notice">
                  <strong>正式政策內容準備中</strong>
                  <p>
                    以下為本專區的內容項目。具體政策、制度與執行措施，待公司提供並確認後公開。
                  </p>
                </div>
                <div className="policy-topics">
                  {presentation?.topics.map((topic, index) => (
                    <section key={topic.title}>
                      <span>0{index + 1}</span>
                      <div>
                        <h3>{topic.title}</h3>
                        <p>{topic.note}</p>
                      </div>
                    </section>
                  ))}
                </div>
              </>
            ) : (
              <div className="policy-published-copy">
                {policy.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
