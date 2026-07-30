/* ============================================================
   Frankenplatz — АВТОРСКИЙ ПОСТ.
   Тема: «Посты про жизнь в Швейцарии врут — разбор бюджетов».
   Обезличенно (Пост №1/№2/№3), 7 слайдов, CTA — калькулятор бюджета.

   Модель: каждый слайд — готовый авторский дизайн (html) + необязательные
   альтернативы (alts) на выбор. Переопределяет window.FP_POST / FP_COVER.
   ============================================================ */
(function () {
  window.FP_POST = [
    /* 1 — ОБЛОЖКА */
    {
      label: 'Обложка',
      html: `<div class="bg"></div>
        <div class="stack cover">
          <div class="datacap">Бюджет · Швейцария</div>
          <div class="title-cover"><span class="line">Посты про жизнь</span><span class="line">в&nbsp;Швейцарии</span><span class="line"><span class="grad">врут</span>. Каждый</span><span class="line">по-своему.</span></div>
          <div class="lead">Разобрали три вирусных поста про бюджет — и&nbsp;<b>где в&nbsp;каждом подмена</b>.</div>
        </div>
        <div class="cta corner">Погнали <span class="arrow">→</span></div>`,
      alts: [{
        label: 'Обложка · цитата',
        html: `<div class="bg"></div>
          <div class="stack cover">
            <div class="quote" style="font-size:66px;"><span class="qm">«</span>Меня бесили эти посты про жизнь в&nbsp;Швейцарии. <span class="grad">Каждый врёт по-своему.</span></div>
            <div class="lead">Три поста, три приёма. Разбираем по&nbsp;цифрам.</div>
          </div>
          <div class="cta corner">Погнали <span class="arrow">→</span></div>`
      }]
    },

    /* 2 — ПОСТ №1: ДРАМА */
    {
      label: 'Пост №1 · Драма',
      html: `<div class="bg"></div><div class="pager">Разбор · пост №1</div>
        <div class="stack">
          <div class="title"><span class="t-line">Пост №1:</span><span class="t-line"><span class="hi-red">драма</span></span></div>
          <div class="prose">«В&nbsp;конце месяца остаётся <b>20&nbsp;франков</b>. Выжить невозможно.»</div>
          <div class="dash-list">
            <div class="row"><span class="d">—</span><span>Смешаны <b>брутто и&nbsp;нетто</b> — налоги будто вычли дважды.</span></div>
            <div class="row"><span class="d">—</span><span>Расходы <b>на&nbsp;семью</b> поданы как расходы одного человека.</span></div>
            <div class="row"><span class="d">—</span><span>В&nbsp;финале — продажа <b>воркшопа по&nbsp;Airbnb</b> (а&nbsp;это в&nbsp;CH юридически скользко).</span></div>
          </div>
          <div class="prose"><span class="red"><b>Приём:</b></span> сгустить краски, чтобы продать «спасение».</div>
        </div>`,
      alts: [{
        label: 'Миф / на самом деле',
        html: `<div class="bg"></div><div class="pager">Разбор · пост №1</div>
          <div class="stack">
            <div class="title"><span class="t-line">Пост №1: <span class="hi-red">драма</span></span></div>
            <div class="duo">
              <div class="block myth"><div class="lbl">Как подано</div><div class="txt">«Остаётся 20&nbsp;франков — в&nbsp;Швейцарии не&nbsp;выжить.»</div></div>
              <div class="block real"><div class="lbl">На самом деле</div><div class="txt">Смешаны брутто/нетто и&nbsp;семейные расходы. Цель — продать <b>воркшоп по&nbsp;Airbnb</b>.</div></div>
            </div>
          </div>`
      }]
    },

    /* 3 — ПОСТ №2: ГЛЯНЕЦ */
    {
      label: 'Пост №2 · Глянец',
      html: `<div class="bg"></div><div class="pager">Разбор · пост №2</div>
        <div class="stack">
          <div class="title"><span class="t-line">Пост №2:</span><span class="t-line"><span class="hi">глянец</span></span></div>
          <div class="prose">Медианная зарплата <b>8&nbsp;127&nbsp;CHF</b> — и&nbsp;«смотрите, как легко».</div>
          <div class="dash-list">
            <div class="row"><span class="d">—</span><span>Медиана <b>брутто</b> + расходы человека из&nbsp;<b>WG</b> = несовместимо.</span></div>
            <div class="row"><span class="d">—</span><span>SBB Halbtax 190&nbsp;CHF — это <b>годовая</b> цена и&nbsp;не&nbsp;проездной.</span></div>
            <div class="row"><span class="d">—</span><span>Нет половины расходов: <b>налоги, Serafe, страховки, отпуск</b>.</span></div>
          </div>
          <div class="prose"><span class="red"><b>Приём:</b></span> показать картинку, спрятать половину чисел.</div>
        </div>`
    },

    /* 4 — ПОСТ №3: БЛИЗКО К ПРАВДЕ */
    {
      label: 'Пост №3 · Правда',
      html: `<div class="bg"></div><div class="pager">Разбор · пост №3</div>
        <div class="stack">
          <div class="title"><span class="t-line">Пост №3:</span><span class="t-line">близко к&nbsp;<span class="hi">правде</span></span></div>
          <div class="check-list">
            <div class="row"><span class="ck">✓</span><span>Показаны <b>и&nbsp;брутто, и&nbsp;нетто</b> — честная база.</span></div>
            <div class="row"><span class="ck">✓</span><span>Реалистичная аренда <b>1-комнатки</b>, а&nbsp;не&nbsp;WG.</span></div>
            <div class="row"><span class="ck">✓</span><span>Честный остаток <b>390&nbsp;CHF</b> — без драмы и&nbsp;глянца.</span></div>
          </div>
          <div class="prose">Не&nbsp;хватает лишь <b>3a, заначки и&nbsp;строки на&nbsp;отпуск</b>.</div>
        </div>`
    },

    /* 5 — ПОЧЕМУ ЭТО ВАЖНО */
    {
      label: 'Почему важно',
      html: `<div class="bg"></div><div class="pager">Почему это важно</div>
        <div class="stack">
          <div class="title"><span class="t-line">По этим цифрам</span><span class="t-line"><span class="hi">решают жизнь</span></span></div>
          <div class="dot-list">
            <div class="row"><span class="dot"></span><span>Ехать ли <b>в&nbsp;Швейцарию</b> вообще.</span></div>
            <div class="row"><span class="dot"></span><span>Можно ли позволить <b>ребёнка</b>.</span></div>
            <div class="row"><span class="dot"></span><span>Потянут&nbsp;ли <b>ипотеку</b>.</span></div>
          </div>
          <div class="prose">Манипуляция цифрами — это <span class="hi-red">манипуляция решениями</span>.</div>
        </div>`
    },

    /* 6 — КАК СЧИТАТЬ СВОЙ БЮДЖЕТ */
    {
      label: 'Как считать',
      html: `<div class="bg"></div><div class="pager">Свой реальный бюджет</div>
        <div class="stack">
          <div class="title"><span class="t-line">Считай <span class="hi">по-честному</span></span></div>
          <div class="check-list">
            <div class="row"><span class="ck">1</span><span>Бери <b>нетто</b>, а&nbsp;не&nbsp;брутто.</span></div>
            <div class="row"><span class="ck">2</span><span>Раздели <b>фиксированные</b> и&nbsp;переменные расходы.</span></div>
            <div class="row"><span class="ck">3</span><span>Впиши скрытое: <b>Serafe, страховки, налоги</b> отдельной строкой.</span></div>
            <div class="row"><span class="ck">4</span><span>Заложи <b>3a и&nbsp;заначку</b> — это тоже расход.</span></div>
            <div class="row"><span class="ck">5</span><span>Резерв на <b>отпуск и&nbsp;непредвиденное</b>.</span></div>
          </div>
        </div>`
    },

    /* 7 — ФИНАЛ · КАЛЬКУЛЯТОР */
    {
      label: 'Финал · калькулятор',
      html: `<div class="bg"></div>
        <div class="stack">
          <div class="concl"><span class="c-line">Посчитай свой</span><span class="c-line"><span class="grad">реальный</span> расклад.</span></div>
          <div class="concl-desc">Наш калькулятор учтёт кантон, семейный статус и&nbsp;все скрытые расходы — за&nbsp;пару минут.</div>
          <div class="cta" style="background:transparent;border:2px solid var(--gold,#E6B450);color:var(--gold,#E6B450)">🧮 Калькулятор бюджета <span class="arrow">→</span></div>
          <div class="act-row" style="margin-top:40px">
            <div class="act"><span class="ic">🔖</span> Сохрани</div>
            <div class="act"><span class="ic">📤</span> Поделись</div>
          </div>
        </div>`,
      alts: [{
        label: 'Сильная мысль',
        html: `<div class="bg"></div>
          <div class="stack">
            <div class="concl"><span class="c-line">Не&nbsp;верь</span><span class="c-line">красивым постам —</span><span class="c-line"><span class="grad">посчитай сам.</span></span></div>
            <div class="concl-desc">Бесплатный калькулятор бюджета на&nbsp;сайте покажет твою реальную картину.</div>
            <div class="cta" style="background:transparent;border:2px solid var(--gold,#E6B450);color:var(--gold,#E6B450)">🧮 Открыть калькулятор <span class="arrow">→</span></div>
          </div>`
      }]
    },
  ];

  /* ОБЛОЖКА ДЛЯ TELEGRAM — единая картинка под тему поста.
     Больше сути: конкретный крючок + теги-приёмы. Футер как на инста-слайдах. */
  window.FP_COVER = `<div class="bg"></div>
    <div class="stack" style="justify-content:center;bottom:210px;">
      <div class="datacap">Бюджет · Швейцария</div>
      <div class="title-cover"><span class="line">Посты про жизнь</span><span class="line">в&nbsp;Швейцарии</span><span class="line"><span class="grad">врут</span></span></div>
      <div class="lead">Медиана <b>8&nbsp;127&nbsp;CHF</b> звучит красиво — но половину расходов в&nbsp;этих постах просто не&nbsp;показывают.</div>
      <div class="cover-tags"><span class="ct">Брутто ≠ нетто</span><span class="ct">Скрытые расходы</span><span class="ct">Реальный остаток</span></div>
    </div>` + window.FP_FOOTER;
})();
