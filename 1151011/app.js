"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const mobileLayout = window.matchMedia("(max-width: 960px)");

function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "開啟選單";
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector(".sr-only").textContent = isOpen ? "關閉選單" : "開啟選單";
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});
mobileLayout.addEventListener("change", closeMenu);

const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll("[data-go]")];
const hero = document.querySelector(".hero");
const pauseButton = document.querySelector("#pause-carousel");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let paused = reducedMotion.matches;
let carouselTimer;

function showSlide(index) {
  activeSlide = index;
  slides.forEach((slide, i) => {
    const active = i === index;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
    dots[i].classList.toggle("is-active", active);
    dots[i].setAttribute("aria-pressed", String(active));
  });
}

function updateCarousel() {
  window.clearInterval(carouselTimer);
  pauseButton.setAttribute("aria-label", paused ? "播放自動輪播" : "暫停自動輪播");
  pauseButton.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  if (!paused && !document.hidden && !hero.matches(":hover") && !hero.contains(document.activeElement)) {
    carouselTimer = window.setInterval(() => showSlide((activeSlide + 1) % slides.length), 7000);
  }
}

dots.forEach((dot) => dot.addEventListener("click", () => {
  showSlide(Number(dot.dataset.go));
  updateCarousel();
}));
pauseButton.addEventListener("click", () => {
  paused = !paused;
  updateCarousel();
});
hero.addEventListener("mouseenter", updateCarousel);
hero.addEventListener("mouseleave", updateCarousel);
hero.addEventListener("focusin", updateCarousel);
hero.addEventListener("focusout", () => window.setTimeout(updateCarousel, 0));
document.addEventListener("visibilitychange", updateCarousel);
reducedMotion.addEventListener("change", (event) => {
  paused = event.matches;
  updateCarousel();
});
updateCarousel();

const dialog = document.querySelector("#detail-dialog");
const dialogContent = {
  company: {
    eyebrow: "ABOUT RUIYANG",
    title: "認識睿洋機電",
    body: "<p>睿洋機電工程有限公司，穩健發展，追求企業永續經營及成長，提供良好品質與專業態度。</p><dl><dt>核准設立</dt><dd>2020 年（民國 109 年）</dd><dt>負責人</dt><dd>黃國庭</dd><dt>登記資本額</dt><dd>新臺幣 1,000 萬元整</dd><dt>服務據點</dt><dd>新竹總公司、台中辦公處</dd></dl><h3>企業組織與經營團隊</h3><p>部門架構、核心幹部介紹及人才培育制度，待資料確認後補充。</p><h3>公司證件與發展里程碑</h3><p>承裝業執照、公會證書及相關專業證件尚待提供，不於網站宣稱未確認之資格。2020 年以後的發展里程碑將依確認資料更新。</p>",
  },
  hvac: {
    eyebrow: "01 / HVAC SYSTEMS",
    title: "冷凍通風空調系統裝修",
    body: "<p>冷凍通風空調系統裝修為公司文件所列營業內容。我們以專業態度及良好品質，重視現場安全與施工細節。</p><h3>工程需求洽談</h3><p>您可先整理工程地點、空間用途、系統現況與預計時程。詳細服務內容、施工範圍與報價，需依實際需求另行確認。</p><a class=\"button button-blue\" href=\"#contact\" data-close-dialog>整理工程需求 <span aria-hidden=\"true\">↗</span></a>",
  },
  insulation: {
    eyebrow: "02 / THERMAL INSULATION",
    title: "保溫保冷安裝",
    body: "<p>保溫保冷安裝為公司文件所列營業內容。我們專注安裝品質，並重視各項施工環節。</p><h3>工程需求洽談</h3><p>您可先整理安裝位置、設備或管線現況、使用環境與預計時程。材料選用、施作方式及報價，需依實際工程需求另行確認。</p><a class=\"button button-blue\" href=\"#contact\" data-close-dialog>整理工程需求 <span aria-hidden=\"true\">↗</span></a>",
  },
  careers: {
    eyebrow: "CAREERS AT RUIYANG",
    title: "與睿洋一起成長",
    body: "<p>睿洋追求企業永續經營，重視同仁成長及健全的工作環境。</p><h3>企業理念與人才培育</h3><p>詳細培訓計畫及證照輔導政策，將於確認後公布。</p><h3>薪酬與員工福利</h3><p>福利制度與薪酬條件尚待確認，目前不列示未經確認之津貼或獎金。</p><h3>招募資訊</h3><p>目前尚未提供公開職缺及履歷投遞管道，正式職缺、工作內容與應徵方式將另行公告。</p>",
  },
  privacy: {
    eyebrow: "PRIVACY",
    title: "隱私權說明",
    body: "<p>本網站目前為靜態企業形象網站，未配置會員、廣告追蹤或分析 Cookie，也不會將諮詢表單內容傳送至伺服器。</p><h3>諮詢草稿</h3><p>您輸入的資料僅在目前瀏覽器頁面中處理。按下「下載諮詢草稿」會在您的裝置產生文字檔，不代表已將需求寄送給睿洋。網站不會將內容寫入瀏覽器本機儲存空間，請妥善保管下載檔案。</p><h3>外部連結</h3><p>地圖連結會另開 Google Maps 頁面，該服務依其自身隱私權政策處理資料。</p><h3>網站上線後</h3><p>網站主機可能保留一般連線紀錄。未來若啟用線上寄送或分析服務，應先更新本說明及相關告知內容。</p>",
  },
};
let dialogTrigger;

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = dialogContent[button.dataset.dialog];
    dialogTrigger = button;
    document.querySelector("#dialog-eyebrow").textContent = content.eyebrow;
    document.querySelector("#dialog-title").textContent = content.title;
    // Only the fixed, author-controlled content above is rendered as HTML.
    document.querySelector("#dialog-body").innerHTML = content.body;
    dialog.showModal();
    document.body.classList.add("modal-open");
  });
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-dialog]")) dialog.close();
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  dialogTrigger?.focus({ preventScroll: true });
});

