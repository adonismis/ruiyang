(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-navigation');
  if (menuButton && menu) {
    const links = [...menu.querySelectorAll('a')];
    const closeMenu = (restoreFocus = false) => {
      menu.hidden = true;
      menuButton.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', '開啟導覽選單');
      document.body.style.overflow = '';
      if (restoreFocus) menuButton.focus();
    };
    menuButton.addEventListener('click', () => {
      if (!menu.hidden) return closeMenu();
      menu.hidden = false;
      menuButton.classList.add('is-open');
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', '關閉導覽選單');
      document.body.style.overflow = 'hidden';
      links[0]?.focus();
    });
    links.forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (menu.hidden) return;
      if (event.key === 'Escape') return closeMenu(true);
      if (event.key !== 'Tab' || !links.length) return;
      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        links[links.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
        event.preventDefault();
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1280 && !menu.hidden) closeMenu();
    });
  }

  const tabs = [...document.querySelectorAll('.news-tabs [role="tab"]')];
  const panel = document.querySelector('#news-panel');
  if (tabs.length && panel) {
    const heading = panel.querySelector('.news-empty h3');
    const activate = index => {
      tabs.forEach((tab, tabIndex) => {
        tab.setAttribute('aria-selected', String(tabIndex === index));
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tabs[index].id);
      if (heading) heading.textContent = index === 0 ? '目前尚無公開消息' : '目前尚無公開工程動態';
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
          (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        activate(next);
        tabs[next].focus();
      });
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }
})();
