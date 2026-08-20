/* Frankenplatz — покупка билета с tickets.html.

   Кнопки «Купить» (.tk-buy[data-product]) открывают модалку: выбор категории
   ряда + ланч + e-mail → POST на общий приёмник платежей стенда
   (slswiss-tickets /api/forum/create) → редирект на оплату Payrexx.

   Цену здесь показываем ТОЛЬКО для UX — итог считает сервер по каталогу
   (lib/forum-tickets), клиентской цене он не верит. Числа ниже — цены Early
   Bird (как на странице); при выключении EB обновить и страницу, и эту карту.

   Отдельный модуль (не в разметке) — переживает синк дизайна.
*/
(function () {
  'use strict';

  var ENDPOINT = 'https://slswiss-tickets.vercel.app/api/forum/create';
  // Проверка промокода до оплаты: иначе узнать, работает ли код, можно только
  // начав платить. Скидку считает сервер (свои promo_codes, не купоны Payrexx).
  var PROMO_ENDPOINT = 'https://slswiss-tickets.vercel.app/api/promo/check';
  var LUNCH_PER_DAY = 35; // CHF/день, EB на ланч не действует
  var CAT_LABEL = { vip: 'VIP', premium: 'Premium', standard: 'Standard' };

  // Цены Early Bird для показа (сервер пересчитывает сам).
  var PRICES = {
    day1: {
      title: 'День 1 · База 🇨🇭 финансов', date: '24 октября 2026', days: 1,
      cats: {
        vip: { eb: 209, reg: 279, rows: 'ряды 1–3' },
        premium: { eb: 149, reg: 199, rows: 'ряды 4–8' },
        standard: { eb: 112, reg: 149, rows: 'ряды 9–20' },
      },
    },
    day2: {
      title: 'День 2 · LvL UP', date: '25 октября 2026', days: 1,
      cats: {
        vip: { eb: 277, reg: 369, rows: 'ряды 1–3' },
        premium: { eb: 217, reg: 289, rows: 'ряды 4–8' },
        standard: { eb: 164, reg: 219, rows: 'ряды 9–20' },
      },
    },
    both: {
      title: 'Оба дня · База + LvL UP', date: '24 + 25 октября', days: 2,
      cats: {
        vip: { eb: 412, reg: 549, rows: 'оба дня' },
        premium: { eb: 314, reg: 419, rows: 'оба дня' },
        standard: { eb: 239, reg: 319, rows: 'оба дня' },
      },
    },
  };
  var CAT_ORDER = ['vip', 'premium', 'standard'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- промокод ----------
  /* Один виджет на обе модалки: разметка, стили и разговор с сервером живут
     здесь, чтобы «Итого» в двух местах не разъехалось. Стили инжектим из JS —
     остальной CSS модалки лежит в tickets.html, а его перезаписывает синк
     дизайна. Скидку считает сервер: показанной здесь сумме он не верит. */

  /** Рапены → «112» / «89.60». */
  function chf(rappen) {
    return ((Number(rappen) || 0) / 100).toFixed(2).replace(/\.00$/, '');
  }

  function injectPromoCss() {
    if (document.getElementById('tk-promo-css')) return;
    var st = document.createElement('style');
    st.id = 'tk-promo-css';
    st.textContent =
      '.tk-promo{display:flex;gap:8px;align-items:stretch}' +
      '.tk-promo .tk-field{flex:1;min-width:0;text-transform:uppercase}' +
      '.tk-promo__btn{margin-top:8px;padding:0 16px;border:1px solid var(--line-strong,rgba(255,255,255,.16));border-radius:12px;background:rgba(255,255,255,.06);color:var(--ink,#F3EEF9);font:700 13px/1 inherit;cursor:pointer;white-space:nowrap}' +
      '.tk-promo__btn:disabled{opacity:.55;cursor:default}' +
      '.tk-promo__msg{margin:8px 2px 0;font-size:12.5px;line-height:1.5;color:var(--muted-2,#9A8BB3);min-height:1em}' +
      '.tk-promo__msg.ok{color:#86E0B0}' +
      '.tk-promo__msg.err{color:#FF9B9B}';
    document.head.appendChild(st);
  }

  function promoMarkup() {
    return (
      '<div class="tk-promo">' +
      '<input class="tk-field" type="text" name="tkpromo" placeholder="Промокод (если есть)" autocomplete="off" spellcheck="false">' +
      '<button class="tk-promo__btn" type="button">Применить</button>' +
      '</div>' +
      '<p class="tk-promo__msg" role="status" aria-live="polite"></p>'
    );
  }

  /**
   * Подключить поле к карточке модалки.
   * selection() отдаёт текущий выбор {product, category, lunch} или null.
   * onChange() зовётся, когда скидка появилась или пропала, — там пересчёт «Итого».
   */
  function attachPromo(card, selection, onChange) {
    var input = card.querySelector('input[name=tkpromo]');
    var btn = card.querySelector('.tk-promo__btn');
    var out = card.querySelector('.tk-promo__msg');
    var applied = null; // {code, total} в рапенах

    function setMsg(t, kind) {
      out.textContent = t || '';
      out.className = 'tk-promo__msg' + (kind ? ' ' + kind : '');
    }
    function drop() { applied = null; setMsg(''); onChange(); }

    function check(silent) {
      var code = (input.value || '').trim();
      if (!code) { drop(); return; }
      var sel = selection();
      if (!sel) { setMsg('Сначала выбери билет.', 'err'); return; }

      btn.disabled = true;
      if (!silent) setMsg('Проверяем…');
      fetch(PROMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: 'forum',
          product: sel.product,
          category: sel.category,
          lunch: sel.lunch,
          promo: code,
        }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          btn.disabled = false;
          if (d && d.ok && d.applied) {
            applied = { code: d.code, total: d.total };
            setMsg('Код ' + d.code + ' применён: −' + chf(d.discount) + ' CHF.', 'ok');
          } else {
            // Не подошёл — итог возвращаем к обычному, чтобы на кнопке не
            // осталась скидка, которой уже нет.
            applied = null;
            setMsg((d && d.message) || (d && d.error) || 'Код не подошёл.', 'err');
          }
          onChange();
        })
        .catch(function () {
          btn.disabled = false;
          applied = null;
          setMsg('Не получилось проверить код. Попробуй ещё раз.', 'err');
          onChange();
        });
    }

    btn.addEventListener('click', function () { check(false); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); check(false); }
    });
    // Правят код — прежняя скидка больше не действует.
    input.addEventListener('input', function () { if (applied) drop(); });

    return {
      code: function () { return (input.value || '').trim(); },
      total: function () { return applied ? applied.total : null; },
      // Выбор изменился — цена другая, скидку пересчитывает сервер, а не мы.
      recheck: function () { if (applied) { applied = null; check(true); } },
    };
  }

  // ---------- модалка покупки ----------
  var overlay = null;
  function closeModal() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') closeModal(); }

  function openModal(product) {
    var p = PRICES[product];
    if (!p || overlay) return;

    var opts = CAT_ORDER.map(function (cat) {
      var c = p.cats[cat];
      return (
        '<label class="tk-opt" data-cat="' + cat + '">' +
        '<input type="radio" name="tkcat" value="' + cat + '">' +
        '<span class="tk-opt__cat">' + CAT_LABEL[cat] + '<span>' + esc(c.rows) + '</span></span>' +
        '<span class="tk-opt__price">' + c.eb + ' CHF<s>' + c.reg + ' CHF</s></span>' +
        '</label>'
      );
    }).join('');

    var lunchLabel = p.days === 2 ? '+ ланч на оба дня · +' + LUNCH_PER_DAY * 2 + ' CHF'
                                  : '+ ланч (обед на площадке) · +' + LUNCH_PER_DAY + ' CHF';

    overlay = document.createElement('div');
    overlay.className = 'tk-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="tk-modal__card">' +
      '<button class="tk-modal__x" type="button" aria-label="Закрыть">&times;</button>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p class="tk-modal__sub">' + esc(p.date) + ' · Baden · выбери категорию ряда</p>' +
      '<div class="tk-opts">' + opts + '</div>' +
      '<label class="tk-lunch-opt"><input type="checkbox" name="tklunch"><span>' + lunchLabel +
      ' <span style="color:var(--muted-2,#9A8BB3)">(Early Bird на ланч не действует)</span></span></label>' +
      '<input class="tk-field" type="email" name="tkemail" placeholder="E-mail — на него придёт билет" autocomplete="email" required>' +
      '<input class="tk-field" type="text" name="tkname" placeholder="Имя (по желанию)" autocomplete="name">' +
      promoMarkup() +
      '<label class="tk-consent"><input type="checkbox" name="tkconsent"><span>Даю согласие на обработку данных для оформления билета. <a href="/legal#datenschutz">Политика конфиденциальности</a>.</span></label>' +
      '<div class="tk-total"><span>Итого</span><b class="tk-total__val">—</b></div>' +
      '<button class="tk-pay" type="button" disabled>Выбери категорию</button>' +
      '<p class="tk-msg" role="status" aria-live="polite"></p>' +
      '</div>';

    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.tk-modal__x').addEventListener('click', closeModal);

    var card = overlay.querySelector('.tk-modal__card');
    var payBtn = card.querySelector('.tk-pay');
    var totalEl = card.querySelector('.tk-total__val');
    var msg = card.querySelector('.tk-msg');
    var lunchInput = card.querySelector('input[name=tklunch]');
    var emailInput = card.querySelector('input[name=tkemail]');
    var nameInput = card.querySelector('input[name=tkname]');
    var consentInput = card.querySelector('input[name=tkconsent]');

    function selectedCat() {
      var r = card.querySelector('input[name=tkcat]:checked');
      return r ? r.value : null;
    }
    function recalc() {
      var cat = selectedCat();
      card.querySelectorAll('.tk-opt').forEach(function (o) {
        o.classList.toggle('is-on', o.getAttribute('data-cat') === cat);
      });
      if (!cat) { totalEl.textContent = '—'; payBtn.disabled = true; payBtn.textContent = 'Выбери категорию'; return; }
      var withPromo = promo.total();
      var total = withPromo != null
        ? chf(withPromo)
        : p.cats[cat].eb + (lunchInput.checked ? LUNCH_PER_DAY * p.days : 0);
      totalEl.textContent = total + ' CHF';
      payBtn.disabled = false;
      payBtn.textContent = 'Оплатить ' + total + ' CHF';
    }
    var promo = attachPromo(
      card,
      function () {
        var cat = selectedCat();
        return cat ? { product: product, category: cat, lunch: lunchInput.checked } : null;
      },
      recalc
    );
    function onSelectionChange() { promo.recheck(); recalc(); }
    card.querySelectorAll('input[name=tkcat]').forEach(function (r) { r.addEventListener('change', onSelectionChange); });
    lunchInput.addEventListener('change', onSelectionChange);

    function setMsg(t, kind) { msg.textContent = t || ''; msg.className = 'tk-msg' + (kind ? ' ' + kind : ''); }

    payBtn.addEventListener('click', function () {
      setMsg('');
      var cat = selectedCat();
      if (!cat) { setMsg('Выбери категорию ряда.', 'err'); return; }
      var email = (emailInput.value || '').trim();
      if (email.indexOf('@') < 1) { setMsg('Проверь e-mail — на него придёт билет.', 'err'); emailInput.focus(); return; }
      if (!consentInput.checked) { setMsg('Нужно согласие на обработку данных.', 'err'); return; }

      payBtn.disabled = true;
      payBtn.textContent = 'Открываю оплату…';
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product,
          category: cat,
          lunch: lunchInput.checked,
          email: email,
          name: (nameInput.value || '').trim(),
          // Код шлём как есть: сервер считает скидку заново — показанной здесь
          // сумме он не верит, как и цене билета.
          promo: promo.code(),
        }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, data: d }; }); })
        .then(function (res) {
          if (res.status >= 200 && res.status < 300 && res.data && res.data.ok && res.data.payUrl) {
            if (window.FPConsent) window.FPConsent.track('ticket_checkout', { form_key: 'ticket', product: product, category: cat });
            window.location.href = res.data.payUrl; // на оплату Payrexx
          } else {
            setMsg((res.data && res.data.error) || 'Не получилось открыть оплату. Попробуй ещё раз.', 'err');
            recalc();
          }
        })
        .catch(function () { setMsg('Сеть недоступна. Попробуй ещё раз чуть позже.', 'err'); recalc(); });
    });

    // предвыбор Standard — сразу видно итог
    var def = card.querySelector('input[name=tkcat][value=standard]');
    if (def) { def.checked = true; recalc(); }
    setTimeout(function () { emailInput.focus(); }, 60);
  }

  // ---------- модалка «категория → выбор дня» ----------
  var PRODUCT_ORDER = ['day1', 'day2', 'both'];
  function openCatModal(cat) {
    if (!CAT_LABEL[cat] || overlay) return;
    var opts = PRODUCT_ORDER.map(function (prod) {
      var p = PRICES[prod]; var c = p.cats[cat];
      return (
        '<label class="tk-opt" data-prod="' + prod + '">' +
        '<input type="radio" name="tkprod" value="' + prod + '">' +
        '<span class="tk-opt__cat">' + esc(p.title) + '<span>' + esc(p.date) + '</span></span>' +
        '<span class="tk-opt__price">' + c.eb + ' CHF<s>' + c.reg + ' CHF</s></span>' +
        '</label>'
      );
    }).join('');

    overlay = document.createElement('div');
    overlay.className = 'tk-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="tk-modal__card">' +
      '<button class="tk-modal__x" type="button" aria-label="Закрыть">&times;</button>' +
      '<h3>' + CAT_LABEL[cat] + ' · ' + esc(PRICES.day1.cats[cat].rows) + '</h3>' +
      '<p class="tk-modal__sub">Baden · выбери день</p>' +
      '<div class="tk-opts">' + opts + '</div>' +
      '<label class="tk-lunch-opt"><input type="checkbox" name="tklunch"><span>+ ланч (обед на площадке) · +' + LUNCH_PER_DAY + ' CHF/день' +
      ' <span style="color:var(--muted-2,#9A8BB3)">(Early Bird на ланч не действует)</span></span></label>' +
      '<input class="tk-field" type="email" name="tkemail" placeholder="E-mail — на него придёт билет" autocomplete="email" required>' +
      '<input class="tk-field" type="text" name="tkname" placeholder="Имя (по желанию)" autocomplete="name">' +
      promoMarkup() +
      '<label class="tk-consent"><input type="checkbox" name="tkconsent"><span>Даю согласие на обработку данных для оформления билета. <a href="/legal#datenschutz">Политика конфиденциальности</a>.</span></label>' +
      '<div class="tk-total"><span>Итого</span><b class="tk-total__val">—</b></div>' +
      '<button class="tk-pay" type="button" disabled>Выбери день</button>' +
      '<p class="tk-msg" role="status" aria-live="polite"></p>' +
      '</div>';

    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.tk-modal__x').addEventListener('click', closeModal);

    var card = overlay.querySelector('.tk-modal__card');
    var payBtn = card.querySelector('.tk-pay');
    var totalEl = card.querySelector('.tk-total__val');
    var msg = card.querySelector('.tk-msg');
    var lunchInput = card.querySelector('input[name=tklunch]');
    var emailInput = card.querySelector('input[name=tkemail]');
    var nameInput = card.querySelector('input[name=tkname]');
    var consentInput = card.querySelector('input[name=tkconsent]');

    function selectedProd() {
      var r = card.querySelector('input[name=tkprod]:checked');
      return r ? r.value : null;
    }
    function recalc() {
      var prod = selectedProd();
      card.querySelectorAll('.tk-opt').forEach(function (o) {
        o.classList.toggle('is-on', o.getAttribute('data-prod') === prod);
      });
      if (!prod) { totalEl.textContent = '—'; payBtn.disabled = true; payBtn.textContent = 'Выбери день'; return; }
      var p = PRICES[prod];
      var withPromo = promo.total();
      var total = withPromo != null
        ? chf(withPromo)
        : p.cats[cat].eb + (lunchInput.checked ? LUNCH_PER_DAY * p.days : 0);
      totalEl.textContent = total + ' CHF';
      payBtn.disabled = false;
      payBtn.textContent = 'Оплатить ' + total + ' CHF';
    }
    var promo = attachPromo(
      card,
      function () {
        var prod = selectedProd();
        return prod ? { product: prod, category: cat, lunch: lunchInput.checked } : null;
      },
      recalc
    );
    function onSelectionChange() { promo.recheck(); recalc(); }
    card.querySelectorAll('input[name=tkprod]').forEach(function (r) { r.addEventListener('change', onSelectionChange); });
    lunchInput.addEventListener('change', onSelectionChange);

    function setMsg(t, kind) { msg.textContent = t || ''; msg.className = 'tk-msg' + (kind ? ' ' + kind : ''); }

    payBtn.addEventListener('click', function () {
      setMsg('');
      var prod = selectedProd();
      if (!prod) { setMsg('Выбери день.', 'err'); return; }
      var email = (emailInput.value || '').trim();
      if (email.indexOf('@') < 1) { setMsg('Проверь e-mail — на него придёт билет.', 'err'); emailInput.focus(); return; }
      if (!consentInput.checked) { setMsg('Нужно согласие на обработку данных.', 'err'); return; }

      payBtn.disabled = true;
      payBtn.textContent = 'Открываю оплату…';
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: prod,
          category: cat,
          lunch: lunchInput.checked,
          email: email,
          name: (nameInput.value || '').trim(),
          // Код шлём как есть: сервер считает скидку заново — показанной здесь
          // сумме он не верит, как и цене билета.
          promo: promo.code(),
        }),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, data: d }; }); })
        .then(function (res) {
          if (res.status >= 200 && res.status < 300 && res.data && res.data.ok && res.data.payUrl) {
            if (window.FPConsent) window.FPConsent.track('ticket_checkout', { form_key: 'ticket', product: prod, category: cat });
            window.location.href = res.data.payUrl;
          } else {
            setMsg((res.data && res.data.error) || 'Не получилось открыть оплату. Попробуй ещё раз.', 'err');
            recalc();
          }
        })
        .catch(function () { setMsg('Сеть недоступна. Попробуй ещё раз чуть позже.', 'err'); recalc(); });
    });

    // предвыбор «Оба дня» — сразу видно итог и выгоду
    var def = card.querySelector('input[name=tkprod][value=both]');
    if (def) { def.checked = true; recalc(); }
    setTimeout(function () { emailInput.focus(); }, 60);
  }

  // ---------- баннер после возврата с оплаты ----------
  function statusBanner() {
    var m = (location.search.match(/[?&]status=(paid|failed|cancelled)/) || [])[1];
    if (!m) return;
    var text = {
      paid: '✅ Оплата прошла! Билет с QR отправили тебе на почту. До встречи на форуме 🐮',
      failed: 'Оплата не прошла. Попробуй ещё раз или напиши info@frankenplatz.ch.',
      cancelled: 'Оплата отменена — билет можно купить в любой момент.',
    }[m];
    var kind = m === 'paid' ? 'ok' : 'warn';
    /* Итог оплаты. ticket_checkout ловит только «ушёл на Payrexx», а дошёл ли
       человек до конца — было не видно. ⚠ Событие занижает продажи: кто закрыл
       вкладку на странице банка, сюда не вернётся. Точное число оплат — в БД
       (tickets.status='paid'), это про воронку, а не про бухгалтерию. */
    if (window.FPConsent && window.FPConsent.track) {
      window.FPConsent.track('ticket_' + m, { form_key: 'ticket', product: 'forum-ticket' });
    }
    var host = document.querySelector('.hero .inner') || document.querySelector('.kit .inner');
    if (!host) return;
    var b = document.createElement('div');
    b.className = 'tk-banner tk-banner--' + kind;
    b.textContent = text;
    host.insertBefore(b, host.firstChild);
    // убрать ?status из адреса, чтобы баннер не висел при перезагрузке
    if (window.history && history.replaceState) {
      history.replaceState(null, '', location.pathname + location.hash);
    }
  }

  function start() {
    injectPromoCss();
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.tk-buy');
      if (!btn) return;
      e.preventDefault();
      var cat = btn.getAttribute('data-cat');
      if (cat) openCatModal(cat); else openModal(btn.getAttribute('data-product'));
    });
    statusBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
