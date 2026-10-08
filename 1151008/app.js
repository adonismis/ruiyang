const fontStylesheet=document.createElement('link');fontStylesheet.rel='stylesheet';fontStylesheet.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&display=swap';document.head.append(fontStylesheet);
function setupBrandIntro() {
  const hero = document.querySelector('.hero');
  const brandMark = document.querySelector('.header .brand-mark');
  if (!hero || !brandMark) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeIntro = null;
  function playIntro() {
    if (activeIntro || motion.matches) return;
    const previousFocus = document.activeElement;
    const intro = document.createElement('div');
    intro.className = 'brand-intro';
    intro.setAttribute('role', 'dialog');
    intro.setAttribute('aria-modal', 'true');
    intro.setAttribute('aria-label', '睿洋機電品牌開場');
    intro.innerHTML = `
      <div class="intro-identity">
        <div class="intro-emblem" aria-hidden="true"></div>
        <div class="intro-name">睿洋機電</div>
        <div class="intro-english">RUIYANG ELECTROMECHANICAL</div>
      </div>
      <div class="intro-progress" aria-hidden="true"></div>
      <button type="button" class="intro-skip">略過開場 <span aria-hidden="true">↗</span></button>`;
    intro.querySelector('.intro-emblem').append(brandMark.cloneNode(true));
    const background = [...document.body.children].map(element => [element, element.inert]);
    background.forEach(([element]) => { element.inert = true; });
    document.body.append(intro);
    document.documentElement.classList.add('intro-playing');
    const skip = intro.querySelector('.intro-skip');
    skip.focus({ preventScroll: true });
    let timer;
    function finish() {
      if (activeIntro !== finish) return;
      activeIntro = null;
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      removeEventListener('pagehide', finish);
      motion.removeEventListener('change', finish);
      background.forEach(([element, inert]) => { element.inert = inert; });
      document.documentElement.classList.remove('intro-playing');
      intro.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    }
    function onKey(event) {
      if (event.key === 'Escape') finish();
      if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
    }
    activeIntro = finish;
    skip.addEventListener('click', finish);
    document.addEventListener('keydown', onKey);
    motion.addEventListener('change', finish);
    intro.addEventListener('animationend', event => {
      if (event.target === intro && event.animationName === 'intro-depart') finish();
    });
    timer = setTimeout(finish, 3600);
    addEventListener('pagehide', finish, { once: true });
  }
  const replay = document.createElement('button');
  replay.type = 'button';
  replay.className = 'intro-replay';
  replay.textContent = '重播開場 ↗';
  replay.addEventListener('click', playIntro);
  hero.querySelector('.hero-bottom').append(replay);
  if (!location.hash) playIntro();
}
setupBrandIntro();
function setupScrollReveal() {
  if (!document.querySelector('.hero') || !('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const groups = [
    '.quick-nav a',
    '.services-home .section-heading, .services-grid .service-card, .section-foot',
    '.about-grid > *',
    '.values-section .eyebrow, .values-section h2, .values-section .value-row, .values-section > .container > .text-link',
    '.news-home .section-heading, .news-home .empty-inline',
    '.careers-home .container > *',
    '.contact-strip .container > *'
  ];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
      observer.observe(element);
    });
  });
  document.documentElement.classList.add('has-scroll-reveal');
}
setupScrollReveal();
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
const header=document.querySelector('.header');
function updateHeader(){header.classList.toggle('is-scrolled',scrollY>20)}
updateHeader();addEventListener('scroll',updateHeader,{passive:true});
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','開啟選單')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'關閉選單':'開啟選單')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const slides=[...document.querySelectorAll('[data-slide]')];
if(slides.length){
  const hero=document.querySelector('.hero');
  const number=document.querySelector('.slide-number');
  let current=-1;
  let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pause=document.querySelector('[data-slide-pause]');
  slides.forEach(slide=>{slide.hidden=false;slide.setAttribute('aria-hidden','true')});
  function show(i){
    current=(i+slides.length)%slides.length;
    slides.forEach((slide,n)=>{
      const active=n===current;
      slide.classList.toggle('active',active);
      slide.setAttribute('aria-hidden',String(!active));
    });
    number.textContent=String(current+1).padStart(2,'0');
  }
  function pauseLabel(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'播放輪播':'暫停輪播')}
  document.querySelector('[data-slide-prev]').addEventListener('click',()=>{paused=true;pauseLabel();show(current-1)});
  document.querySelector('[data-slide-next]').addEventListener('click',()=>{paused=true;pauseLabel();show(current+1)});
  pause.addEventListener('click',()=>{paused=!paused;pauseLabel()});
  pauseLabel();
  show(0);
  setInterval(()=>{if(!paused&&!document.hidden&&!document.documentElement.classList.contains('intro-playing')&&!hero.matches(':hover,:focus-within'))show(current+1)},8000);
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});const category=button.dataset.filter;document.querySelector('#filter-status').textContent=category.startsWith('全部')?(category==='全部實績'?'目前尚無公開的工程實績。':'目前尚無公開公告。'):`「${category}」目前尚無公開資料。`}));
const dialog=document.querySelector('#info-dialog');document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent='隱私權說明';document.querySelector('#dialog-content').innerHTML='<p>本網站目前為企業資訊展示網站。諮詢表單資料只在您的瀏覽器內處理，按下下載按鈕後，會於您的裝置產生需求單文字檔，不會傳送至睿洋或儲存於本站伺服器。</p><p>本站不使用廣告追蹤工具或分析 Cookie。網站託管服務可能為維運與安全記錄基本連線資訊。點選地圖連結後將前往 Google Maps，其資料處理方式依該服務之隱私權政策為準。</p><p>正式線上諮詢服務開放時，將同步更新個人資料蒐集與使用說明。</p>';dialog.showModal()}));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const form=document.querySelector('#inquiry-form');if(form){const s=new URLSearchParams(location.search).get('service');if(['hvac','insulation','careers','other'].includes(s))form.elements.service.value=s;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const content=['睿洋機電工程有限公司｜諮詢需求單','※ 此檔案僅下載至本機，尚未送交睿洋。','',`姓名：${d.get('name').trim()}`,`聯絡電話：${d.get('phone').trim()}`,`公司名稱：${d.get('company').trim()||'未填寫'}`,`需求類別：${form.elements.service.selectedOptions[0].textContent}`,'', '諮詢內容：',d.get('message').trim()].join('\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='睿洋機電_諮詢需求單.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);document.querySelector('#form-status').textContent='需求單已產生並開始下載，尚未送交睿洋。';})}
