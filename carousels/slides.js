/* Frankenplatz — карусель: слайды по категориям-архетипам.
   window.FP_CATS = [{ id, name, slides:[html,...] }]
   Каждый html — содержимое слайда 1000×1250 (без .slide-обёртки);
   футер добавляет просмотрщик. Кнопка (.cta) — только на обложках и финалах. */

const F = {
  /* ---- ОБЛОЖКИ ---- */
  coverMark: `<div class="bg"></div><div class="pager">Обложка · маркер</div>
    <div class="stack cover">
      <div class="title-cover"><span class="line">Заголовок —</span><span class="line">с <span class="hi">маркером</span></span><span class="line">и <span class="grad">акцентом</span></span></div>
      <div class="lead">Лид одним живым абзацем: о&nbsp;чём выпуск и&nbsp;<b>зачем это тебе</b>.</div>
    </div>
    <div class="cta corner">Листай дальше <span class="arrow">→</span></div>`,

  coverQ: `<div class="bg"></div><div class="pager">Обложка · вопрос</div>
    <div class="stack cover">
      <div class="title-cover"><span class="line">Знаешь, какая</span><span class="line">у&nbsp;тебя будет</span><span class="line"><span class="hi">пенсия</span>?</span></div>
      <div class="lead">Прямой вопрос в&nbsp;лоб цепляет сильнее всего. Ниже — короткий лид с&nbsp;<b>обещанием ответа</b>.</div>
    </div>
    <div class="cta corner">Разберёмся <span class="arrow">→</span></div>`,

  coverTop: `<div class="bg"></div><div class="pager">Обложка · по верху</div>
    <div class="stack">
      <div class="title-cover"><span class="line">Деньги</span><span class="line">в&nbsp;Швейцарии:</span><span class="line">с чего <span class="hi">начать</span></span></div>
      <div class="lead">Заголовок прижат к&nbsp;верху — много воздуха снизу, <b>взгляд сразу на&nbsp;суть</b>.</div>
    </div>
    <div class="cta corner">Листай дальше <span class="arrow">→</span></div>`,

  coverQuote: `<div class="bg"></div><div class="pager">Обложка · цитата</div>
    <div class="stack" style="justify-content:center;">
      <div class="quote" style="font-size:74px;"><span class="qm">«</span>Живёшь в&nbsp;богатой стране, а&nbsp;<span class="grad">богатства не&nbsp;чувствуешь</span>?</div>
      <div class="lead">Знакомо? Тогда этот выпуск — для&nbsp;тебя.</div>
    </div>
    <div class="cta corner">Листай <span class="arrow">→</span></div>`,

  coverMini: `<div class="bg"></div><div class="pager">Обложка · минимал</div>
    <div class="stack" style="justify-content:center;">
      <div class="title-cover"><span class="line">Где деньги</span><span class="line">в&nbsp;Швейцарии —</span><span class="line">и как их <span class="hi">не&nbsp;терять</span></span></div>
    </div>
    <div class="cta corner">Листай дальше <span class="arrow">→</span></div>`,

  /* ---- СТАТИСТИКА ---- */
  statBig: `<div class="bg"></div><div class="pager">Статистика · крупная цифра</div>
    <div class="stack" style="justify-content:center;">
      <div class="bignum">2 520</div>
      <div class="bignum-cap">CHF в&nbsp;месяц — максимум пенсии AHV, даже при полном стаже 44&nbsp;года.</div>
      <div class="prose"><span class="hi"><b>Хватит?</b></span> Если нет — листай дальше.</div>
    </div>`,

  statTrio: `<div class="bg"></div><div class="pager">Статистика · три цифры</div>
    <div class="stack">
      <div class="title"><span class="t-line">Цифры, которые</span><span class="t-line"><span class="hi">отрезвляют</span></span></div>
      <div class="kpis">
        <div class="kpi"><div class="v">−38%</div><div class="k">доход женщины после развода</div></div>
        <div class="kpi"><div class="v">50/50</div><div class="k">раздел без брачного договора</div></div>
        <div class="kpi"><div class="v">+84%</div><div class="k">жизнь дороже, чем в&nbsp;ЕС</div></div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="v">2 520</div><div class="k">максимум пенсии AHV в&nbsp;месяц</div></div>
        <div class="kpi"><div class="v">3a</div><div class="k">ступень для экономии на&nbsp;налогах</div></div>
        <div class="kpi"><div class="v">44 г.</div><div class="k">стажа нужно для полной пенсии</div></div>
      </div>
    </div>`,

  statBA: `<div class="bg"></div><div class="pager">Статистика · было / стало</div>
    <div class="stack">
      <div class="title"><span class="t-line">Что даёт <span class="hi">3a</span></span><span class="t-line">за&nbsp;10&nbsp;лет</span></div>
      <div class="kpis">
        <div class="kpi"><div class="k" style="margin:0 0 10px;">Без 3a</div><div class="v">0</div><div class="k">налоговой экономии</div></div>
        <div class="kpi"><div class="k" style="margin:0 0 10px;">С 3a</div><div class="v">≈ 20k</div><div class="k">CHF сэкономленных налогов</div></div>
      </div>
      <div class="prose" style="font-size:26px;">Один и&nbsp;тот&nbsp;же человек — <b>разница только в&nbsp;одном решении</b>.</div>
    </div>`,

  statOne: `<div class="bg"></div><div class="pager">Статистика · цифра + мысль</div>
    <div class="stack">
      <div class="bignum" style="font-size:150px;">−38%</div>
      <div class="bignum-cap">теряет в&nbsp;доходе женщина после развода в&nbsp;Швейцарии.</div>
      <div class="prose">Не&nbsp;потому что закон несправедлив, а&nbsp;потому что <b>о&nbsp;деньгах не&nbsp;договорились заранее</b>.</div>
    </div>`,

  /* ---- ДИАГРАММЫ ---- */
  chartV: `<div class="bg"></div><div class="pager">Диаграмма · столбцы</div>
    <div class="stack">
      <div class="title"><span class="t-line">Рост капитала —</span><span class="t-line">это <span class="hi">столбцы</span></span></div>
      <div class="datacap">Накопления при 500 CHF/мес и 5% годовых</div>
      <div class="vbars" style="height:280px;margin-top:56px;">
        <div class="vbar"><div class="v">≈ 78k</div><div class="col" style="height:60px;background:var(--fillA);"></div><div class="lbl">10 лет</div></div>
        <div class="vbar"><div class="v">≈ 205k</div><div class="col" style="height:135px;background:var(--fillB);"></div><div class="lbl">20 лет</div></div>
        <div class="vbar"><div class="v">≈ 416k</div><div class="col" style="height:225px;background:var(--fillC);"></div><div class="lbl">30 лет</div></div>
      </div>
    </div>`,

  chartPie: `<div class="bg"></div><div class="pager">Диаграмма · круговая</div>
    <div class="stack">
      <div class="title"><span class="t-line">Структура —</span><span class="t-line">это <span class="hi">круг</span></span></div>
      <div class="pie-wrap">
        <svg class="pie" viewBox="0 0 200 200">
          <circle class="pbg" cx="100" cy="100" r="78"></circle>
          <circle cx="100" cy="100" r="78" pathLength="100" style="stroke:var(--fillC);stroke-dasharray:34 66;stroke-dashoffset:0;"></circle>
          <circle cx="100" cy="100" r="78" pathLength="100" style="stroke:var(--fillB);stroke-dasharray:18 82;stroke-dashoffset:-34;"></circle>
          <circle cx="100" cy="100" r="78" pathLength="100" style="stroke:var(--fillA);stroke-dasharray:14 86;stroke-dashoffset:-52;"></circle>
        </svg>
        <div class="legend">
          <div class="lg"><span class="sw" style="background:var(--fillC);"></span><span><b>34%</b> — аренда</span></div>
          <div class="lg"><span class="sw" style="background:var(--fillB);"></span><span><b>18%</b> — Krankenkasse</span></div>
          <div class="lg"><span class="sw" style="background:var(--fillA);"></span><span><b>14%</b> — налоги</span></div>
          <div class="lg"><span class="sw" style="background:var(--track);"></span><span><b>34%</b> — всё остальное</span></div>
        </div>
      </div>
    </div>`,

  chartH: `<div class="bg"></div><div class="pager">Диаграмма · бары</div>
    <div class="stack">
      <div class="title"><span class="t-line">Куда уходит</span><span class="t-line"><span class="hi">зарплата</span></span></div>
      <div class="datacap">Доля бюджета семьи в месяц, %</div>
      <div class="bars">
        <div class="bar"><div class="lbl"><span>Аренда</span><span>34</span></div><div class="track"><div class="fill" style="width:100%;background:var(--fillC);"></div></div></div>
        <div class="bar"><div class="lbl"><span>Krankenkasse</span><span>18</span></div><div class="track"><div class="fill" style="width:53%;background:var(--fillB);"></div></div></div>
        <div class="bar"><div class="lbl"><span>Налоги</span><span>14</span></div><div class="track"><div class="fill" style="width:41%;background:var(--fillA);"></div></div></div>
      </div>
    </div>`,

  chartTL: `<div class="bg"></div><div class="pager">Диаграмма · таймлайн</div>
    <div class="stack">
      <div class="title"><span class="t-line">Когда начинать —</span><span class="t-line"><span class="hi">таймлайн</span></span></div>
      <div class="timeline"><div class="axis"></div>
        <div class="tl-row"><span class="node"></span><span class="year">21</span><span class="ev">Стартует стаж для&nbsp;пенсии <b>AHV</b>.</span></div>
        <div class="tl-row"><span class="node"></span><span class="year">30</span><span class="ev">Пора открыть <b>3a</b> и&nbsp;начать инвестировать.</span></div>
        <div class="tl-row red"><span class="node"></span><span class="year">50</span><span class="ev">Поздний старт — <b>меньше пространства</b>.</span></div>
        <div class="tl-row"><span class="node"></span><span class="year">65</span><span class="ev">Выход на&nbsp;пенсию — итог всех решений.</span></div>
      </div>
    </div>`,

  /* ---- СПИСКИ ---- */
  listDots: `<div class="bg"></div><div class="pager">Список · точки</div>
    <div class="stack">
      <div class="title"><span class="t-line">Равнозначные</span><span class="t-line">факты — <span class="hi">точки</span></span></div>
      <div class="dot-list">
        <div class="row"><span class="dot"></span><span><span class="h">Первый факт.</span> Пояснение в&nbsp;1-2 строки с&nbsp;<b>акцентом</b>.</span></div>
        <div class="row red"><span class="dot"></span><span><span class="h">Острый пункт.</span> Красная точка — когда факт «жжёт» сильнее.</span></div>
        <div class="row"><span class="dot"></span><span><span class="h">Третий факт.</span> Порядок не&nbsp;важен — поэтому точки.</span></div>
      </div>
    </div>`,

  listNum: `<div class="bg"></div><div class="pager">Список · номера</div>
    <div class="stack">
      <div class="title"><span class="t-line">Последовательность</span><span class="t-line">— это <span class="hi">номера</span></span></div>
      <div class="items">
        <div class="item"><div class="num">01</div><div class="h">Первый шаг</div><div class="t">Есть порядок или приоритет — нумеруй.</div></div>
        <div class="item"><div class="num">02</div><div class="h">Второй шаг</div><div class="t">Термины — курсивом: <span class="de">Säule 3a</span>.</div></div>
        <div class="item"><div class="num">03</div><div class="h">Третий шаг</div><div class="t">Внутри текста — <b>болд того&nbsp;же цвета</b>.</div></div>
      </div>
    </div>`,

  listDash: `<div class="bg"></div><div class="pager">Список · тире</div>
    <div class="stack">
      <div class="title"><span class="t-line">Лёгкий перечень</span><span class="t-line">— это <span class="hi">тире</span></span></div>
      <div class="dash-list">
        <div class="row"><span class="d">—</span><span>Короткие пункты «бери и&nbsp;делай» без строгого порядка.</span></div>
        <div class="row"><span class="d">—</span><span>Ключевое слово — <b>болдом</b>, термины — <span class="de">курсивом</span>.</span></div>
        <div class="row"><span class="d">—</span><span>Держи пункты примерно равной длины.</span></div>
        <div class="row"><span class="d">—</span><span>4-5 пунктов — комфортный максимум.</span></div>
      </div>
    </div>`,

  listCheck: `<div class="bg"></div><div class="pager">Список · чек-лист</div>
    <div class="stack">
      <div class="title"><span class="t-line">Что сделать —</span><span class="t-line"><span class="hi">чек-лист</span></span></div>
      <div class="check-list">
        <div class="row"><span class="ck">✓</span><span>Посчитать пенсию в&nbsp;<b>калькуляторе</b>.</span></div>
        <div class="row"><span class="ck">✓</span><span>Проверить, оформлен&nbsp;ли <b>3a</b>.</span></div>
        <div class="row"><span class="ck">✓</span><span>Сравнить <b>Krankenkasse</b> с&nbsp;альтернативами.</span></div>
        <div class="row"><span class="ck">✓</span><span>Прийти на&nbsp;форум и&nbsp;<b>задать вопрос</b>.</span></div>
      </div>
    </div>`,

  /* ---- ТЕКСТ И ЦИТАТЫ ---- */
  textOne: `<div class="bg"></div><div class="pager">Текст · одна мысль</div>
    <div class="stack" style="justify-content:center;">
      <div class="title"><span class="t-line">Можно просто</span><span class="t-line">прийти и&nbsp;<span class="hi">послушать</span></span></div>
      <div class="prose">Тебе не&nbsp;нужно ни&nbsp;в&nbsp;чём признаваться — ни&nbsp;маме, ни&nbsp;подруге, ни&nbsp;юристу. <b>Сначала тихо разберись</b>, потом реши, что делать.</div>
    </div>`,

  textQuote: `<div class="bg"></div><div class="pager">Текст · цитата</div>
    <div class="stack" style="justify-content:center;">
      <div class="quote" style="font-size:60px;"><span class="qm">«</span>Не&nbsp;верь — проверь. Мы&nbsp;зовём на&nbsp;сцену не&nbsp;по&nbsp;<span class="grad">регалиям</span>, а&nbsp;по&nbsp;результату.</div>
      <div class="quote-by" style="font-size:40px;">Ксения<span>организатор форума Frankenplatz</span></div>
    </div>`,

  textMyth: `<div class="bg"></div><div class="pager">Текст · миф / правда</div>
    <div class="stack">
      <div class="title"><span class="t-line">Миф — и&nbsp;как</span><span class="t-line">на&nbsp;<span class="hi">самом деле</span></span></div>
      <div class="duo">
        <div class="block myth"><div class="lbl">Миф</div><div class="txt">«3a — для&nbsp;богатых, мне&nbsp;рано об&nbsp;этом думать».</div></div>
        <div class="block real"><div class="lbl">На самом деле</div><div class="txt"><b>Начать можно со&nbsp;100&nbsp;франков</b> — и&nbsp;уже экономить на&nbsp;налогах.</div></div>
      </div>
    </div>`,

  /* ---- ТАБЛИЦА ---- */
  tableCmp: `<div class="bg"></div><div class="pager">Таблица · сравнение</div>
    <div class="stack">
      <div class="title"><span class="t-line">Сравнение —</span><span class="t-line">это <span class="hi">таблица</span></span></div>
      <table class="tbl">
        <thead><tr><th>Параметр</th><th>VIAC</th><th>Банк</th></tr></thead>
        <tbody>
          <tr><th>Комиссия</th><td class="mark">0.44%</td><td>1.2%+</td></tr>
          <tr><th>Минимум</th><td class="mark">нет</td><td class="red">10 000</td></tr>
          <tr><th>Доступ</th><td class="mark">онлайн</td><td>офис</td></tr>
        </tbody>
      </table>
    </div>`,

  tableVs: `<div class="bg"></div><div class="pager">Таблица · против</div>
    <div class="stack">
      <div class="title"><span class="t-line">Кто <span class="hi">выгоднее</span>?</span></div>
      <div class="vs">
        <div class="vcard win">
          <div class="vh">VIAC</div>
          <div class="vrow" style="border-top:none;"><span>Комиссия</span><b>0.44%</b></div>
          <div class="vrow"><span>Минимум</span><b>нет</b></div>
          <div class="vrow"><span>Доступ</span><b>онлайн</b></div>
        </div>
        <div class="vcard">
          <div class="vh">Банк</div>
          <div class="vrow" style="border-top:none;"><span>Комиссия</span><span class="bad">1.2%+</span></div>
          <div class="vrow"><span>Минимум</span><span class="bad">10 000</span></div>
          <div class="vrow"><span>Доступ</span><span>офис</span></div>
        </div>
      </div>
    </div>`,

  /* ---- ФИНАЛ ---- */
  finalIdea: `<div class="bg"></div><div class="pager">Финал · мысль</div>
    <div class="stack">
      <div class="concl"><span class="c-line">Пенсия — это</span><span class="c-line">не&nbsp;«потом».</span><span class="c-line">Это <span class="grad">сейчас</span>.</span></div>
      <div class="concl-desc">Знать направление — уже половина успеха. Посчитай в&nbsp;<b>калькуляторе на&nbsp;сайте</b>.</div>
    </div>`,

  finalSave: `<div class="bg"></div><div class="pager">Финал · сохрани</div>
    <div class="stack">
      <div class="concl"><span class="c-line">Сохрани, чтобы</span><span class="c-line">не&nbsp;<span class="grad">потерять</span></span></div>
      <div class="concl-desc">Этот разбор пригодится не&nbsp;раз. <b>Жми на&nbsp;закладку прямо сейчас:</b></div>
      <div class="act-row">
        <span class="act"><span class="ic">🔖</span> Сохрани</span>
        <span class="act"><span class="ic">📤</span> Поделись</span>
        <span class="act"><span class="ic">🔔</span> Подпишись</span>
      </div>
    </div>`,

  finalComment: `<div class="bg"></div><div class="pager">Финал · комментарий</div>
    <div class="stack" style="justify-content:center;">
      <div class="concl"><span class="c-line">Напиши слово</span><span class="c-line"><span class="hi">«пенсия»</span></span></div>
      <div class="concl-desc">— в&nbsp;комментариях, и&nbsp;мы&nbsp;пришлём тебе <b>калькулятор</b> первым.</div>
    </div>
    <div class="cta corner">Считай на сайте <span class="arrow">→</span></div>`,
};

