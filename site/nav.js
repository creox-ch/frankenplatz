/* Frankenplatz — единое меню ядра сайта.
   Один источник для всех страниц: index, day1, day2, speakers, speaker, anketa, legal.
   Использование в JSX-странице: <TopBar links={window.FP_NAV("day1")} />
   Ключи: index · day1 · day2 · speakers · null (страницы без активного пункта). */
window.FP_NAV = function (active) {
  var home = active === "index";
  if (active === "anketa") active = "speakers-soft";
  var links = [
    { key: "program", label: "Программа", href: (home ? "" : "index.html") + "#program" },
    { key: "day1", label: "День №1", href: "day1.html" },
    { key: "day2", label: "День №2", href: "day2.html" },
    /* абсолютный путь: cleanUrls, страница живёт в подпапке /calculators/ */
    { key: "calculators", label: "Калькуляторы", href: "/calculators" },
    /* «Спикерам» в меню не публикуем — закрытая прямая ссылка speakers.html */
    { key: "market", label: "Маркет", href: "brand-market.html" },
    { key: "collab", label: "Сотрудничество", href: "collaboration.html" },
    { key: "trips", label: "Другие форумы", href: "trips.html" },
    { key: "tickets", label: "Билеты", href: "tickets.html" },
  ];
  var cta = active === "speakers"
    ? { label: "Подать заявку", href: "anketa.html", cta: true }
    : { label: "Купить билет", href: "tickets.html", cta: true };
  return links.map(function (l) {
    return { label: l.label, href: l.href, active: (l.key === active || (active === "speakers-soft" && l.key === "speakers")) || undefined };
  }).concat([cta]);
};
