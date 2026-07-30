/* ============================================================
   Frankenplatz — страница-сборка ПОСТА.
   Слева: структура поста (архетип каждого слайда + смена варианта).
   Центр: карусель поста (листание + PNG).
   Справа: обложка для Telegram (единая картинка, свой PNG).
   Ожидает: FP_CATS, FP_POST, FP_COVER, FP_FOOTER, snapdom, JSZip.
   ============================================================ */
(function () {
  const app = document.getElementById('app');
  let curTheme = app.dataset.theme || 'theme-violet';
  document.body.classList.add(curTheme, 'font-a');

  const CATS = window.FP_CATS;
  const catById = id => CATS.find(c => c.id === id);
  const catName = id => (catById(id) || {}).name || id;
  const POST = window.FP_POST.map(s => ({ ...s }));   // рабочая копия
  let cur = 0;

  app.innerHTML = `
    <div class="topbar">
      <div class="brand"><span class="dot"></span> Frankenplatz <span class="muted" style="color:#9A8BB3;font-weight:600">· сборка поста</span></div>
      <div class="tools">
        <div class="seg" id="themeSeg">
          <button data-theme="theme-white">Светлый</button>
          <button data-theme="theme-violet" class="on">Фиолетовый</button>
          <button data-theme="theme-brown">Коричневый</button>
        </div>
        <div class="seg" id="fontSeg">
          <button data-font="font-a" class="on">A · Unbounded</button>
          <button data-font="font-b">B · Montserrat</button>
          <button data-font="font-c">C · Manrope</button>
        </div>
        <button class="btn ghost on" id="gridBtn" aria-pressed="true">Клетка</button>
        <button class="btn gold" id="pngAll">Скачать карусель</button>
      </div>
    </div>
    <div class="shell">
      <div class="main">
        <div class="viewport"><div class="frame" id="frame"></div></div>
        <div class="nav">
          <button class="arrow" id="prev">‹</button>
          <div class="dots" id="dots"></div>
          <div class="count"><b id="cIdx">1</b> / <span id="cTot">1</span></div>
          <button class="arrow" id="next">›</button>
        </div>
      </div>
      <aside class="coverpane">
        <div class="cp-h"><div class="t">Обложка для Telegram<small>единая картинка · 1080×1350</small></div>
          <button class="btn gold" id="pngCover">PNG</button></div>
        <div class="cp-stage"><div class="cover-frame" id="coverFrame"></div></div>
      </aside>
    </div>`;

  const frame = document.getElementById('frame');
  const coverFrame = document.getElementById('coverFrame');
  const dots = document.getElementById('dots');
  const struct = document.getElementById('struct');
  const cIdx = document.getElementById('cIdx');
  const cTot = document.getElementById('cTot');
  let slides = [];

  // варианты слайда: авторский (html) + альтернативы, ИЛИ старая модель {cat,variant}
  function options(s) {
    if (s.html !== undefined) {
      return [{ label: s.label || 'Авторский', html: s.html }, ...(s.alts || [])];
    }
    const cat = catById(s.cat);
    return cat.slides.map((h, i) => ({ label: 'Вариант ' + (i + 1), html: h }));
  }
  function slideName(s) { return s.html !== undefined ? (s.label || 'Слайд') : catName(s.cat); }
  function slideHTML(s) {
    const o = options(s);
    return o[Math.max(0, Math.min(o.length - 1, s.sel || 0))].html;
  }

  function renderCarousel() {
    frame.innerHTML = POST
      .map((s, k) => `<div class="slide${k === cur ? ' active' : ''}" data-i="${k}">${slideHTML(s)}${window.FP_FOOTER}${k > 0 ? `<div class="pageno">${k + 1}<span class="tot">/ ${POST.length}</span></div>` : ''}</div>`)
      .join('');
    dots.innerHTML = POST.map((_, k) => `<i data-i="${k}" class="${k === cur ? 'on' : ''}"></i>`).join('');
    slides = [...frame.querySelectorAll('.slide')];
    dots.querySelectorAll('i').forEach(d => d.onclick = () => show(+d.dataset.i));
    cTot.textContent = POST.length;
    show(cur);
    fit();
  }

  function renderStruct() {
    if (!struct) return;
    struct.querySelectorAll('.srow').forEach(n => n.remove());
    POST.forEach((s, k) => {
      const row = document.createElement('div');
      row.className = 'srow' + (k === cur ? ' on' : '');
      row.innerHTML = `<div class="sr-top"><span class="sr-i">${k + 1}</span><span class="sr-name">${slideName(s)}</span></div>`;
      row.onclick = () => show(k);
      struct.appendChild(row);
    });
  }

  function show(i) {
    cur = Math.max(0, Math.min(POST.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle('active', k === cur));
    dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === cur));
    struct && struct.querySelectorAll('.srow').forEach((r, k) => r.classList.toggle('on', k === cur));
    cIdx.textContent = cur + 1;
    document.getElementById('prev').disabled = cur === 0;
    document.getElementById('next').disabled = cur === POST.length - 1;
  }

  document.getElementById('prev').onclick = () => show(cur - 1);
  document.getElementById('next').onclick = () => show(cur + 1);
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // обложка Telegram
  coverFrame.innerHTML = `<div class="slide active">${window.FP_COVER}</div>`;

  // масштаб обеих сцен
  const vp = app.querySelector('.viewport');
  const cpStage = app.querySelector('.cp-stage');
  function fitEl(stage, el) {
    if (!stage) return;
    const cs = getComputedStyle(stage);
    const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (w > 0 && h > 0) el.style.transform = `scale(${Math.min(w / 1000, h / 1250, 1) || 1})`;
  }
  function fit() { fitEl(vp, frame); fitEl(cpStage, coverFrame); }
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (window.ResizeObserver) { new ResizeObserver(fit).observe(vp); new ResizeObserver(fit).observe(cpStage); }

  // тема / шрифт (действуют и на карусель, и на обложку)
  document.querySelectorAll('#themeSeg button').forEach(b => b.onclick = () => {
    document.body.classList.remove('theme-white', 'theme-violet', 'theme-brown');
    curTheme = b.dataset.theme; document.body.classList.add(curTheme);
    document.querySelectorAll('#themeSeg button').forEach(x => x.classList.toggle('on', x === b));
  });
  document.querySelectorAll('#fontSeg button').forEach(b => b.onclick = () => {
    document.body.classList.remove('font-a', 'font-b', 'font-c');
    document.body.classList.add(b.dataset.font);
    document.querySelectorAll('#fontSeg button').forEach(x => x.classList.toggle('on', x === b));
  });

  // тумблер сетки (клетки)
  const gridBtn = document.getElementById('gridBtn');
  gridBtn.onclick = () => {
    const off = document.body.classList.toggle('no-grid');
    gridBtn.classList.toggle('on', !off);
    gridBtn.setAttribute('aria-pressed', String(!off));
  };

  // ---- экспорт PNG (1080×1350) ----
  const OUT_W = 1080;

  async function render(el) {
    await document.fonts.ready;
    // snapdom renders the DOM natively via SVG <foreignObject> and inlines the
    // web-fonts, so gradients, background-clip:text and the highlighter bars come
    // out exactly as on screen — no manual canvas repaint. Output 1080×1350 @2x.
    const scaled = el.closest('.frame, .cover-frame');
    const prev = scaled ? scaled.style.transform : null;
    if (scaled) scaled.style.transform = 'none';
    const bg = getComputedStyle(el).backgroundColor;
    try {
      const srcW = el.offsetWidth || 1000;
      const scale = (OUT_W * 2) / srcW;               // 1000 → 2160
      const shot = await snapdom(el, { scale, backgroundColor: bg, embedFonts: true });
      const src = await shot.toCanvas();
      const out = document.createElement('canvas');
      out.width = OUT_W * 2; out.height = Math.round(OUT_W * 2 * 1.25);   // 2160×2700
      const ctx = out.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(src, 0, 0, out.width, out.height);
      return out;
    } finally {
      if (scaled) scaled.style.transform = prev;
    }
  }
  function dl(canvas, name) { const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = name; a.click(); }
  const slug = () => curTheme.replace('theme-', '');
  const toBlob = c => new Promise(res => c.toBlob(res, 'image/png'));

  document.getElementById('pngAll').onclick = async function () {
    this.disabled = true;
    try {
      const zip = new JSZip();
      for (let k = 0; k < slides.length; k++) {
        this.textContent = `Рендер ${k + 1}/${slides.length}…`;
        const wasA = slides[k].classList.contains('active'); slides[k].classList.add('active');
        const blob = await toBlob(await render(slides[k]));
        zip.file(`frankenplatz-post-${slug()}-${String(k + 1).padStart(2, '0')}.png`, blob);
        if (!wasA) slides[k].classList.remove('active');
        await new Promise(r => setTimeout(r, 60));
      }
      this.textContent = 'Упаковка…';
      const out = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(out);
      a.download = `frankenplatz-post-${slug()}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } finally {
      this.textContent = 'Скачать карусель'; this.disabled = false;
    }
  };
  document.getElementById('pngCover').onclick = async function () {
    this.textContent = '…'; this.disabled = true;
    try { dl(await render(coverFrame.querySelector('.slide')), `frankenplatz-cover-${slug()}.png`); }
    finally { this.textContent = 'PNG'; this.disabled = false; }
  };

  renderCarousel();
  renderStruct();
  requestAnimationFrame(fit);
})();
