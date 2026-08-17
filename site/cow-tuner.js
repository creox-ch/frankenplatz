/* Инжектится родителем (cow-tuner.html) в iframe с реальной страницей сайта.
   Даёт перетаскивать и растягивать коров, пишет значения в localStorage.

   🛠 ИНСТРУМЕНТ ДИЗАЙНА, НЕ ЧАСТЬ САЙТА — не подключён ни на одной странице,
   и подключать не нужно.

   Родительской страницы cow-tuner.html в этом репозитории никогда не было:
   она живёт в проекте Claude Design, а сюда выгрузка 02.08 (9a0218a) принесла
   только инжектируемую часть. Модуль ничего не отправляет и ничего не решает:
   он рисует ручки поверх коров, а результат кладёт в localStorage 'fp.cows.v1'
   у того, кто крутит. Посетитель сайта его не увидит и увидеть не должен —
   у него весь экран будет в жёлтых рамках и подписях.

   Итог подбора уже вморожен в CSS руками: site/cows-fluid.css,
   site/market-fluid.css и site/polish.css (там же указаны ширины 360 / 390 /
   430 / 768 / 900 / 1280, на которых значения снимали). То есть настройки
   пережили инструмент — сайт от него не зависит.

   Оставлен на случай, если коров придётся пересобирать: без него правки
   позиций снова превращаются в «поменял число — обновил — не то».
   Как пользоваться: открыть cow-tuner.html из дизайн-проекта, он сам
   подтянет этот файл в iframe со страницей сайта.
*/
(function () {
  if (window.__cowTuneReady) { window.__cowRefresh && window.__cowRefresh(); return; }
  window.__cowTuneReady = true;

  var KEY = "fp.cows.v1";
  var SPOTS = window.__COW_SPOTS || [];
  var doc = document;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function bp() { return String(window.__COW_BP || 1280); }
  function val(id) { var d = load(); return (d[id] && d[id][bp()]) || null; }
  function setVal(id, v) { var d = load(); d[id] = d[id] || {}; d[id][bp()] = v; save(d); notify(); }

  function notify() {
    try { window.parent.__cowChanged && window.parent.__cowChanged(); } catch (e) {}
  }

  var style = doc.createElement("style");
  style.id = "cow-tune-live";
  doc.head.appendChild(style);

  var chrome = doc.createElement("style");
  chrome.textContent =
    ".cow-tune{pointer-events:auto!important;outline:1px dashed rgba(230,180,80,.65);outline-offset:2px;cursor:move;touch-action:none}" +
    ".cow-tune.is-sel{outline:2px solid #E6B450}" +
    ".cow-tune__h{position:absolute;left:-9px;bottom:-9px;width:20px;height:20px;border-radius:50%;background:#E6B450;border:2px solid #140A1F;cursor:nwse-resize;z-index:9;pointer-events:auto;touch-action:none}" +
    ".cow-tune__hb{position:absolute;left:50%;bottom:-8px;margin-left:-60px;width:120px;height:16px;border-radius:8px;background:#B98BFF;border:2px solid #140A1F;cursor:ns-resize;z-index:20;pointer-events:auto;touch-action:none}" +
    ".cow-tune__hb::after{content:'нижний край блока';position:absolute;left:50%;top:-20px;transform:translateX(-50%);font:700 10px/1 ui-monospace,monospace;color:#B98BFF;white-space:nowrap}" +
    ".cow-tune-box{outline:1px dashed rgba(185,139,255,.5);outline-offset:0}" +
    ".cow-tune__hc{position:absolute;left:50%;bottom:-8px;margin-left:-40px;width:80px;height:14px;border-radius:7px;background:#E6B450;border:2px solid #140A1F;cursor:ns-resize;z-index:12;pointer-events:auto;touch-action:none}" +
    ".cow-tune__tag{position:absolute;left:0;top:-22px;font:700 11px/1 ui-monospace,monospace;letter-spacing:.06em;color:#140A1F;background:#E6B450;padding:4px 6px;border-radius:5px;pointer-events:none;white-space:nowrap}" +
    "#cookie-consent,.cookie-consent,.fp-cookie,#coin-intro,.coin-intro{display:none!important}";
  doc.head.appendChild(chrome);

  function apply() {
    var css = "";
    SPOTS.forEach(function (s) {
      var v = val(s.id);
      if (!v) return;
      // moveOnly: сдвиг + компенсация в потоке, чтобы контент ниже шёл следом
      if (s.moveOnly) { css += s.sel + "{transform:translate(" + Math.round(v.x) + "px," + Math.round(v.y) + "px)!important;margin-bottom:" + Math.round(v.y) + "px!important;}"; return; }
      css += s.sel + "{width:" + v.w.toFixed(2) + "%!important;transform:translate(" + Math.round(v.x) + "px," + Math.round(v.y) + "px)!important;}";
      if (v.h) css += s.sel + "{height:" + Math.round(v.h) + "px!important;overflow:hidden!important;}";
      if (v.iy != null) css += s.sel + " img{margin-top:" + Math.round(v.iy) + "px!important;}";
    });
    SPOTS.forEach(function (s) {
      var b = val(s.id + "__box");
      if (b && b.h && s.box) css += s.box + "{height:" + Math.round(b.h) + "px!important;min-height:0!important;}";
    });
    style.textContent = css;
    tags();
  }

  function tags() {
    SPOTS.forEach(function (s) {
      var el = doc.querySelector(s.sel); if (!el) return;
      var t = el.querySelector(":scope > .cow-tune__tag"); if (!t) return;
      var box = s.box ? doc.querySelector(s.box) : el.offsetParent;
      var v = val(s.id) || { w: box ? (el.getBoundingClientRect().width / box.getBoundingClientRect().width) * 100 : 0, x: 0, y: 0 };
      t.textContent = s.id + " · " + v.w.toFixed(1) + "% · x" + Math.round(v.x) + " y" + Math.round(v.y) + (v.h ? " · h" + Math.round(v.h) : "");
    });
  }

  var selected = null;
  function select(id) {
    selected = id;
    SPOTS.forEach(function (s) {
      var el = doc.querySelector(s.sel); if (el) el.classList.toggle("is-sel", s.id === id);
    });
    try { window.parent.__cowSelected && window.parent.__cowSelected(id); } catch (e) {}
  }

  function base(s, el) {
    var box = s.box ? doc.querySelector(s.box) : el.offsetParent;
    var bw = box ? box.getBoundingClientRect().width : el.getBoundingClientRect().width;
    var r = el.getBoundingClientRect();
    var crop = getComputedStyle(el).overflow === "hidden";
    var img = el.querySelector("img");
    var v = val(s.id);
    if (v) {
      if (crop && v.h == null) v.h = r.height;
      if (crop && v.iy == null && img) v.iy = parseFloat(getComputedStyle(img).marginTop) || 0;
      return { v: v, bw: bw, crop: crop };
    }
    return { v: { w: (r.width / bw) * 100, x: 0, y: 0, h: crop ? r.height : null, iy: crop && img ? (parseFloat(getComputedStyle(img).marginTop) || 0) : null }, bw: bw, crop: crop };
  }

  function wire(s, el) {
    if (el.__cowWired) return;
    el.__cowWired = true;
    el.classList.add("cow-tune");
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    var h = doc.createElement("div"); h.className = "cow-tune__h"; if (!s.moveOnly) el.appendChild(h);
    var hc = doc.createElement("div"); hc.className = "cow-tune__hc"; if (!s.moveOnly) el.appendChild(hc);
    // нижний край самой коровы: высота кадра без изменения ширины
    hc.addEventListener("pointerdown", function (e) {
      e.preventDefault(); e.stopPropagation(); select(s.id);
      var b = base(s, el), sy = e.clientY;
      var h0 = b.v.h != null ? b.v.h : el.getBoundingClientRect().height;
      hc.setPointerCapture(e.pointerId);
      function mv(ev) {
        setVal(s.id, { w: b.v.w, x: b.v.x, y: b.v.y, h: Math.max(60, h0 + (ev.clientY - sy)), iy: b.v.iy || 0 });
        apply();
      }
      function up() { hc.removeEventListener("pointermove", mv); hc.removeEventListener("pointerup", up); }
      hc.addEventListener("pointermove", mv); hc.addEventListener("pointerup", up);
    });
    var t = doc.createElement("div"); t.className = "cow-tune__tag"; el.appendChild(t);

    el.addEventListener("pointerdown", function (e) {
      if (e.target === h || e.target === hc) return;
      e.preventDefault(); select(s.id);
      var b = base(s, el), sx = e.clientX, sy = e.clientY, v0 = { w: b.v.w, x: b.v.x, y: b.v.y, h: b.v.h, iy: b.v.iy };
      el.setPointerCapture(e.pointerId);
      function mv(ev) {
        if (ev.altKey && b.crop) setVal(s.id, { w: v0.w, x: v0.x, y: v0.y, h: v0.h, iy: (v0.iy || 0) + (ev.clientY - sy) });
        else setVal(s.id, { w: v0.w, x: v0.x + (ev.clientX - sx), y: v0.y + (ev.clientY - sy), h: v0.h, iy: v0.iy });
        apply();
      }
      function up() { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); }
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up);
    });

    h.addEventListener("pointerdown", function (e) {
      e.preventDefault(); e.stopPropagation(); select(s.id);
      var b = base(s, el), sx = e.clientX, sy = e.clientY;
      var w0 = (b.v.w / 100) * b.bw, v0 = { x: b.v.x, y: b.v.y, h: b.v.h, iy: b.v.iy };
      h.setPointerCapture(e.pointerId);
      function mv(ev) {
        var w = Math.max(60, w0 - (ev.clientX - sx));
        var nv = { w: (w / b.bw) * 100, x: v0.x, y: v0.y, iy: v0.iy };
        if (v0.h) nv.h = Math.max(80, v0.h * (w / w0));
        setVal(s.id, nv); apply();
      }
      function up() { h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); }
      h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up);
    });
  }

  // нижняя грань самой плашки (блока), не коровы
  function wireBox(s, box) {
    if (box.__cowWired) return;
    box.__cowWired = true;
    box.classList.add("cow-tune-box");
    if (getComputedStyle(box).position === "static") box.style.position = "relative";
    var hb = doc.createElement("div"); hb.className = "cow-tune__hb"; box.appendChild(hb);
    hb.addEventListener("pointerdown", function (e) {
      e.preventDefault(); e.stopPropagation();
      var sy = e.clientY, cur = val(s.id + "__box");
      var h0 = cur && cur.h ? cur.h : box.getBoundingClientRect().height;
      hb.setPointerCapture(e.pointerId);
      function mv(ev) { setVal(s.id + "__box", { h: Math.max(120, h0 + (ev.clientY - sy)) }); apply(); }
      function up() { hb.removeEventListener("pointermove", mv); hb.removeEventListener("pointerup", up); }
      hb.addEventListener("pointermove", mv); hb.addEventListener("pointerup", up);
    });
  }

  doc.addEventListener("keydown", function (e) {
    if (!selected) return;
    var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    var s = SPOTS.filter(function (x) { return x.id === selected; })[0];
    var el = doc.querySelector(s.sel); if (!el) return;
    var b = base(s, el), k = e.shiftKey ? 10 : 1;
    if (e.altKey && b.crop) setVal(s.id, { w: b.v.w, x: b.v.x, y: b.v.y, h: b.v.h, iy: (b.v.iy || 0) + d[1] * k });
    else setVal(s.id, { w: b.v.w, x: b.v.x + d[0] * k, y: b.v.y + d[1] * k, h: b.v.h, iy: b.v.iy });
    apply();
  });

  function scan() {
    SPOTS.forEach(function (s) {
      var el = doc.querySelector(s.sel); if (el) wire(s, el);
      var box = s.box ? doc.querySelector(s.box) : null; if (box) wireBox(s, box);
    });
    apply();
  }
  var n = 0, iv = setInterval(function () { scan(); if (++n > 40) clearInterval(iv); }, 250);
  scan();

  window.__cowRefresh = apply;
  window.__cowFocus = function (id) {
    var s = SPOTS.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var el = doc.querySelector(s.sel); if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + el.offsetHeight / 2;
    window.scrollTo(0, Math.max(0, y));
    select(id);
  };
  window.__cowReset = function (id) {
    var d = load();
    if (id) { if (d[id]) delete d[id][bp()]; } else { Object.keys(d).forEach(function (k) { delete d[k][bp()]; }); }
    save(d); apply(); notify();
  };
})();