const newsTabs = [...document.querySelectorAll("[data-news]")];
function selectNews(tab) {
  const isOfficial = tab.dataset.news === "official";
  newsTabs.forEach((item) => {
    item.setAttribute("aria-selected", String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  document.querySelector("#news-panel").setAttribute("aria-labelledby", tab.id);
  document.querySelector("#news-title").textContent = isOfficial ? "目前尚無最新公告" : "目前尚無公開工程動態";
  document.querySelector("#news-description").textContent = isOfficial ? "公司公告與最新資訊，將於確認後在此發布。" : "現場紀錄與工程活動，將於資料確認及取得授權後分享。";
}
newsTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectNews(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = event.key === "Home" ? 0 : event.key === "End" ? newsTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + newsTabs.length) % newsTabs.length;
    selectNews(newsTabs[next]);
    newsTabs[next].focus();
  });
});

const form = document.querySelector("#inquiry-form");
const formStatus = document.querySelector("#form-status");
form.querySelector('button[type="submit"]').disabled = false;
form.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
  formStatus.textContent = "";
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  for (const field of form.querySelectorAll("[required]")) {
    const value = field.value.trim();
    const invalid = value.length === 0 || (field.name === "message" && value.length < 10) || (field.name === "phone" && value.replace(/\D/g, "").length < 6);
    field.setCustomValidity(invalid ? "請填寫有效內容；電話至少 6 位數字，諮詢內容至少 10 字。" : "");
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const draft = [
    "睿洋機電工程有限公司｜工程諮詢草稿",
    "本檔案僅為需求草稿，尚未寄送至睿洋。",
    "",
    `姓名：${data.get("name").trim()}`,
    `聯絡電話：${data.get("phone").trim()}`,
    `公司名稱：${data.get("company").trim() || "未填寫"}`,
    `需求類別：${data.get("category")}`,
    "",
    "諮詢內容：",
    data.get("message").trim(),
  ].join("\n");
  try {
    const url = URL.createObjectURL(new Blob(["\uFEFF", draft], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "睿洋機電-工程諮詢草稿.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    formStatus.textContent = "已產生草稿並啟動下載；資料尚未寄送。請確認瀏覽器的下載項目並妥善保存。";
  } catch (error) {
    console.error("Unable to generate inquiry draft:", error);
    formStatus.textContent = "無法產生下載檔案，請手動複製您填寫的內容。資料尚未寄送。";
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll("#primary-nav a").forEach((link) => {
      const current = link.hash === `#${entry.target.id}`;
      link.classList.toggle("is-current", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
document.querySelector("#copyright-year").textContent = new Date().getFullYear();
