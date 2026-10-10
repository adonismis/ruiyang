"use strict";

// All three homepage versions load this shared, decorative brand opening.
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero, .hero-section");
  const logo = document.querySelector(".site-header img");
  if (!hero || !logo) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIntro = null;
  const replay = document.createElement("button");
  replay.type = "button";
  replay.className = "brand-intro-replay";
  replay.textContent = "重播開場 ↗";
  hero.append(replay);

  function notifyCarousel() {
    document.dispatchEvent(new Event("brandintrochange"));
  }

  function playIntro() {
    if (activeIntro || motion.matches) return;
    const previousFocus = document.activeElement;
    const intro = document.createElement("dialog");
    intro.className = "brand-intro";
    intro.setAttribute("aria-label", "睿洋機電品牌開場");
    intro.innerHTML = `
      <div class="brand-intro-identity">
        <p class="brand-intro-kicker">PRECISION · QUALITY · TRUST</p>
        <div class="brand-intro-logo"></div>
        <p class="brand-intro-tagline">專業築基，品質承諾。</p>
        <p class="brand-intro-english">RUIYANG ELECTROMECHANICAL</p>
      </div>
      <div class="brand-intro-progress" aria-hidden="true"><span></span></div>
      <p class="brand-intro-caption" aria-hidden="true">ENGINEERING A BETTER TOMORROW</p>
      <button type="button" class="brand-intro-skip">略過開場 <span aria-hidden="true">↗</span></button>`;
    const image = document.createElement("img");
    image.src = logo.currentSrc || logo.src;
    image.alt = "睿洋機電工程 RUIYANG";
    image.width = 1688;
    image.height = 569;
    intro.querySelector(".brand-intro-logo").append(image);
    document.body.append(intro);
    const skip = intro.querySelector(".brand-intro-skip");
    let timer;

    function finish() {
      if (activeIntro !== finish) return;
      activeIntro = null;
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", finish);
      motion.removeEventListener("change", finish);
      document.documentElement.classList.remove("brand-intro-playing");
      intro.close();
      intro.remove();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
      notifyCarousel();
    }

    activeIntro = finish;
    image.addEventListener("error", () => {
      console.error("品牌開場標誌載入失敗：", image.src);
      finish();
    }, { once: true });
    skip.addEventListener("click", finish);
    intro.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish();
    });
    intro.addEventListener("animationend", (event) => {
      if (event.target === intro && event.animationName === "brand-intro-depart") finish();
    });
    motion.addEventListener("change", finish);
    window.addEventListener("pagehide", finish, { once: true });
    document.documentElement.classList.add("brand-intro-playing");
    intro.showModal();
    skip.focus({ preventScroll: true });
    notifyCarousel();
    // Release the page even if animations are disabled by a browser extension.
    timer = window.setTimeout(finish, 3800);
  }

  replay.addEventListener("click", playIntro);
  if (!window.location.hash) playIntro();
});
