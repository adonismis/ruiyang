/**
 * 睿洋機電工程有限公司 (RUIYANG) - 官方網站主要互動腳本
 * 包含：形象輪播、導覽列滾動偵測、手機選單抽屜、數字遞增動畫、實績分類篩選
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 導覽列滾動縮放與陰影偵測
  initStickyHeader();

  // 2. 首頁形象輪播控制器 (Hero Carousel)
  initHeroSlider();

  // 3. 手機版抽屜式選單 (Mobile Drawer)
  initMobileDrawer();

  // 4. 營業實績分類篩選 (Projects Filter)
  initProjectsFilter();

  // 5. 數據指標遞增計數動畫 (Stats Counter)
  initStatsCounter();

  // 6. 回到頂部按鈕 (Back to Top)
  initBackToTop();
});

/**
 * 導覽列滾動狀態管理
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 首頁形象大圖輪播
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow-btn.prev');
  const nextBtn = document.querySelector('.hero-arrow-btn.next');
  const counterCurrent = document.querySelector('.hero-counter-current');
  const counterTotal = document.querySelector('.hero-counter-total');
  const heroSection = document.querySelector('.hero-section');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let slideTimer = null;
  const intervalTime = 6000;

  if (counterTotal) {
    counterTotal.textContent = String(totalSlides).padStart(2, '0');
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + totalSlides) % totalSlides;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');

    if (counterCurrent) {
      counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (document.documentElement.classList.contains('brand-intro-playing')) return;
    slideTimer = setInterval(nextSlide, intervalTime);
  }

  function stopAutoPlay() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // 事件綁定
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }
  document.addEventListener('brandintrochange', startAutoPlay);

  // 觸控手勢滑動支援 (Touch gestures)
  let touchStartX = 0;
  let touchEndX = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      startAutoPlay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      startAutoPlay();
    }
  }, { passive: true });

  startAutoPlay();
}

/**
 * 手機版側邊欄抽屜選單
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const menuItemsWithSubmenu = document.querySelectorAll('.mobile-menu-item.has-sub');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // 手機版下拉子選單展開切換
  menuItemsWithSubmenu.forEach(item => {
    const link = item.querySelector('.mobile-menu-link');
    link.addEventListener('click', (e) => {
      // 若有子選單，點擊展開/收合
      e.preventDefault();
      item.classList.toggle('active');
    });
  });
}

/**
 * 營業實績類別篩選
 */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * 數字遞增動畫 (Intersection Observer)
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(numElem => {
          const target = parseInt(numElem.getAttribute('data-target'), 10);
          const duration = 1600;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              numElem.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              numElem.textContent = Math.floor(current).toLocaleString();
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.about-preview-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/**
 * 回到頂部按鈕
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
