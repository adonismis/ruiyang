"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteImage } from "@/content/site";
import { ArrowIcon } from "@/components/icons";

export function CatalogGallery({
  images,
  title,
}: {
  images: SiteImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const total = images.length;
  const image = images[index];

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setIndex(
          (current) =>
            (current + (event.key === "ArrowLeft" ? -1 : 1) + total) % total,
        );
      }
    };
    dialog.addEventListener("keydown", handleKey);
    return () => {
      dialog.removeEventListener("keydown", handleKey);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [isOpen, total]);

  if (!image) return null;

  function move(direction: number) {
    setIndex((current) => (current + direction + total) % total);
  }

  return (
    <div className="catalog-gallery">
      <div className="catalog-gallery-stage">
        <button
          type="button"
          className="catalog-gallery-open"
          onClick={() => setIsOpen(true)}
          aria-label={`放大圖片：${image.alt}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
          <span>
            放大照片 <span aria-hidden="true">＋</span>
          </span>
        </button>
        {total > 1 && (
          <div className="catalog-gallery-controls">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="上一張照片"
            >
              <ArrowIcon className="catalog-arrow-back" />
            </button>
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="下一張照片"
            >
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
      <p className="catalog-photo-caption">
        {image.alt}
        {image.usage === "illustrative" && " · 情境示意照片，非睿洋工程實績"}
      </p>
      {total > 1 && (
        <div className="catalog-thumbnails" aria-label="選擇工程照片">
          {images.map((item, itemIndex) => (
            <button
              type="button"
              key={`${item.src}-${itemIndex}`}
              onClick={() => setIndex(itemIndex)}
              aria-label={`顯示第 ${itemIndex + 1} 張：${item.alt}`}
              aria-pressed={index === itemIndex}
            >
              <img
                src={item.src}
                alt=""
                width="160"
                height="110"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialogRef}
        className="catalog-lightbox"
        aria-label={`${title}照片檢視`}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="catalog-lightbox-content">
          <button
            type="button"
            className="catalog-lightbox-close"
            onClick={() => setIsOpen(false)}
            aria-label="關閉照片檢視"
            autoFocus
          >
            ×
          </button>
          <img src={image.src} alt={image.alt} />
          <div className="catalog-lightbox-caption">
            <p>
              {image.alt}
              {image.usage === "illustrative" && " · 情境示意照片"}
            </p>
            {total > 1 && (
              <div className="catalog-gallery-controls">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="上一張照片"
                >
                  <ArrowIcon className="catalog-arrow-back" />
                </button>
                <span aria-live="polite">
                  {index + 1} / {total}
                </span>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="下一張照片"
                >
                  <ArrowIcon />
                </button>
              </div>
            )}
          </div>
          <p className="catalog-lightbox-hint">使用 ← → 切換照片，Esc 關閉</p>
        </div>
      </dialog>
    </div>
  );
}
