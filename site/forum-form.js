/* Frankenplatz — оживление форм на самостоятельных страницах форума
   (collaboration / brand-market / trips-подстраницы).

   Эти страницы — статичный HTML со своей инлайн-формой, которая в дизайне
   лишь имитирует отправку (заменяет разметку, никуда не шлёт). Модуль
   подключается ОТДЕЛЬНЫМ файлом (переживает синк дизайна) и по реестру ниже
   находит нужную форму, добавляет галочку согласия + honeypot и шлёт заявку
   в общий приёмник /api/forms (единая база аудитории), как остальные формы
   платформы. Инлайн-заглушку с этих страниц при выкладке удаляем.

   Подключение (в конце body страницы): <script src="site/forum-form.js"></script>
   ⚠ При ре-синке дизайна: заново убрать инлайн-заглушку и вернуть этот <script>.
*/
(function () {
  'use strict';

  var ENDPOINT = 'https://slswiss-tickets.vercel.app/api/forms';
  var EVENT = 'frankenplatz-2026-10';
  var STYLE_ID = 'fp-ff-style';
  // Time-trap от загрузки страницы (не от создания формы) — иначе автозаполнение
  // отправило бы быстрее MIN_FILL_MS и сервер тихо отбросил бы лид.
  var PAGE_LOADED = Date.now();

  // Реестр форм: селектор формы → куда и как слать. Контактные поля уходят
  // top-level, остальные — в payload; чекбокс-группа склеивается в строку.
  var FORMS = [
    {
      form: '#cwForm', form_key: 'collaboration', role: 'Заявка на сотрудничество',
      name: '#cwName', email: '#cwEmail', telegram: '#cwTg',
      fields: [
        ['#cwRole', 'Кто'], ['#cwRefs', 'Референсы'],
        ['#cwPriceType', 'Формат оплаты'], ['#cwPrice', 'Стоимость'], ['#cwMore', 'О себе']
      ],
      checkboxGroup: { container: '.cw-dates', label: 'Даты' }
    },
    {
      // brand-market.html — «У меня вопрос»; поле #bmName приведено к type=email
      form: '#bmForm', form_key: 'market', role: 'Вопрос о маркете',
      email: '#bmName',
      fields: [['#bmWhat', 'Вопрос']]
    },
    {
      // trips/tony-robbins.html — «Забронировать место в группе»; поля без id → по типу
      form: '.gform', form_key: 'trip', role: 'Заявка на поездку · Тони Роббинс',
      name: 'input[type=text]', email: 'input[type=email]', phone: 'input[type=tel]',
      fields: [['select', 'Тип билета'], ['.field.full input', 'Сколько человек едет']]
    },
    {
      // sponsor.html — «Хочу место в фойе»
      form: '#spForm', form_key: 'sponsor', role: 'Заявка спонсора/маркета',
      email: '#spEmail',
      fields: [
        ['#spProduct', 'Продукт/бренд'], ['#spLinks', 'Ссылки'],
        ['#spPrice', 'Ценовая категория'], ['#spMore', 'Подробнее']
      ]
    }
  ];

  // Ссылка на страницу с политикой: из подпапки (trips/) уровнем выше.
  function legalHref() {
    return '/legal#datenschutz';
  }

  var CSS = [
    '.fp-ff-consent{display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:12.5px;',
    'color:var(--muted-2,#9A8BB3);line-height:1.45;margin:4px 0 2px}',
    '.fp-ff-consent input{accent-color:var(--gold,#E6B450);width:16px;height:16px;min-height:0;padding:0;margin-top:1px;cursor:pointer;flex:none}',
    '.fp-ff-consent a{color:var(--lila-bright,#B98BFF)}',
    '.fp-ff-msg{font-size:13.5px;line-height:1.5;margin:6px 0 0}',
    '.fp-ff-msg.ok{color:var(--green-text,#8BE59B);font-weight:700}',
    '.fp-ff-msg.err{color:var(--red,#FF7A8A)}',
    '.fp-ff-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function val(root, sel) {
    var el = sel && root.querySelector(sel);
    return el ? String(el.value || '').trim() : '';
  }

  function wire(cfg) {
    var form = document.querySelector(cfg.form);
    if (!form || form.dataset.fpWired) return;
    form.dataset.fpWired = '1';
    injectStyle();

    var btn = form.querySelector('button[type=submit]') || form.querySelector('button');

    var hp = document.createElement('div');
    hp.className = 'fp-ff-hp';
    hp.setAttribute('aria-hidden', 'true');
    hp.innerHTML = '<label>Не заполняйте<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';

    var consentLabel = document.createElement('label');
    consentLabel.className = 'fp-ff-consent';
    consentLabel.innerHTML =
      '<input type="checkbox"><span>Даю согласие на обработку данных заявки.<br>' +
      'Отписаться можно в любой момент. <a href="' + legalHref() + '">Политика конфиденциальности</a>.</span>';

    var msg = document.createElement('p');
    msg.className = 'fp-ff-msg';
    msg.setAttribute('role', 'status');
    msg.setAttribute('aria-live', 'polite');

    if (btn) { form.insertBefore(hp, btn); form.insertBefore(consentLabel, btn); }
    else { form.appendChild(hp); form.appendChild(consentLabel); }
    form.appendChild(msg);

    var consent = consentLabel.querySelector('input');
    var hpInput = hp.querySelector('input');

    function setMsg(t, kind) {
      msg.textContent = t || '';
      msg.className = 'fp-ff-msg' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg('');

      var email = val(form, cfg.email);
      if (email.indexOf('@') < 1) {
        setMsg('Проверь e-mail — кажется, есть опечатка.', 'err');
        return;
      }
      if (!consent.checked) {
        setMsg('Нужно согласие на обработку данных.', 'err');
        return;
      }
      if (hpInput.value) return; // honeypot заполнен — тихо выходим

      var payload = {};
      (cfg.fields || []).forEach(function (f) {
        var v = val(form, f[0]);
        if (v) payload[f[1]] = v;
      });
      if (cfg.checkboxGroup) {
        var cont = form.querySelector(cfg.checkboxGroup.container);
        if (cont) {
          var chosen = Array.prototype.slice
            .call(cont.querySelectorAll('input[type=checkbox]:checked'))
            .map(function (c) { return c.value; });
          if (chosen.length) payload[cfg.checkboxGroup.label] = chosen.join('; ');
        }
      }

      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляю…'; }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'forum',
          event: EVENT,
          form_key: cfg.form_key,
          kind: 'lead',
          role: cfg.role,
          source_url: location.href,
          name: val(form, cfg.name),
          email: email,
          telegram: val(form, cfg.telegram),
          phone: val(form, cfg.phone),
          consent: true,
          website: hpInput.value,
          elapsed_ms: Date.now() - PAGE_LOADED,
          payload: payload
        })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; })
            .then(function (d) { return { status: r.status, data: d }; });
        })
        .then(function (res) {
          if (res.status >= 200 && res.status < 300 && res.data && res.data.ok) {
            if (window.FPConsent) window.FPConsent.track('forum_form', { form_key: cfg.form_key });
            // прячем все поля формы, оставляем сообщение об успехе
            Array.prototype.forEach.call(form.children, function (c) {
              if (c !== msg) c.style.display = 'none';
            });
            setMsg('Готово! Заявка у нас — ответим на ' + email + '.', 'ok');
          } else {
            setMsg((res.data && res.data.error) || 'Не получилось отправить. Попробуй ещё раз.', 'err');
            if (btn) { btn.disabled = false; btn.textContent = label; }
          }
        })
        .catch(function () {
          setMsg('Сеть недоступна. Попробуй ещё раз чуть позже.', 'err');
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  }

  function start() {
    FORMS.forEach(function (cfg) {
      if (document.querySelector(cfg.form)) wire(cfg);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.FPForumForm = { wire: wire, FORMS: FORMS };
})();
