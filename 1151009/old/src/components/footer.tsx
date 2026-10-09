import Link from "next/link";
import { company } from "@/content/site";
import { ArrowIcon } from "./icons";

const groups = [
  {
    title: "關於睿洋",
    href: "/about",
    links: [
      { label: "公司簡介", href: "/about#profile" },
      { label: "企業組織與經營團隊", href: "/about#organization" },
      { label: "公司證件 / 資質", href: "/about/certificates" },
      { label: "服務據點", href: "/contact" },
    ],
  },
  {
    title: "專業與實績",
    href: "/services",
    links: [
      { label: "營業項目", href: "/services" },
      { label: "營業實績", href: "/projects" },
      { label: "工安衛政策", href: "/sustainability/safety" },
      { label: "品質政策與管理", href: "/sustainability/quality" },
    ],
  },
  {
    title: "企業資訊",
    href: "/sustainability",
    links: [
      { label: "企業永續與品質工安", href: "/sustainability" },
      { label: "企業社會責任", href: "/sustainability/responsibility" },
      { label: "新聞中心", href: "/news" },
      { label: "加入我們", href: "/careers" },
    ],
  },
  {
    title: "與我們聯繫",
    href: "/contact",
    links: [
      { label: "聯絡我們", href: "/contact" },
      { label: "線上諮詢", href: "/contact#inquiry" },
      { label: "個人資料告知", href: "/privacy" },
      { label: "圖片來源與使用說明", href: "/credits" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link
            href="/"
            className="footer-brand"
            aria-label="睿洋機電，回到首頁"
          >
            <img
              src="/brand/ruiyang-logo.png"
              alt="睿洋機電 Ruiyang Electromechanical"
              width="612"
              height="180"
            />
          </Link>
          <p>
            專業為本，品質為先。
            <br />
            <span>ENGINEERING A BETTER TOMORROW.</span>
          </p>
          <a href="#page-top" className="back-top" aria-label="回到頁首">
            <span>BACK TO TOP</span>
            <ArrowIcon />
          </a>
        </div>
        <nav className="footer-sitemap" aria-label="全站導覽">
          {groups.map((group) => (
            <div key={group.title}>
              <Link href={group.href} className="footer-group-title">
                {group.title}
              </Link>
              {group.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {company.englishName}. All rights
            reserved.
          </p>
          <span className="footer-legal-links">
            <Link href="/privacy">個人資料告知</Link>
            <Link href="/credits">圖片使用說明</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
