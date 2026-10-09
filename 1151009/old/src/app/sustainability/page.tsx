import Link from "next/link";
import { ArrowIcon, LineIcon } from "@/components/icons";
import { ContactBanner, PageHero, SectionTitle } from "@/components/page-shell";
import { sustainability } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { policyPresentation } from "./policy-content";

export const metadata = pageMetadata(
  "企業永續與品質工安",
  "睿洋機電企業永續與品質工安專區，包含工安衛政策、品質政策與管理、企業社會責任。",
  "/sustainability",
);

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        title="企業永續與品質工安"
        englishTitle="ESG & ESH"
        description="重視品質，落實安全，邁向永續。"
        image="/images/construction-careers.jpg"
        breadcrumbs={[{ label: "企業永續與品質工安" }]}
      />
      <section className="inner-section">
        <div className="container">
          <div className="policy-intro">
            <SectionTitle
              eyebrow="QUALITY, SAFETY & SUSTAINABILITY"
              title="從工程專業，走向永續經營"
            />
            <p>
              認識睿洋在工安、品質與企業社會責任的發展方向。各項政策及實際措施，將於正式資料確認後公開。
            </p>
          </div>
          <div className="policy-card-grid">
            {sustainability.map((policy) => {
              const presentation = policyPresentation[policy.id];
              return (
                <Link
                  className="policy-card"
                  href={`/sustainability/${policy.id}`}
                  key={policy.id}
                >
                  <div className="policy-card-top">
                    <LineIcon name={presentation?.icon ?? "shield"} />
                    <span>{presentation?.number}</span>
                  </div>
                  <p className="company-label">{policy.englishTitle}</p>
                  <h2>{policy.title}</h2>
                  <p className="policy-card-description">{policy.summary}</p>
                  <span className="policy-card-action">
                    了解更多 <ArrowIcon diagonal />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <div className="policy-statement">
        <div className="container">
          <p>
            QUALITY.
            <br />
            SAFETY.
            <br />
            <span>SUSTAINABILITY.</span>
          </p>
          <div>
            <span className="company-label">RUIYANG ELECTROMECHANICAL</span>
            <h2>
              專業為本
              <br />
              品質為先
            </h2>
            <Link className="button button-white" href="/about">
              認識睿洋 <ArrowIcon diagonal />
            </Link>
          </div>
        </div>
      </div>
      <ContactBanner />
    </>
  );
}
