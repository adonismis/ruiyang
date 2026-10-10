(() => {
  "use strict";

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
  const pad = (n) => String(n).padStart(2, "0");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 已完成的頁面。新增頁面後把檔名加進來，其餘站內連結會先顯示「建置中」提示。
  const READY_PAGES = new Set(["index.html"]);

  /* ---------- 頂欄陰影 / 回到頂端 ---------- */
  function initScrollState() {
    const header = $("[data-header]");
    const toTop = $("[data-to-top]");
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 640);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- 主選單（桌機下拉 / 手機抽屜） ---------- */
  function initNav() {
    const nav = $("#primary-nav");
    const toggle = $(".nav-toggle");
    if (!nav || !toggle) return;

    const desktop = window.matchMedia("(min-width: 1025px)");

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
      document.body.classList.toggle("nav-open", open);
    };

    const collapseAll = () => {
      $$(".has-sub.is-open", nav).forEach((item) => {
        item.classList.remove("is-open");
        const btn = $(".nav__expand", item);
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    desktop.addEventListener("change", (e) => {
      if (e.matches) {
        setOpen(false);
        collapseAll();
      }
    });

    $$(".nav__expand", nav).forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.closest(".has-sub").classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    // Esc：手機版關閉抽屜；桌機版收合目前的下拉選單
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (nav.classList.contains("is-open") && !desktop.matches) {
        setOpen(false);
        toggle.focus();
        return;
      }
      const item = document.activeElement && document.activeElement.closest(".has-sub");
      if (item && desktop.matches) {
        item.classList.add("is-dismissed");
        const link = $(".nav__link", item);
        if (link) link.focus();
      }
    });

    $$(".has-sub", nav).forEach((item) => {
      item.addEventListener("mouseleave", () => item.classList.remove("is-dismissed"));
      item.addEventListener("focusout", (e) => {
        if (!item.contains(e.relatedTarget)) item.classList.remove("is-dismissed");
      });
    });
  }

  /* ---------- 形象輪播 ---------- */
  function initHero() {
    const root = $("[data-hero]");
    if (!root) return;

    const slides = $$(".hero__slide", root);
    const dots = $$(".hero__dot", root);
    const surface = $(".hero__slides", root);
    const counter = $("[data-hero-current]", root);
    const toggleBtn = $("[data-hero-toggle]", root);
    const total = slides.length;
    let index = 0;
    let userPaused = false;

    const render = () => {
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (counter) counter.textContent = pad(index + 1);
    };

    const go = (i) => {
      index = (i + total) % total;
      render();
    };

    const syncPlaying = () => {
      const playing = !reduceMotion.matches && !userPaused;
      root.classList.toggle("is-playing", playing);
      surface.setAttribute("aria-live", playing ? "off" : "polite");
      if (toggleBtn) toggleBtn.setAttribute("aria-label", playing ? "暫停自動輪播" : "開始自動輪播");
    };

    // 進度條動畫結束即換下一張，暫停（hover / focus）時進度與換頁會一起停住
    root.addEventListener("animationend", (e) => {
      if (e.animationName === "progress") go(index + 1);
    });

    root.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") root.classList.add("is-hover");
    });
    root.addEventListener("pointerleave", () => root.classList.remove("is-hover"));
    root.addEventListener("focusin", (e) => {
      if (e.target.matches(":focus-visible")) root.classList.add("is-hover");
    });
    root.addEventListener("focusout", (e) => {
      if (!root.contains(e.relatedTarget)) root.classList.remove("is-hover");
    });

    const prev = $("[data-hero-prev]", root);
    const next = $("[data-hero-next]", root);
    if (prev) prev.addEventListener("click", () => go(index - 1));
    if (next) next.addEventListener("click", () => go(index + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        userPaused = !userPaused;
        syncPlaying();
      });
    }

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    });

    // 觸控滑動
    let startX = 0;
    let startY = 0;
    let tracking = false;
    surface.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    });
    surface.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
    });
    surface.addEventListener("pointercancel", () => {
      tracking = false;
    });

    reduceMotion.addEventListener("change", syncPlaying);
    render();
    syncPlaying();
  }

  /* ---------- 營業項目橫向卡片 ---------- */
  function initServices() {
    const track = $("[data-svc-track]");
    if (!track) return;

    const prev = $("[data-svc-prev]");
    const next = $("[data-svc-next]");
    const bar = $(".slider-ctrl__bar");
    let ticking = false;

    const step = () => {
      const first = track.firstElementChild;
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const thumb = track.scrollWidth ? Math.min(100, (track.clientWidth / track.scrollWidth) * 100) : 100;
      const left = max > 0 ? (track.scrollLeft / track.scrollWidth) * 100 : 0;
      if (bar) {
        bar.style.setProperty("--thumb", thumb + "%");
        bar.style.setProperty("--left", left + "%");
      }
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = max <= 1 || track.scrollLeft >= max - 1;
      ticking = false;
    };

    const slide = (dir) =>
      track.scrollBy({ left: dir * step(), behavior: reduceMotion.matches ? "auto" : "smooth" });

    if (prev) prev.addEventListener("click", () => slide(-1));
    if (next) next.addEventListener("click", () => slide(1));
    track.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- 捲動顯示 / 數字跳動 ---------- */
  function initReveal() {
    const items = $$(".reveal");
    const formatter = new Intl.NumberFormat("en-US");

    const countUp = (el) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = formatter.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          $$("[data-count]", entry.target).forEach(countUp);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- 尚未建置的頁面：顯示提示而不是 404 ---------- */
  function initPendingPages() {
    const toast = $("[data-toast]");
    if (!toast) return;
    let timer;

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.protocol !== window.location.protocol || url.host !== window.location.host) return;

      const file = url.pathname.split("/").pop() || "index.html";
      if (!/\.html?$/i.test(file) || READY_PAGES.has(file)) return;

      e.preventDefault();
      toast.textContent = "此頁面建置中，敬請期待";
      toast.classList.add("is-show");
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove("is-show"), 2600);
    });
  }

  initScrollState();
  initNav();
  initHero();
  initServices();
  initReveal();
  initPendingPages();
  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
