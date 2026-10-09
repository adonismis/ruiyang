import { PageHero } from "@/components/page-shell";
import { ArrowIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "圖片來源與使用說明",
  "睿洋機電官網攝影素材來源、授權與情境示意說明。",
  "/credits",
);

const photos = [
  {
    author: "Sean Pollock",
    title: "商辦建築",
    image: "architecture-hero",
    url: "https://unsplash.com/photos/PhYq704ffdA",
  },
  {
    author: "Abigail Lynn",
    title: "建築立面",
    image: "architecture-detail",
    url: "https://unsplash.com/photos/PcWH2BzV61Y",
  },
  {
    author: "James Sullivan",
    title: "工程情境",
    image: "construction-careers",
    url: "https://unsplash.com/photos/ESZRBtkQ_f8",
  },
];

export default function CreditsPage() {
  return (
    <>
      <PageHero
        title="圖片來源與使用說明"
        englishTitle="PHOTO CREDITS"
        description="尊重創作，清楚呈現每一張照片的來源。"
      />
      <section className="inner-section">
        <div className="container">
          <div className="content-panel credits-intro">
            <h2>關於本網站的情境照片</h2>
            <p>
              網站建築及施工照片皆為情境示意，不代表睿洋機電的工程案例、公司據點、客戶或團隊。工程實績專區只使用經公司確認的案例與授權照片。
            </p>
            <p>
              品牌 LOGO
              與網站圖示沿用睿洋既有官網素材，未修改圖形、中英文名稱或字型結構。
            </p>
          </div>
          <div className="credit-cards">
            {photos.map((photo) => (
              <article key={photo.image}>
                <img
                  src={`/images/${photo.image}-small.jpg`}
                  alt={`${photo.title}情境示意`}
                  loading="lazy"
                />
                <span>UNSPLASH PHOTOGRAPHY</span>
                <h2>{photo.title}</h2>
                <p>{photo.author}</p>
                <a
                  className="text-link"
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  查看原始照片
                  <ArrowIcon diagonal />
                </a>
              </article>
            ))}
          </div>
          <p className="content-notice">
            上述照片依 Unsplash 授權使用。
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer"
            >
              查看 Unsplash 授權說明
            </a>
            。
          </p>
        </div>
      </section>
    </>
  );
}
