/* Frankenplatz — компактные карточки спикеров для мобилки (≤480px).
   Слева фото-прямоугольник, справа имя и должность; ниже — короткая тема крупно
   и кнопка «Подробнее», раскрывающая полное название доклада и описание.
   Экспорт: window.FPSpeakerBits.SpeakerRows. Данные: site/speakers-data.js. */
(() => {
  function Row({ s, showDay }) {
    return (
      <div className="spk-row" role="listitem">
        <span className={"spk-row__ph spk-row__ph--" + (s.tone || "gold")} aria-hidden="true">
          {s.img ? <img src={s.img} alt="" /> : s.ini}
        </span>
        <span className="spk-row__who">
          <span className="spk-row__name">{s.name}</span>
          <span className="spk-row__role">{s.role}</span>
          {showDay ? <span className="spk-row__day">День {s.day} · {s.theme}</span> : null}
          <span className="spk-row__topic">{s.short || s.topic}</span>
        </span>
        <p className="spk-row__about">{s.about}{s.link ? <a href={s.link} target="_blank" rel="noopener" style={{ marginLeft: 6 }}>{s.linkLabel || "Ссылка"}</a> : null}</p>
      </div>
    );
  }
  function FlipCard({ s }) {
    const [on, setOn] = React.useState(false);
    return (
      <div className={"fsc" + (on ? " is-flip" : "")} onClick={() => setOn(!on)} role="button" tabIndex={0} aria-label={s.name + " — досье спикера"}>
        <div className="fsc__in">
          <div className="fsc__face fsc__front">
            <div className={"fsc__photo fsc__photo--" + (s.tone || "gold")}>
              {s.img ? <img src={s.img} alt={s.name} /> : <span className="fsc__ini" aria-hidden="true">{s.ini}</span>}
            </div>
            <span className="fsc__day">День №{s.day}</span>
            <span className="fsc__flip" aria-hidden="true">⟲</span>
            <div className="fsc__scrim">
              <h3 className="fsc__name">{s.name}</h3>
              <p className="fsc__role">{s.role}</p>
              <span className="fsc__hint">Досье спикера</span>
            </div>
          </div>
          <div className="fsc__face fsc__back">
            <span className="fsc__eyebrow">Досье спикера</span>
            <h3 className="fsc__name">{s.name}</h3>
            <p className="fsc__role">{s.role}</p>
            {s.dossier && s.dossier.length ? (
              <ul className="fsc__facts">{s.dossier.map((f, i) => <li key={i}>{f}</li>)}</ul>
            ) : null}
            <p className="fsc__about">{s.about}</p>
            {s.link ? <a className="fsc__more" href={s.link} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>{s.linkLabel || "Узнать больше"} →</a> : null}
          </div>
        </div>
      </div>
    );
  }
  function SpeakerRows({ speakers, showDay }) {
    const list = speakers || window.FP_SPEAKERS || [];
    return (
      <div className="spk-rows" role="list">
        {list.map((s) => <Row s={s} showDay={showDay} key={s.id} />)}
      </div>
    );
  }
  function SpeakerDayBlock() {
    const [day, setDay] = React.useState(1);
    
    return (
      <div>
        <div className="spk-daysw" role="tablist">
          <button type="button" role="tab" aria-selected={day === 1}
                  className={"spk-daysw__tab" + (day === 1 ? " is-on" : "")}
                  onClick={() => setDay(1)}>День №1</button>
          <button type="button" role="tab" aria-selected={day === 2}
                  className={"spk-daysw__tab spk-daysw__tab--d2" + (day === 2 ? " is-on" : "")}
                  onClick={() => setDay(2)}>День №2</button>
        </div>
        <div className="spk-daysw__panel">
        <div className="spk-desk">
          <div className="grid gauto" style={{ marginTop: 8 }}>
            {(window.FP_SPEAKERS || []).filter((s) => s.day === day).map((s) => (
              <FlipCard key={s.id} s={s} />
            ))}
          </div>
        </div>
        <div className="spk-mob">
          <SpeakerRows speakers={(window.FP_SPEAKERS || []).filter((s) => s.day === day)} />
        </div>
        </div>
      </div>
    );
  }
  function SpeakerStrip({ speakers }) {
    const list = speakers || window.FP_SPEAKERS || [];
    const ref = React.useRef(null);
    const step = (dir) => {
      const el = ref.current; if (!el) return;
      const card = el.querySelector(".spk-slide");
      const w = card ? card.getBoundingClientRect().width + 18 : 340;
      el.scrollBy({ left: dir * w * 2, behavior: "smooth" });
    };
    return (
      <div className="spk-strip">
        <div className="spk-strip__rail" ref={ref} role="list">
          {list.map((s) => (
            <article className="spk-slide spk-slide--flip" role="listitem" key={s.id}>
              <FlipCard s={s} />
            </article>
          ))}
        </div>
        <div className="spk-strip__nav" aria-hidden="true">
          <button type="button" className="spk-strip__btn" onClick={() => step(-1)} aria-label="Назад">←</button>
          <button type="button" className="spk-strip__btn" onClick={() => step(1)} aria-label="Вперёд">→</button>
        </div>
      </div>
    );
  }
  window.FPSpeakerBits = { SpeakerRows, SpeakerDayBlock, SpeakerStrip, FlipCard };
})();
