/* Frankenplatz — каталог маркета: честная пометка про демо-вещи.

   ЗАЧЕМ. В site/market-catalog.js зашиты 19 придуманных вещей (Hermès за 2400,
   «✓ Чек», продавцы «Ксения Ч. ★4.9, 3 продано»). На проде они выглядели как
   реальный товар, и кнопка «Забронировать» работала: человек мог забронировать
   несуществующую сумку, а заявка уходила оргкоманде. Кабинета продавца ещё нет
   (план — docs/TZ-market-cabinet.md в репо slswiss-tickets), настоящих вещей в
   каталоге тоже, поэтому до наполнения каталога карточки остаются как образец
   оформления, но перестают быть предложением: баннер + никаких заявок.

   СНЯТЬ, КОГДА КАТАЛОГ ПОЙДЁТ ИЗ БАЗЫ: удалить подключение из market-catalog.html,
   строку из scripts/check_page_scripts.js и этот файл.

   Самодостаточный модуль (свой CSS, не в разметке) — переживает синк дизайна.
*/
(function () {
  'use strict';

  /* 'notice' — карточки видно, заявки выключены (текущий режим).
     'hide'   — каталог скрыт целиком, вместо него только баннер.
     Переключается одной строкой, если решим не показывать демо совсем. */
  var MODE = 'notice';

  var TEXT =
    'Каталог наполняется. Карточки ниже — <b>образец оформления</b>, а не вещи в продаже: ' +
    'настоящие появятся, когда продавцы загрузят их после регистрации. ' +
    'Поэтому бронь и вопросы продавцу пока отключены.';

  function injectCss() {
    if (document.getElementById('mcd-css')) return;
    var css =
      '.mcd-note{margin:0 0 22px;padding:16px 20px;border-radius:14px;line-height:1.55;font-size:14.5px;' +
      'background:rgba(230,180,80,.12);border:1px solid rgba(230,180,80,.42);color:#F5D9A0}' +
      '.mcd-note b{color:#F5C969}' +
      '.mcd-stub{margin:0 0 10px;font-size:14.5px;line-height:1.6;color:#C3B7D4}';
    var st = document.createElement('style');
    st.id = 'mcd-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function banner() {
    var note = document.createElement('p');
    note.className = 'mcd-note';
    note.innerHTML = TEXT;
    return note;
  }

  function start() {
    var grid = document.getElementById('mcGrid');
    if (!grid) return; // не страница каталога — молча выходим
    injectCss();

    var bar = document.querySelector('.mc-bar') || grid;
    bar.parentNode.insertBefore(banner(), bar);

    if (MODE === 'hide') {
      grid.remove();
      var filters = document.querySelector('.mc-filters');
      if (filters) filters.remove();
      var count = document.getElementById('mcCount');
      if (count) count.remove();
      return;
    }

    // Заявки по демо-вещи не принимаем: кнопки и форма модалки убираются.
    // Сама модалка остаётся — она и есть образец карточки.
    var actions = document.querySelector('.mc-modal__actions');
    if (actions) {
      var stub = document.createElement('p');
      stub.className = 'mcd-stub';
      stub.textContent = 'Это пример карточки. Бронь откроется, когда в каталоге появятся настоящие вещи.';
      actions.parentNode.insertBefore(stub, actions);
      actions.remove();
    }
    var form = document.getElementById('mcBook');
    if (form) form.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
