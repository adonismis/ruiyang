(function () {
  'use strict';

  var header = document.querySelector('.header');
  var gotop = document.querySelector('.gotop');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 60);
    if (gotop) gotop.classList.toggle('is-show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (gotop) {
    gotop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  document.querySelectorAll('.nav > ul > li').forEach(function (li) {
    var link = li.querySelector(':scope > a');
    if (!li.querySelector('.submenu')) return;
    link.addEventListener('click', function (e) {
      if (window.innerWidth > 1100) return;
      if (!li.classList.contains('is-open')) {
        e.preventDefault();
        li.classList.add('is-open');
      }
    });
  });

  // Hero slider
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.hero-slide');
    var dots = hero.querySelectorAll('.hero-dots button');
    var numEl = hero.querySelector('.hero-num b');
    var current = -1;

    // Autoplay advances when the active progress bar finishes, so pausing the CSS animation pauses the slider.
    function go(i) {
      i = (i + slides.length) % slides.length;
      if (i === current) return;
      if (current > -1) {
        slides[current].classList.remove('is-active');
        slides[current].setAttribute('aria-hidden', 'true');
        dots[current].classList.remove('is-active');
        dots[current].setAttribute('aria-selected', 'false');
      }
      current = i;
      slides[i].classList.add('is-active');
      slides[i].removeAttribute('aria-hidden');
      dots[i].classList.add('is-active');
      dots[i].setAttribute('aria-selected', 'true');
      if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
    }

    slides.forEach(function (slide) { slide.setAttribute('aria-hidden', 'true'); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { go(i); });
      dot.querySelector('i').addEventListener('animationend', function () {
        if (i === current) go(current + 1);
      });
    });

    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });

    function pause() { hero.classList.add('is-paused'); }
    function resume() { hero.classList.remove('is-paused'); }
    var ctrl = hero.querySelector('.hero-ctrl');
    if (ctrl) {
      ctrl.addEventListener('mouseenter', pause);
      ctrl.addEventListener('mouseleave', resume);
    }
    hero.addEventListener('focusin', function (e) {
      if (e.target.matches(':focus-visible')) pause();
    });
    hero.addEventListener('focusout', function (e) {
      if (!hero.contains(e.relatedTarget)) resume();
    });

    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    });

    var touchX = null;
    hero.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    // Preload remaining slide images so transitions don't flash.
    window.addEventListener('load', function () {
      hero.querySelectorAll('.hero-bg').forEach(function (bg) {
        var m = bg.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
        if (m) new Image().src = m[1];
      });
    });

    go(0);
  }

  // Counters
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Sub-nav active state
  var subLinks = document.querySelectorAll('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        subLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    subLinks.forEach(function (a) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) spy.observe(t);
    });
  }

  // Project filter
  var filterBtns = document.querySelectorAll('.filter button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(function (card) {
        card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.cat !== cat);
      });
    });
  });

  // Contact form (front-end validation only; connect to a backend before launch)
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      msg.textContent = '感謝您的來信，我們將盡快與您聯繫！';
      form.reset();
    });
  }

  var yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
