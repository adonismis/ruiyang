import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="not-found container">
      <span className="not-found-number">404</span>
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>找不到這個頁面</h1>
      <p>網址可能已變更，或內容尚未公開。請由網站導覽繼續瀏覽。</p>
      <div>
        <Link href="/" className="button button-green">
          返回首頁
          <ArrowIcon />
        </Link>
        <Link href="/contact" className="text-link">
          聯絡我們
          <ArrowIcon diagonal />
        </Link>
      </div>
    </section>
  );
}
