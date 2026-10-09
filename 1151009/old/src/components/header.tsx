"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company, navigation } from "@/content/site";
import { ArrowIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = navigation.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  )?.id;
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = panel.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab" && links?.length) {
        const first = toggle.current;
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand"
        aria-label={`${company.name}，回到首頁`}
        onClick={() => setOpen(false)}
      >
        <img
          src="/brand/ruiyang-logo.png"
          width="612"
          height="180"
          alt="睿洋機電 Ruiyang Electromechanical"
        />
      </Link>
      <nav className="desktop-nav" aria-label="主要導覽">
        {navigation.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${active === item.id ? "is-active" : ""} ${item.id === "contact" ? "nav-contact" : ""}`}
            aria-current={active === item.id ? "page" : undefined}
          >
            {item.label}
            {item.id === "contact" && <ArrowIcon diagonal />}
          </Link>
        ))}
      </nav>
      <button
        ref={toggle}
        className={`menu-toggle ${open ? "is-open" : ""}`}
        aria-label={open ? "關閉導覽選單" : "開啟導覽選單"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        ref={panel}
        id="mobile-navigation"
        className="mobile-menu"
        hidden={!open}
      >
        <span className="eyebrow">EXPLORE RUIYANG</span>
        <nav aria-label="行動版主要導覽">
          {navigation.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className="menu-number">0{index + 1}</span>
              <span>
                {item.label}
                <small>{item.englishLabel}</small>
              </span>
              <ArrowIcon diagonal />
            </Link>
          ))}
        </nav>
        <p>專業為本，品質為先。</p>
      </div>
    </header>
  );
}
