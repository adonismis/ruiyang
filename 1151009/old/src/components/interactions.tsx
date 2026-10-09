"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowIcon, LineIcon } from "./icons";
import { homepage, news } from "@/content/site";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => {
        if (element.getBoundingClientRect().top > window.innerHeight)
          element.classList.add("reveal-ready");
        observer.observe(element);
      });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

export function DetailButton({
  label,
  title,
  eyebrow,
  children,
  className = "text-link",
  arrow = true,
}: {
  label: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  return (
    <>
      <button
        className={className}
        onClick={() => {
          dialog.current?.showModal();
          setOpened(true);
        }}
      >
        {label}
        {arrow && <ArrowIcon diagonal />}
      </button>
      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-labelledby={titleId}
        onClose={() => setOpened(false)}
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          const box = dialog.current.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            dialog.current.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="關閉視窗"
          onClick={() => dialog.current?.close()}
        >
          <span />
          <span />
        </button>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={titleId}>{title}</h2>
        <div className="dialog-content">{children}</div>
        <button
          className="button button-green dialog-done"
          onClick={() => dialog.current?.close()}
        >
          關閉視窗 <ArrowIcon />
        </button>
      </dialog>
    </>
  );
}

export function NewsFeed() {
  const [category, setCategory] = useState<"最新消息" | "工程動態">("最新消息");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const categories = ["最新消息", "工程動態"] as const;
  const articles = news
    .filter(
      (article) =>
        article.status === "published" && article.category === category,
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
  return (
    <div className="news-feed">
      <div className="news-tabs" role="tablist" aria-label="新聞分類">
        {categories.map((name, index) => (
          <button
            key={name}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`news-tab-${index}`}
            role="tab"
            aria-selected={category === name}
            aria-controls="news-panel"
            tabIndex={category === name ? 0 : -1}
            onClick={() => setCategory(name)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
              setCategory(categories[next]);
              tabs.current[next]?.focus();
            }}
          >
            {name}
            <span>
              0
              {
                news.filter(
                  (article) =>
                    article.status === "published" && article.category === name,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <div
        id="news-panel"
        role="tabpanel"
        aria-labelledby={`news-tab-${categories.indexOf(category)}`}
        tabIndex={0}
      >
        {articles.length ? (
          <div className="news-list">
            {articles.map((article) => (
              <article key={article.id}>
                {article.coverImage && (
                  <img
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    loading="lazy"
                  />
                )}
                <span className="eyebrow">
                  {article.publishedAt} · {article.category}
                </span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <Link className="text-link" href={`/news/${article.slug}`}>
                  閱讀文章
                  <ArrowIcon diagonal />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <LineIcon name="news" />
            <div>
              <h3>
                {category === "最新消息"
                  ? homepage.news.emptyTitle
                  : "目前尚無公開工程動態"}
              </h3>
              <p>{homepage.news.emptyMessage}</p>
            </div>
            <span className="empty-en">STAY TUNED</span>
          </div>
        )}
      </div>
    </div>
  );
}
