/* ============================================================
   Просмотрщик карусели — категории-архетипы + навигация + PNG.
   Ожидает: window.FP_CATS = [{id,name,slides:[html,...]}],
            window.FP_FOOTER, snapdom (@zumer/snapdom).
   #app: data-theme.
   ============================================================ */
(function () {
  const app = document.getElementById('app');
  let curTheme = app.dataset.theme || 'theme-violet';
  document.body.classList.add(curTheme);

  const CATS = window.FP_CATS;
  let ci = 0;   // индекс категории
  let cur = 0;  // индекс варианта внутри категории

  app.innerHTML = `
    <div class="topbar">
      <div class="brand"><span class="dot"></span> Frankenplatz</div>
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
        <button class="btn" id="pngOne">PNG слайда</button>
        <button class="btn gold" id="pngAll">Скачать раздел</button>
      </div>
    </div>
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="side-h">Архетипы</div>
      </aside>
      <div class="main">
        <div class="viewport"><div class="frame" id="frame"></div></div>
        <div class="nav">
          <button class="arrow" id="prev" aria-label="Назад">‹</button>
          <div class="dots" id="dots"></div>
          <div class="count"><b id="cIdx">1</b> / <span id="cTot">1</span></div>
          <button class="arrow" id="next" aria-label="Вперёд">›</button>
        </div>
      </div>
    </div>`;

  document.body.classList.add('font-a');

  // боковое меню категорий
  const sidebar = document.getElementById('sidebar');
  CATS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'cat' + (i === 0 ? ' on' : '');
    b.innerHTML = `<span class="cat-n">${c.name}</span><span class="cat-c">${c.slides.length}</span>`;
    b.onclick = () => selectCat(i);
    sidebar.appendChild(b);
  });
  const catBtns = [...sidebar.querySelectorAll('.cat')];

  const frame = document.getElementById('frame');
  const dots = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const cIdx = document.getElementById('cIdx');
  const cTot = document.getElementById('cTot');
  let slides = [];

  function selectCat(i) {
    ci = i; cur = 0;
    catBtns.forEach((b, k) => b.classList.toggle('on', k === i));
    const list = CATS[i].slides;
    frame.innerHTML = list
      .map((html, k) => `<div class="slide${k === 0 ? ' active' : ''}" data-i="${k}">${html}${window.FP_FOOTER}${k > 0 ? `<div class="pageno">${k + 1}<span class="tot">/ ${list.length}</span></div>` : ''}</div>`)
      .join('');
    dots.innerHTML = list.map((_, k) => `<i data-i="${k}" class="${k === 0 ? 'on' : ''}"></i>`).join('');
    slides = [...frame.querySelectorAll('.slide')];
    dots.querySelectorAll('i').forEach(d => d.onclick = () => show(+d.dataset.i));
    cTot.textContent = list.length;
    show(0);
    fit();
  }

  function show(i) {
    const N = slides.length;
    cur = Math.max(0, Math.min(N - 1, i));
    slides.forEach((s, k) => s.classList.toggle('active', k === cur));
    dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === cur));
    cIdx.textContent = cur + 1;
    prev.disabled = cur === 0;
    next.disabled = cur === N - 1;
  }

  prev.onclick = () => show(cur - 1);
  next.onclick = () => show(cur + 1);
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // масштаб слайда под окно
  const vp = app.querySelector('.viewport');
  function fit() {
    const cs = getComputedStyle(vp);
    const availW = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = vp.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (!availW || !availH || availH < 0) return;
    const scale = Math.min(availW / 1000, availH / 1250, 1) || 1;
    frame.style.transform = `scale(${scale})`;
  }
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(vp);

  // тема
  document.querySelectorAll('#themeSeg button').forEach(b => {
    b.onclick = () => {
      document.body.classList.remove('theme-white', 'theme-violet', 'theme-brown');
      curTheme = b.dataset.theme;
      document.body.classList.add(curTheme);
      document.querySelectorAll('#themeSeg button').forEach(x => x.classList.toggle('on', x === b));
    };
  });
  // шрифт
  document.querySelectorAll('#fontSeg button').forEach(b => {
    b.onclick = () => {
      document.body.classList.remove('font-a', 'font-b', 'font-c');
      document.body.classList.add(b.dataset.font);
      document.querySelectorAll('#fontSeg button').forEach(x => x.classList.toggle('on', x === b));
    };
  });

  // ---- экспорт PNG (1080×1350) ----
  const OUT_W = 1080;
  // snapdom renders the DOM natively via SVG <foreignObject> and inlines web-fonts,
  // so gradients, background-clip:text and highlighter bars export exactly as on screen.
  async function renderSlide(el) {
    await document.fonts.ready;
    const wasActive = el.classList.contains('active');
    el.classList.add('active');
    const scaled = el.closest('.frame, .cover-frame');
    const prev = scaled ? scaled.style.transform : null;
    if (scaled) scaled.style.transform = 'none';
    const bg = getComputedStyle(el).backgroundColor;
    let canvas;
    try {
      const srcW = el.offsetWidth || 1000;
      const scale = (OUT_W * 2) / srcW;               // 1000 → 2160
      const shot = await snapdom(el, { scale, backgroundColor: bg, embedFonts: true });
      const src = await shot.toCanvas();
      canvas = document.createElement('canvas');
      canvas.width = OUT_W * 2; canvas.height = Math.round(OUT_W * 2 * 1.25);   // 2160×2700
      const octx = canvas.getContext('2d');
      octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
      octx.drawImage(src, 0, 0, canvas.width, canvas.height);
    } finally {
      if (scaled) scaled.style.transform = prev;
    }
    if (!wasActive) el.classList.remove('active');
    return canvas;
  }
  function dl(canvas, name) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = name; a.click();
  }
  const slug = () => curTheme.replace('theme-', '');

  document.getElementById('pngOne').onclick = async function () {
    this.textContent = '…'; this.disabled = true;
    try {
      const c = await renderSlide(slides[cur]);
      dl(c, `frankenplatz-${slug()}-${CATS[ci].id}-${String(cur + 1).padStart(2, '0')}.png`);
    } finally { this.textContent = 'PNG слайда'; this.disabled = false; }
  };
  document.getElementById('pngAll').onclick = async function () {
    this.disabled = true;
    for (let k = 0; k < slides.length; k++) {
      this.textContent = `Рендер ${k + 1}/${slides.length}…`;
      const c = await renderSlide(slides[k]);
      dl(c, `frankenplatz-${slug()}-${CATS[ci].id}-${String(k + 1).padStart(2, '0')}.png`);
      await new Promise(r => setTimeout(r, 350));
    }
    this.textContent = 'Скачать раздел'; this.disabled = false;
  };

  selectCat(0);
  requestAnimationFrame(fit);
})();
