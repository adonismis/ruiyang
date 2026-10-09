// One-time migration helper: renders the archived React pages to plain HTML.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const sourceRoot = __dirname;
const root = path.basename(__dirname) === 'old' ? path.resolve(__dirname, '..') : __dirname;
const routes = [
  ['/', 'index.html', 'app/page.tsx'],
  ['/about', 'about.html', 'app/about/page.tsx'],
  ['/about/certificates', 'about-certificates.html', 'app/about/certificates/page.tsx'],
  ['/services', 'services.html', 'app/services/page.tsx'],
  ['/services/pending-service-1', 'services-pending-service-1.html', 'app/services/[slug]/page.tsx'],
  ['/services/pending-service-2', 'services-pending-service-2.html', 'app/services/[slug]/page.tsx'],
  ['/services/pending-service-3', 'services-pending-service-3.html', 'app/services/[slug]/page.tsx'],
  ['/projects', 'projects.html', 'app/projects/page.tsx'],
  ['/sustainability', 'sustainability.html', 'app/sustainability/page.tsx'],
  ['/sustainability/safety', 'sustainability-safety.html', 'app/sustainability/[slug]/page.tsx'],
  ['/sustainability/quality', 'sustainability-quality.html', 'app/sustainability/[slug]/page.tsx'],
  ['/sustainability/responsibility', 'sustainability-responsibility.html', 'app/sustainability/[slug]/page.tsx'],
  ['/news', 'news.html', 'app/news/page.tsx'],
  ['/careers', 'careers.html', 'app/careers/page.tsx'],
  ['/contact', 'contact.html', 'app/contact/page.tsx'],
  ['/privacy', 'privacy.html', 'app/privacy/page.tsx'],
  ['/credits', 'credits.html', 'app/credits/page.tsx'],
];
const routeFiles = new Map(routes.map(([url, file]) => [url, file]));

function localUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('/')) return url;
  const [pathname, suffix = ''] = url.split(/(?=[?#])/);
  return (routeFiles.get(pathname) || pathname) + suffix;
}
let currentRoute = '/';
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request.startsWith('@/')) return originalLoad.call(this, path.join(sourceRoot, 'src', request.slice(2)), parent, isMain);
  if (request === 'next/link') {
    return { __esModule: true, default: ({ href, children, ...props }) => React.createElement('a', { href: localUrl(href), ...props }, children) };
  }
  if (request === 'next/navigation') return { usePathname: () => currentRoute, notFound: () => { throw new Error('404'); } };
  if (request === 'next/server') return { connection: async () => {} };
  if (request.endsWith('.css') || request.startsWith('@fontsource-variable/')) return {};
  return originalLoad.call(this, request, parent, isMain);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    const output = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    module._compile(output, filename);
  };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function rewriteAssets(html) {
  return html
    .replaceAll('="/images/', '="assets/images/')
    .replaceAll('="/brand/', '="assets/brand/')
    .replaceAll(' /images/', ' assets/images/')
    .replaceAll(', /images/', ', assets/images/')
    .replaceAll('action="/projects"', 'action="projects.html"');
}

(async () => {
  const Layout = require(path.join(sourceRoot, 'src/app/layout.tsx')).default;
  const NotFound = require(path.join(sourceRoot, 'src/app/not-found.tsx')).default;
  for (const [route, filename, modulePath] of routes) {
    currentRoute = route;
    const pageModule = require(path.join(sourceRoot, 'src', modulePath));
    const slug = route.split('/').pop();
    const props = modulePath.includes('[slug]') ? { params: Promise.resolve({ slug }) } :
      route === '/news' || route === '/projects' ? { searchParams: Promise.resolve({}) } : {};
    const page = await pageModule.default(props);
    const metadata = pageModule.generateMetadata ? await pageModule.generateMetadata(props) : pageModule.metadata;
    let html = renderToStaticMarkup(React.createElement(Layout, { children: page }));
    html = rewriteAssets(html);
    if (route === '/contact') html = html.replace(/<noscript>.*?noscript>/s, '');
    const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(metadata.title)}</title><meta name="description" content="${escapeHtml(metadata.description)}"><meta name="theme-color" content="#008d4b"><link rel="icon" href="assets/icon.png"><link rel="stylesheet" href="assets/css/fonts.css"><link rel="stylesheet" href="assets/css/site.css"><script src="assets/js/site.js" defer></script>`;
    html = html.includes('<head>') ? html.replace('<head>', `<head>${head}`) : html.replace(/<html([^>]*)>/, `<html$1><head>${head}</head>`);
    fs.writeFileSync(path.join(root, filename), '<!doctype html>\n' + html + '\n');
    console.log(filename);
  }
  currentRoute = '/404';
  let html = renderToStaticMarkup(React.createElement(Layout, { children: React.createElement(NotFound) }));
  html = rewriteAssets(html);
  const head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>找不到頁面｜睿洋機電工程有限公司</title><link rel="icon" href="assets/icon.png"><link rel="stylesheet" href="assets/css/fonts.css"><link rel="stylesheet" href="assets/css/site.css"><script src="assets/js/site.js" defer></script>';
  html = html.includes('<head>') ? html.replace('<head>', `<head>${head}`) : html.replace(/<html([^>]*)>/, `<html$1><head>${head}</head>`);
  fs.writeFileSync(path.join(root, '404.html'), '<!doctype html>\n' + html + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
