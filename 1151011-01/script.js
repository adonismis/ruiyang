"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const mobileViewport = window.matchMedia("(max-width: 980px)");

function closeMenu(restoreFocus = false) {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "開啟主選單");
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  mainNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "關閉主選單" : "開啟主選單");
});

document.addEventListener("click", (event) => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu(true);
});
document.addEventListener("focusin", (event) => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
mobileViewport.addEventListener("change", () => closeMenu());

const hero = document.querySelector(".hero");
const slides = [...document.querySelectorAll(".hero-slide")];
const slideButtons = [...document.querySelectorAll("[data-slide]")];
const pauseButton = document.querySelector(".carousel-pause");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let paused = reducedMotion.matches;
let carouselTimer;
let heroVisible = true;
let pointerOverHero = false;
let focusInHero = false;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
    slideButtons[slideIndex].classList.toggle("is-active", active);
    slideButtons[slideIndex].setAttribute("aria-pressed", String(active));
  });
}

function syncCarousel() {
  window.clearInterval(carouselTimer);
  if (paused || document.hidden || !heroVisible || pointerOverHero || focusInHero || dialog.open) return;
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
}

function updatePauseButton() {
  pauseButton.setAttribute("aria-label", paused ? "播放輪播" : "暫停輪播");
  pauseButton.firstElementChild.textContent = paused ? "▶" : "Ⅱ";
}

slideButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showSlide(index);
    syncCarousel();
  });
});
pauseButton.addEventListener("click", () => {
  paused = !paused;
  updatePauseButton();
  syncCarousel();
});
hero.addEventListener("mouseenter", () => { pointerOverHero = true; syncCarousel(); });
hero.addEventListener("mouseleave", () => { pointerOverHero = false; syncCarousel(); });
hero.addEventListener("focusin", () => { focusInHero = true; syncCarousel(); });
hero.addEventListener("focusout", (event) => {
  focusInHero = hero.contains(event.relatedTarget);
  syncCarousel();
});
document.addEventListener("visibilitychange", syncCarousel);
reducedMotion.addEventListener("change", () => {
  paused = reducedMotion.matches;
  updatePauseButton();
  syncCarousel();
});

// Inner pages are intentionally previews in this homepage-only delivery.
const pageContent = {
  about: { title: "關於睿洋", english: "ABOUT RUIYANG", description: "穩健發展，追求企業永續經營及成長，提供良好品質與專業態度。" },
  services: { title: "營業項目", english: "OUR SERVICES", description: "聚焦工程核心需求，將專業與品質落實在每一項服務。" },
  projects: { title: "營業實績", english: "OUR PROJECTS", description: "用工程成果，記錄專業與信賴。" },
  sustainability: { title: "永續與品質工安", english: "SUSTAINABILITY & ESH", description: "重視安全、堅持品質，與夥伴共同成長。" },
  news: { title: "新聞中心", english: "NEWS & UPDATES", description: "企業消息與工程動態，一起關注睿洋的下一步。" },
  careers: { title: "加入睿洋", english: "CAREERS", description: "以專業為起點，與團隊共同成長。" },
  contact: { title: "聯絡我們", english: "GET IN TOUCH", description: "立足新竹、連結台中，以下為目前已提供的服務據點資訊。" },
  "air-conditioning": { title: "冷凍・通風・空調系統", english: "HVAC SYSTEMS", description: "專業施工，重視品質與安全。" },
  insulation: { title: "保溫・保冷工程", english: "THERMAL INSULATION", description: "專注施作細節，落實工程品質。" }
};
const dialog = document.querySelector("#page-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogEyebrow = document.querySelector("#dialog-eyebrow");
const dialogDescription = document.querySelector("#dialog-description");
const dialogContent = document.querySelector("#dialog-content");
let dialogTrigger;

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.page;
    const content = pageContent[key];
    const template = document.getElementById(`content-${key}`);
    if (!content || !(template instanceof HTMLTemplateElement)) {
      console.error(`Missing page preview: ${key}`);
      window.alert("內容暫時無法開啟，請稍後再試。");
      return;
    }
    dialogTrigger = mainNav.contains(button) && mobileViewport.matches ? menuToggle : button;
    closeMenu();
    dialogEyebrow.textContent = content.english;
    dialogTitle.textContent = content.title;
    dialogDescription.textContent = content.description;
    dialogContent.replaceChildren(template.content.cloneNode(true));
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("dialog-open");
    syncCarousel();
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
let backdropPointerDown = false;
dialog.addEventListener("pointerdown", (event) => {
  const bounds = dialog.getBoundingClientRect();
  backdropPointerDown = event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
});
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (backdropPointerDown && event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  backdropPointerDown = false;
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (dialogTrigger) dialogTrigger.focus();
  syncCarousel();
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectNewsTab(selectedTab) {
  tabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectNewsTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectNewsTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

const backTop = document.querySelector(".back-top");
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
  document.querySelector(".brand").focus({ preventScroll: true });
});

if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    backTop.hidden = entry.isIntersecting;
    syncCarousel();
  });
  heroObserver.observe(hero);
} else {
  const updateScrollState = () => {
    heroVisible = hero.getBoundingClientRect().bottom > 0;
    backTop.hidden = heroVisible;
    syncCarousel();
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();
}

document.querySelector("#copyright-year").textContent = String(new Date().getFullYear());
updatePauseButton();
syncCarousel();