window.FP_CATS = [
  { id:'cover',  name:'Обложки',        slides:[F.coverMark, F.coverQ, F.coverTop, F.coverQuote, F.coverMini] },
  { id:'stat',   name:'Статистика',     slides:[F.statBig, F.statTrio, F.statBA, F.statOne] },
  { id:'chart',  name:'Диаграммы',      slides:[F.chartV, F.chartH, F.chartTL, F.chartPie] },
  { id:'list',   name:'Списки',         slides:[F.listDots, F.listNum, F.listDash, F.listCheck] },
  { id:'text',   name:'Текст и цитаты', slides:[F.textOne, F.textQuote, F.textMyth] },
  { id:'table',  name:'Таблицы',        slides:[F.tableCmp, F.tableVs] },
  { id:'final',  name:'Финал',          slides:[F.finalIdea, F.finalSave, F.finalComment] },
];

window.FP_FOOTER = `<div class="footer"><span class="site"><svg class="fl" viewBox="0 0 24 24"><rect class="sq" width="24" height="24" rx="5"/><rect class="cx" x="10" y="5" width="4" height="14"/><rect class="cx" x="5" y="10" width="14" height="4"/></svg><span class="ftxt"><span class="fname">frankenplatz.ch</span><span class="reg">форум о деньгах в Швейцарии</span></span></span></div>`;

