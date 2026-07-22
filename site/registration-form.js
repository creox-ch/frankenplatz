/* Frankenplatz — ранняя регистрация на форум (блок #reg на главной).

   Почему «ранняя регистрация», а не покупка билета: схема билетов и цены
   ещё не готовы. Ждать нельзя — все 10 кнопок «Забронировать место» ведут
   в этот блок, и до сих пор он ничего не делал. Форма собирает людей уже
   сейчас; когда появятся цены, сюда встанет модуль оплаты (Payrexx),
   а form_key='registration' и тип «Регистрация» в витрине базы уже заложены.

   Модуль отдельный (как speaker-form.js / newsletter-form.js) — синхронизация
   дизайна его не сотрёт.

   Подключение: <script src="site/registration-form.js"></script>
*/
(function () {
  'use strict';

  var ENDPOINT = 'https://slswiss-tickets.vercel.app/api/forms';
  var EVENT = 'frankenplatz-2026-10';
  var STYLE_ID = 'fp-reg-style';

  var CSS = [
    '.fp-reg{max-width:560px;margin:26px auto 0;text-align:left;background:var(--glass,rgba(255,255,255,.045));',
    'border:1px solid var(--line-strong,rgba(255,255,255,.16));border-radius:20px;padding:24px 26px;backdrop-filter:blur(8px)}',
    '.fp-reg h3{font-family:"Unbounded","Manrope",sans-serif;font-size:18px;font-weight:700;letter-spacing:-.02em;',
    'color:var(--heading,#fff);margin:0 0 6px}',
    '.fp-reg .fp-reg__sub{font-size:13.5px;color:var(--muted,#C3B7D4);margin:0 0 18px;line-height:1.5}',
    '.fp-reg__grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '@media(max-width:560px){.fp-reg__grid{grid-template-columns:1fr}}',
    '.fp-reg__f{display:flex;flex-direction:column;gap:5px}',
    '.fp-reg__f.wide{grid-column:1/-1}',
    '.fp-reg label{font-size:12.5px;font-weight:600;color:var(--ink,#F3EEF9)}',
    '.fp-reg input[type=text],.fp-reg input[type=email],.fp-reg select{background:rgba(0,0,0,.20);',
    'border:1px solid var(--line-strong,rgba(255,255,255,.16));border-radius:11px;padding:11px 13px;',
    'color:var(--ink,#F3EEF9);font:inherit;font-size:15px;width:100%}',
    '.fp-reg select option{background:#1A0E28;color:#F3EEF9}',
    '.fp-reg input:focus,.fp-reg select:focus{outline:none;border-color:var(--gold,#E6B450)}',
    '.fp-reg__consent{display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:12.5px;',
    'color:var(--muted-2,#9A8BB3);line-height:1.45;margin-top:14px}',
    '.fp-reg__consent input{accent-color:var(--gold,#E6B450);width:16px;height:16px;margin-top:1px;cursor:pointer;flex:none}',
    '.fp-reg__consent a{color:var(--lila-bright,#B98BFF)}',
    '.fp-reg__btn{margin-top:16px;width:100%;border:0;border-radius:999px;padding:14px 22px;cursor:pointer;',
    'font:700 15px "Manrope",system-ui,sans-serif;color:#231433;',
    'background:linear-gradient(92deg,var(--gold,#E6B450),var(--gold-bright,#F5C969))}',
    '.fp-reg__btn:disabled{opacity:.55;cursor:default}',
    '.fp-reg__msg{font-size:13.5px;line-height:1.5;margin-top:12px}',
    '.fp-reg__msg.ok{color:var(--green,#8BE59B)}',
    '.fp-reg__msg.err{color:var(--red,#FF7A8A)}',
    '.fp-reg__hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function build() {
    var box = document.createElement('div');
    box.className = 'fp-reg';
    box.innerHTML =
      '<h3>Ранняя регистрация</h3>' +
      '<p class="fp-reg__sub">Продажи ещё не открыты. Оставь контакты — и ты узнаешь о старте и ценах первым, до публичного анонса.</p>' +
      '<form novalidate>' +
        '<div class="fp-reg__grid">' +
          '<div class="fp-reg__f"><label for="fpreg-name">Имя</label>' +
            '<input id="fpreg-name" type="text" name="name" autocomplete="name" placeholder="Как к тебе обращаться"></div>' +
          '<div class="fp-reg__f"><label for="fpreg-email">E-mail *</label>' +
            '<input id="fpreg-email" type="email" name="email" autocomplete="email" placeholder="you@example.ch" required></div>' +
          '<div class="fp-reg__f"><label for="fpreg-day">Что интересует</label>' +
            '<select id="fpreg-day" name="day">' +
              '<option value="Оба дня">Оба дня</option>' +
              '<option value="День 1 — где деньги и как их не потерять">День 1 — база</option>' +
              '<option value="День 2 — деньги работают на тебя">День 2 — следующий уровень</option>' +
              '<option value="Ещё не решил(а)">Ещё не решил(а)</option>' +
            '</select></div>' +
          '<div class="fp-reg__f"><label for="fpreg-seats">Сколько мест</label>' +
            '<select id="fpreg-seats" name="seats">' +
              '<option value="1">1</option><option value="2">2</option>' +
              '<option value="3">3</option><option value="4">4</option><option value="5+">5 и больше</option>' +
            '</select></div>' +
          '<div class="fp-reg__f wide"><label for="fpreg-contact">Telegram или телефон (необязательно)</label>' +
            '<input id="fpreg-contact" type="text" name="contact" placeholder="@nickname или +41 …"></div>' +
        '</div>' +
        '<div class="fp-reg__hp" aria-hidden="true"><label>Не заполняйте<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<label class="fp-reg__consent"><input type="checkbox" name="consent">' +
          '<span>Согласен(на) на обработку контактов, чтобы получить информацию о старте продаж и программе. ' +
          'Отписаться можно в любой момент. <a href="legal.html#datenschutz">Политика конфиденциальности</a>.</span></label>' +
        '<button type="submit" class="fp-reg__btn">Записаться в ранний список</button>' +
        '<p class="fp-reg__msg" role="status" aria-live="polite"></p>' +
      '</form>';
    return box;
  }

  function wire(box) {
    var form = box.querySelector('form');
    var msg = box.querySelector('.fp-reg__msg');
    var btn = box.querySelector('.fp-reg__btn');
    var shownAt = Date.now();

    function setMsg(t, kind) {
      msg.textContent = t || '';
      msg.className = 'fp-reg__msg' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg('');

      var email = String(form.email.value || '').trim();
      if (!email || email.indexOf('@') < 1) {
        setMsg('Проверь e-mail — кажется, есть опечатка.', 'err');
        form.email.focus();
        return;
      }
      if (!form.consent.checked) {
        setMsg('Нужно согласие на обработку данных.', 'err');
        return;
      }

      var contact = String(form.contact.value || '').trim();
      btn.disabled = true;
      btn.textContent = 'Отправляю…';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'forum',
          event: EVENT,
          form_key: 'registration',
          kind: 'lead',
          role: 'Ранняя регистрация',
          source_url: location.href,
          name: String(form.name.value || '').trim(),
          email: email,
          // Telegram отличаем от телефона по @ — мелочь, но избавляет
          // от лишнего поля в форме.
          telegram: contact.indexOf('@') === 0 ? contact : '',
          phone: contact.indexOf('@') === 0 ? '' : contact,
          consent: true,
          website: form.website.value,
          elapsed_ms: Date.now() - shownAt,
          payload: {
            'Интересует': form.day.value,
            'Мест': form.seats.value
          }
        })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; })
            .then(function (d) { return { status: r.status, data: d }; });
        })
        .then(function (res) {
          if (res.status >= 200 && res.status < 300 && res.data && res.data.ok) {
            if (window.FPConsent) window.FPConsent.track('registration_early', { event_slug: EVENT });
            form.innerHTML = '';
            setMsg('Готово! Ты в раннем списке — подтверждение отправили на ' + email +
                   '. Напишем первым, как только откроются продажи.', 'ok');
            form.appendChild(msg);
          } else {
            setMsg((res.data && res.data.error) || 'Не получилось отправить. Попробуй ещё раз.', 'err');
            btn.disabled = false;
            btn.textContent = 'Записаться в ранний список';
          }
        })
        .catch(function () {
          setMsg('Сеть недоступна. Попробуй ещё раз чуть позже.', 'err');
          btn.disabled = false;
          btn.textContent = 'Записаться в ранний список';
        });
    });
  }

  function mount() {
    var sec = document.getElementById('reg');
    if (!sec || sec.querySelector('.fp-reg')) return true;
    var host = sec.querySelector('.inner') || sec;
    injectStyle();
    var box = build();
    host.appendChild(box);
    wire(box);
    return true;
  }

  /** Лендинг рисуется React-ом асинхронно — ждём появления секции. */
  function start() {
    if (mount()) return;
    var tries = 0;
    var t = setInterval(function () {
      if (mount() || ++tries > 60) clearInterval(t);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
