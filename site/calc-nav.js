/* Frankenplatz — шапка сайта для раздела «Калькуляторы».
   Калькуляторы — самодостаточные страницы со своими стилями (не ядро сайта,
   без chrome.css/nav.js), поэтому меню сюда инжектит этот модуль.

   Подключение — одной строкой в конце <body> страницы:
     <script src="../site/calc-nav.js"></script>   (внутри /calculators/)
     <script src="site/calc-nav.js"></script>      (если когда-то понадобится в корне)

   ⚠ Ссылки АБСОЛЮТНЫЕ от корня: на сайте включён cleanUrls (vercel.json),
   относительные пути из подпапки /calculators/ уводят в 404.

   Отдельный модуль в site/*.js — переживает синк дизайна (в HTML остаётся
   одна строка <script>, её при ре-синке вернуть). */
(function () {
  'use strict';

  if (window.__fpCalcNav) return;
  window.__fpCalcNav = true;

  var LINKS = [
    { label: 'Программа', href: '/#program' },
    { label: 'День №1', href: '/day1' },
    { label: 'День №2', href: '/day2' },
    { label: 'Калькуляторы', href: '/calculators', key: 'calculators' },
    { label: 'Маркет', href: '/brand-market' },
    { label: 'Другие форумы', href: '/trips' },
    { label: 'Билеты', href: '/tickets' }
  ];
  var CTA = { label: 'Купить билет', href: '/tickets' };

  var CSS = [
    'body{padding-top:64px}',
    '.fpcn{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;gap:14px;',
    '  padding:11px clamp(14px,3vw,40px);background:rgba(20,10,31,.82);backdrop-filter:blur(14px);',
    '  -webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.10);font-family:"Manrope",system-ui,sans-serif}',
    '.fpcn__logo{font-family:"Unbounded","Manrope",sans-serif;font-weight:800;font-size:15px;letter-spacing:-.02em;',
    '  color:#F3EEF9;text-decoration:none;white-space:nowrap;margin-right:auto}',
    '.fpcn__logo:hover{color:#F5C969}',
    '.fpcn__nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end}',
    '.fpcn__link{font-size:13.5px;font-weight:600;color:#C3B7D4;text-decoration:none;padding:7px 10px;border-radius:10px;white-space:nowrap;transition:color .18s,background .18s}',
    '.fpcn__link:hover{color:#F3EEF9;background:rgba(255,255,255,.06)}',
    '.fpcn__link--active{color:#F5C969;background:rgba(230,180,80,.10)}',
    '.fpcn__link--cta{color:#2A1A05;background:linear-gradient(180deg,#F7D488 0%,#E6B450 100%);font-weight:800;padding:8px 16px;margin-left:6px}',
    '.fpcn__link--cta:hover{color:#2A1A05;background:linear-gradient(180deg,#FFE0A0 0%,#F5C969 100%)}',
    '.fpcn__burger{display:none;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#F3EEF9;',
    '  font-size:17px;line-height:1;padding:9px 12px;border-radius:11px;cursor:pointer}',
    '.fpcn__menu{display:none;position:fixed;top:64px;left:0;right:0;z-index:59;flex-direction:column;gap:2px;',
    '  padding:10px clamp(14px,3vw,40px) 16px;background:rgba(20,10,31,.97);backdrop-filter:blur(14px);',
    '  -webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.10)}',
    '.fpcn__menu.is-open{display:flex}',
    '.fpcn__menu .fpcn__link{padding:11px 10px;font-size:15px}',
    '.fpcn__menu .fpcn__link--cta{text-align:center;margin:6px 0 0}',
    '@media(max-width:900px){.fpcn__nav{display:none}.fpcn__burger{display:block}}'
  ].join('\n');

  function linkEl(item, active) {
    var a = document.createElement('a');
    a.className = 'fpcn__link' + (item.cta ? ' fpcn__link--cta' : '') + (active ? ' fpcn__link--active' : '');
    a.href = item.href;
    a.textContent = item.label;
    if (active) a.setAttribute('aria-current', 'page');
    return a;
  }

  function build() {
    if (document.querySelector('.fpcn')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var header = document.createElement('header');
    header.className = 'fpcn';

    var logo = document.createElement('a');
    logo.className = 'fpcn__logo';
    logo.href = '/';
    logo.textContent = 'Frankenplatz.ch';
    header.appendChild(logo);

    var nav = document.createElement('nav');
    nav.className = 'fpcn__nav';
    nav.setAttribute('aria-label', 'Основное меню');

    var menu = document.createElement('div');
    menu.className = 'fpcn__menu';

    // активен пункт «Калькуляторы» — модуль подключается только в этом разделе
    LINKS.forEach(function (item) {
      var isActive = item.key === 'calculators';
      nav.appendChild(linkEl(item, isActive));
      menu.appendChild(linkEl(item, isActive));
    });
    var cta = { label: CTA.label, href: CTA.href, cta: true };
    nav.appendChild(linkEl(cta, false));
    menu.appendChild(linkEl(cta, false));

    header.appendChild(nav);

    var burger = document.createElement('button');
    burger.className = 'fpcn__burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Открыть меню');
    burger.setAttribute('aria-expanded', 'false');
    burger.textContent = '☰';
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? '✕' : '☰';
    });
    header.appendChild(burger);

    document.body.insertBefore(header, document.body.firstChild);
    document.body.insertBefore(menu, header.nextSibling);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.textContent = '☰';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