/* ===== СКЕЛЕТ ПОСТА (по умолчанию, для пустого каркаса) =====
   Каждый элемент: { cat:'<id категории>', variant:<индекс варианта> }.
   Порядок = порядок слайдов в карусели. Меняется в панели «Структура». */
window.FP_POST = [
  { cat:'cover', variant:0 },
  { cat:'stat',  variant:0 },
  { cat:'list',  variant:0 },
  { cat:'chart', variant:0 },
  { cat:'text',  variant:1 },
  { cat:'final', variant:1 },
];

/* ===== ОБЛОЖКА ДЛЯ TELEGRAM — единая картинка, без пейджера/футера ===== */
window.FP_COVER = `<div class="bg"></div>
  <div class="cover-brand"><svg class="fl" viewBox="0 0 24 24"><rect class="sq" width="24" height="24" rx="5"/><rect class="cx" x="10" y="5" width="4" height="14"/><rect class="cx" x="5" y="10" width="14" height="4"/></svg> frankenplatz.ch</div>
  <div class="stack" style="justify-content:center;">
    <div class="title-cover"><span class="line">Заголовок</span><span class="line">поста —</span><span class="line"><span class="grad">крупно</span></span></div>
    <div class="lead">Короткий подзаголовок, который частично раскрывает суть поста. Пришли текст — впишу сюда.</div>
  </div>`;
