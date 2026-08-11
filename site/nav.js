/* Frankenplatz — единое меню ядра сайта.
   Один источник для всех страниц: index, day1, day2, speakers, speaker, anketa, legal.
   Использование в JSX-странице: <TopBar links={window.FP_NAV("day1")} />
   Ключи: index · day1 · day2 · speakers · null (страницы без активного пункта). */
window.FP_NAV = function (active) {
  var home = active === "index";
  if (active === "anketa") active = "speakers-soft";
  var links = [
    { key: "program", label: "Программа", href: (home ? "" : "/") + "#program" },
    { key: "day1", label: "День №1", href: "/day1" },
    { key: "day2", label: "День №2", href: "/day2" },
    /* абсолютный путь: cleanUrls, страница живёт в подпапке /calculators/ */
    { key: "calculators", label: "Калькуляторы", href: "/calculators" },
    /* «Спикерам» в меню не публикуем — закрытая прямая ссылка speakers.html */
    { key: "market", label: "Маркет", href: "/brand-market" },
    /* «Статьи» показываем, ТОЛЬКО когда есть хотя бы одна статья
       (site/blog-data.js). Пустой раздел в меню хуже отсутствующего:
       человек кликает и упирается в «скоро». Появится сама — правок не нужно. */
    { key: "collab", label: "Сотрудничество", href: "/collaboration" },
    { key: "trips", label: "Другие форумы", href: "/trips" },
    /* Пункт «Билеты» убран 2026-08-11 (решение дизайна): в шапке остаётся
       золотая кнопка «Купить билет», сам раздел — в футере. Дизайн-выгрузка
       правит только свои страницы, а это меню собирается здесь и живёт на
       главной, днях, спикерах, анкете и юр. странице — без правки тут шапка
       выглядела бы по-разному на разных страницах. */
  ];
  if (Array.isArray(window.FP_BLOG) && window.FP_BLOG.length) {
    links.splice(5, 0, { key: "blog", label: "Статьи", href: "/blog" });
  }
  var cta = active === "speakers"
    ? { label: "Подать заявку", href: "/anketa", cta: true }
    : { label: "Купить билет", href: "/tickets", cta: true };
  return links.map(function (l) {
    return { label: l.label, href: l.href, active: (l.key === active || (active === "speakers-soft" && l.key === "speakers")) || undefined };
  }).concat([cta]);
};
