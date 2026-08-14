/* Frankenplatz — canonical chrome behaviour (progressive enhancement).
   Burger toggle for the mobile menu + newsletter "sent" state.
   The header/footer render fine without this file; it only adds interactivity. */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    // Mobile burger
    var burger = document.querySelector(".fp-top__burger");
    var menu = document.querySelector(".fp-top__menu");
    if (menu && !menu.querySelector(".fp-top__menu-foot")) {
      /* подвал мобильного меню: призыв + короткая информация из футера.
         Ссылки абсолютные от корня — на сайте cleanUrls, и вычислять «../»
         для страниц в подпапках больше не нужно.
         Призыв ведёт на билеты: до 10.08.2026 здесь была «Зарегистрироваться
         на форум» — она открывала форму ранней регистрации, которая после
         старта продаж конкурировала с покупкой. */
      var foot = document.createElement("div");
      foot.className = "fp-top__menu-foot";
      var hasCta = !!menu.querySelector(".fp-top__link--cta");
      foot.innerHTML =
        '<a class="fp-top__menu-ig" href="https://www.instagram.com/frankenplatz.ch/" target="_blank" rel="noopener" aria-label="Instagram Frankenplatz"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.23 1 .5 1.5.95.45.45.72.9.95 1.5.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.23.6-.5 1-.95 1.5-.45.45-.9.72-1.5.95-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.23-1-.5-1.5-.95-.45-.45-.72-.9-.95-1.5-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.23-.6.5-1 .95-1.5.45-.45.9-.72 1.5-.95.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.07-1 .04-1.5.2-1.9.35-.4.15-.7.34-1 .64-.3.3-.5.6-.64 1-.15.4-.3.9-.35 1.9C3.24 9.3 3.2 9.7 3.2 12s0 2.7.07 4c.04 1 .2 1.5.35 1.9.15.4.34.7.64 1 .3.3.6.5 1 .64.4.15.9.3 1.9.35 1.3.06 1.7.07 4.8.07s3.5 0 4.8-.07c1-.04 1.5-.2 1.9-.35.4-.15.7-.34 1-.64.3-.3.5-.6.64-1 .15-.4.3-.9.35-1.9.06-1.3.07-1.7.07-4s0-2.7-.07-4c-.04-1-.2-1.5-.35-1.9a2.7 2.7 0 0 0-.64-1 2.7 2.7 0 0 0-1-.64c-.4-.15-.9-.3-1.9-.35-1.3-.06-1.7-.07-4.8-.07zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.1-2.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg></a>' +
        (hasCta ? '' : '<a class="fp-top__menu-cta" href="/tickets">\u041a\u0443\u043f\u0438\u0442\u044c \u0431\u0438\u043b\u0435\u0442</a>') +
        '<p class="fp-top__menu-legal">Frankenplatz \u00b7 24\u201325.10.2026 \u00b7 Baden<br>\u00a9 2026 Frankenplatz.ch \u2014 \u0432\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b</p>';
      menu.appendChild(foot);
    }
    if (burger && menu) {
      /* Панель закрывается всеми привычными способами: повторный тап по кнопке,
         тап мимо панели, Escape, переход по ссылке, разворот окна на десктоп.
         Раньше был только повторный тап по кнопке 44×44 — промахнулся, и меню
         продолжало висеть поверх страницы. */
      var docEl = document.documentElement;
      var mq = window.matchMedia("(max-width:1279px)");
      var isOpen = false;

      /* Подложку добавляем скриптом: разметка шапки скопирована в каждую
         статическую страницу, и менять её ради одного div пришлось бы во всех. */
      var scrim = document.createElement("div");
      scrim.className = "fp-top__scrim";
      document.body.appendChild(scrim);

      /* Иконку рисует CSS на псевдоэлементах — глиф из разметки убираем, чтобы
         текст и полоски не накладывались друг на друга. */
      burger.textContent = "";
      if (!menu.id) menu.id = "fp-top-menu";
      menu.setAttribute("tabindex", "-1");
      burger.setAttribute("aria-controls", menu.id);
      burger.setAttribute("aria-expanded", "false");

      function focusables() {
        return Array.prototype.slice
          .call(menu.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'))
          .filter(function (el) { return el.getClientRects().length > 0; });
      }

      /* Прокрутку фона глушим на <html>; ширину полосы прокрутки компенсируем,
         иначе на планшете страница дёргается вбок в момент открытия. */
      function lockScroll(on) {
        if (on) {
          var gap = window.innerWidth - docEl.clientWidth;
          docEl.style.overflow = "hidden";
          if (gap > 0) docEl.style.paddingRight = gap + "px";
        } else {
          docEl.style.overflow = "";
          docEl.style.paddingRight = "";
        }
      }

      function setOpen(next, returnFocus) {
        if (next === isOpen) return;
        isOpen = next;
        menu.classList.toggle("is-open", next);
        scrim.classList.toggle("is-open", next);
        burger.setAttribute("aria-expanded", next ? "true" : "false");
        burger.setAttribute("aria-label", next ? "Закрыть меню" : "Открыть меню");
        lockScroll(next);
        /* Фокус переносим следующим кадром: в момент клика панель ещё
           visibility:hidden, стиль не пересчитан, и focus() по такому элементу
           браузер молча игнорирует — фокус оставался на кнопке. */
        if (next) requestAnimationFrame(function () { if (isOpen) menu.focus({ preventScroll: true }); });
        else if (returnFocus) burger.focus({ preventScroll: true });
      }

      burger.addEventListener("click", function () { setOpen(!isOpen, true); });
      scrim.addEventListener("click", function () { setOpen(false, false); });

      menu.querySelectorAll("a:not(.fp-top__menu-ig)").forEach(function (a) {
        a.addEventListener("click", function () { setOpen(false, false); });
      });

      document.addEventListener("keydown", function (e) {
        if (!isOpen) return;
        if (e.key === "Escape") { setOpen(false, true); return; }
        if (e.key !== "Tab") return;
        /* Пока панель открыта, Tab ходит по кругу внутри неё: без этого фокус
           уходил на скрытую за подложкой страницу, и с клавиатуры было не понять,
           где ты находишься. */
        var list = focusables();
        if (!list.length) return;
        var first = list[0];
        var last = list[list.length - 1];
        var active = document.activeElement;
        if (e.shiftKey && (active === first || active === menu)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      });

      /* Растянули окно до десктопа с открытой панелью — закрываем: иначе на
         странице оказывались сразу и горизонтальное меню, и панель. */
      var onWidthChange = function () { if (!mq.matches) setOpen(false, false); };
      if (mq.addEventListener) mq.addEventListener("change", onWidthChange);
      else if (mq.addListener) mq.addListener(onWidthChange);
    }
    // Newsletter form → "sent" message
    var form = document.querySelector(".fp-foot__form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var done = document.createElement("p");
        done.className = "fp-foot__done";
        done.textContent = "Спасибо! Напишем, когда будут новости о программе и спикерах.";
        var note = form.parentNode.querySelector(".fp-foot__note");
        if (note) note.remove();
        form.replaceWith(done);
      });
    }
  });
})();
