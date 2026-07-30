/* Монета-интро: показывается один раз в сутки, длится ~1.7с */
(function () {
  try {
    var KEY = 'fp_coin_intro_day';
    var today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(KEY) === today) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { localStorage.setItem(KEY, today); return; }
    localStorage.setItem(KEY, today);
  } catch (e) { return; }

  var css = document.createElement('style');
  css.textContent = [
    '#fp-coin{position:fixed;inset:0;z-index:99999;background:radial-gradient(120% 90% at 50% 45%,#241138 0%,#140A1F 70%);display:grid;place-items:center;perspective:1200px;animation:fpCoinOut .38s cubic-bezier(.4,0,.2,1) 1.35s forwards}',
    '#fp-coin .fp-stage{width:min(38vmin,260px);aspect-ratio:1;position:relative;transform-style:preserve-3d;animation:fpCoinJump 1.35s cubic-bezier(.12,.9,.25,1) both,fpCoinSpin 1.35s cubic-bezier(.15,.75,.2,1) both,fpCoinPop .38s cubic-bezier(.4,0,.2,1) 1.35s forwards}',
    '#fp-coin .fp-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:50%;background:url("site/coin.png") center/contain no-repeat;filter:drop-shadow(0 18px 44px rgba(230,180,80,.34))}',
    '#fp-coin .fp-back{transform:rotateY(180deg) scaleX(-1)}',
    '#fp-coin .fp-shine{position:absolute;inset:0;border-radius:50%;overflow:hidden;transform:translateZ(1px);mix-blend-mode:screen;pointer-events:none}',
    '#fp-coin .fp-shine::after{content:"";position:absolute;top:-60%;left:-120%;width:60%;height:220%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);transform:rotate(18deg);animation:fpCoinShine 1.15s cubic-bezier(.3,0,.2,1) .12s 2}',
    '#fp-coin .fp-glow{position:absolute;inset:-45%;border-radius:50%;background:radial-gradient(circle,rgba(230,180,80,.34) 0%,rgba(230,180,80,0) 62%);animation:fpCoinGlow .9s ease-out .2s both;pointer-events:none}',
    '@keyframes fpCoinJump{0%{opacity:0;transform:translateY(110vh) scale(.4)}42%{opacity:1;transform:translateY(-9%) scale(1.06)}62%{transform:translateY(2%) scale(.98)}80%{transform:translateY(-2%) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}',
    '@keyframes fpCoinSpin{from{rotate:y 0deg}to{rotate:y 1080deg}}',
    '@keyframes fpCoinShine{0%{left:-120%}55%,100%{left:160%}}',
    '@keyframes fpCoinGlow{0%{opacity:0;transform:scale(.5)}45%{opacity:1}100%{opacity:.35;transform:scale(1)}}',
    '@keyframes fpCoinPop{to{transform:scale(1.35);opacity:0}}',
    '@keyframes fpCoinOut{to{opacity:0;visibility:hidden}}'
  ].join('');
  document.head.appendChild(css);

  var el = document.createElement('div');
  el.id = 'fp-coin';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="fp-stage"><div class="fp-glow"></div><div class="fp-face"></div><div class="fp-face fp-back"></div><div class="fp-shine"></div></div>';
  (document.body || document.documentElement).appendChild(el);
  setTimeout(function () { el.remove(); css.remove(); }, 1800);
})();
