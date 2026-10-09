import Link from "next/link";
import { services } from "@/content/site";
import { ArrowIcon, LineIcon } from "@/components/icons";
import { CatalogImage } from "@/components/catalog-cards";
import { PageHero, SectionTitle, ContactBanner } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "營業項目",
  "了解睿洋機電工程的服務項目與相關工程實績。正式營業項目內容待公司確認後更新。",
  "/services",
);

export default function ServicesPage() {
  const hasPending = services.some((service) => service.status === "pending");
  return (
    <>
      <PageHero
        title="營業項目"
        englishTitle="OUR SERVICES"
        description="以良好工程品質與專業服務態度，作為企業發展方向。"
        image="/images/architecture-detail.jpg"
        breadcrumbs={[{ label: "營業項目" }]}
      />
      <section className="inner-section">
        <div className="container">
          <SectionTitle
            eyebrow="ENGINEERING SERVICES"
            title="專業服務，從了解需求開始"
            description="瀏覽各項服務介紹，了解服務內容及相關工程實績。"
          />
          {hasPending && (
            <p className="content-notice catalog-notice">
              正式服務分類與介紹尚待公司提供。以下為待補項目，不代表已確認的營業範圍。
            </p>
          )}
          <div className="catalog-grid catalog-services-grid">
            {services.map((service, index) => (
              <article className="catalog-service-card" key={service.id}>
                <Link href={`/services/${service.slug}`}>
                  {service.image ? (
                    <CatalogImage image={service.image} />
                  ) : (
                    <div className="catalog-service-drawing" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <LineIcon name="building" />
                      <small>RUIYANG / SERVICES</small>
                    </div>
                  )}
                  <div className="catalog-card-body">
                    <span className="catalog-status">
                      {service.status === "pending" ? "內容待補" : "工程服務"}
                    </span>
                    <h2>{service.title}</h2>
                    <p>{service.summary}</p>
                    <span className="catalog-card-action">
                      查看項目介紹
                      <ArrowIcon diagonal />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="catalog-bottom-link">
            <p>透過工程實績，進一步認識睿洋。</p>
            <Link href="/projects" className="text-link">
              前往營業實績
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
