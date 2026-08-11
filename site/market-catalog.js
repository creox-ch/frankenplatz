/* FASHION REBORN — каталог: данные, рендер, фильтры */
(function(){
  'use strict';
  var CATS={clothes:'Одежда',shoes:'Обувь',bags:'Сумки',acc:'Аксессуары'};
  var COND={new:'Новое',ideal:'Идеальное',good:'Хорошее',fair:'Обычное'};
  var AVAIL={online:'&nbsp;',market:'Маркет · 27.09',both:'Маркет · 27.09'};
  var AVAIL_M={online:'Онлайн',market:'Маркет · 27.09',both:'Онлайн + маркет 27.09'};
  var SELLERS={
    ks:{name:'Ксения Ч.',city:'Baden',rating:4.9,since:'2024',bio:'Собираю классику: Max Mara, LV, Hermès. Все вещи из личного гардероба.'},
    an:{name:'Анна М.',city:'Zürich',rating:4.7,since:'2025',bio:'Люблю итальянские бренды и обувь. Продаю то, что перестала носить.'}
  };
  /* демо-товары: фото пришлют продавцы после модерации */
  var ITEMS=[
    {cat:'bags',brand:'Louis Vuitton',sex:'f',name:'Сумка Neverfull MM',sl:'ks',mat:'канва + кожа',col:'монограмма',size:'—',cond:'ideal',price:940,orig:1750,avail:'both',verified:true,city:'Zürich',tg:'frankenplatz',note:'Покупалась в бутике в Цюрихе, чек сохранён. Носилась два сезона, углы целые, подкладка чистая.'},
    {cat:'bags',brand:'Gucci',sex:'f',name:'Сумка Marmont small',sl:'an',mat:'кожа',col:'чёрный',size:'—',cond:'good',price:780,orig:1980,avail:'online',city:'Baden',tg:'frankenplatz'},
    {cat:'clothes',brand:'Max Mara',sex:'f',name:'Пальто, шерсть-кашемир',sl:'ks',mat:'шерсть + кашемир',col:'кэмел',size:'38 (M)',cond:'ideal',price:590,orig:1290,avail:'both',verified:true,city:'Zug',tg:'frankenplatz',note:'Классика Max Mara, надевалось несколько раз. Продаю — не подошёл размер.'},
    {cat:'clothes',brand:'Burberry',sex:'f',name:'Тренч Kensington',sl:'ks',st:'booked',mat:'хлопок габардин',col:'беж',size:'36 (S)',cond:'good',price:520,orig:1850,avail:'market',city:'Zürich',tg:'frankenplatz'},
    {cat:'shoes',brand:'Prada',sex:'f',name:'Лоферы Monolith',sl:'an',mat:'кожа',col:'чёрный',size:'39',cond:'ideal',price:430,orig:950,avail:'online',city:'Basel',tg:'frankenplatz'},
    {cat:'clothes',brand:'Moncler',sex:'f',name:'Пуховик Flammette',sl:'an',mat:'нейлон + пух',col:'чёрный',size:'S',cond:'fair',price:640,orig:1450,avail:'market',city:'Luzern',tg:'frankenplatz'},
    {cat:'acc',brand:'Hermès',sex:'u',name:'Платок Carré 90',sl:'ks',mat:'шёлк',col:'мульти',size:'90×90',cond:'new',price:360,orig:490,avail:'online',verified:true,city:'Genf',tg:'frankenplatz'},
    {cat:'clothes',brand:'Sandro',sex:'f',name:'Платье миди с поясом',sl:'an',mat:'вискоза',col:'изумруд',size:'36 (S)',cond:'new',price:150,orig:295,avail:'market',city:'Winterthur',tg:'frankenplatz'},
    {cat:'shoes',brand:'Bally',sex:'f',name:'Ботильоны кожаные',sl:'ks',mat:'кожа',col:'коньяк',size:'38',cond:'fair',price:240,orig:650,avail:'market',city:'Baden',tg:'frankenplatz'},
    {cat:'acc',brand:'Cartier',sex:'m',name:'Ремень с логотипом',sl:'an',mat:'кожа',col:'чёрный',size:'85',cond:'ideal',price:290,orig:580,avail:'online',city:'Zürich',tg:'frankenplatz'},
    {cat:'clothes',brand:'Acne Studios',sex:'u',name:'Свитер оверсайз',sl:'ks',mat:'шерсть',col:'серый',size:'M',cond:'fair',price:130,orig:320,avail:'market',city:'Bern',tg:'frankenplatz'},
    {cat:'bags',brand:'Longchamp',sex:'u',name:'Le Pliage L',sl:'ks',mat:'нейлон + кожа',col:'тёмно-синий',size:'—',cond:'ideal',price:75,orig:145,avail:'online',city:'Aarau',tg:'frankenplatz'},
    {cat:'shoes',brand:'Golden Goose',sex:'f',name:'Кеды Superstar',sl:'an',mat:'кожа',col:'белый',size:'37',cond:'good',price:210,orig:495,avail:'both',city:'Zürich',tg:'frankenplatz'},
    {cat:'clothes',brand:'Jacadi',sex:'k',name:'Куртка детская',sl:'ks',mat:'хлопок + утеплитель',col:'синий',size:'116 (6 лет)',cond:'good',price:45,orig:120,avail:'market',city:'Zürich',tg:'frankenplatz'},
    {cat:'shoes',brand:'Naturino',sex:'k',name:'Ботинки детские',sl:'ks',mat:'кожа',col:'коричневый',size:'28',cond:'ideal',price:38,orig:95,avail:'online',city:'Baden',tg:'frankenplatz'},
    {cat:'acc',brand:'Chanel',sex:'f',name:'Серьги-клипсы CC',sl:'an',mat:'металл',col:'золотистый',size:'—',cond:'ideal',price:410,orig:720,avail:'online',city:'Zug',tg:'frankenplatz'},
    {cat:'bags',brand:'Hermès',sex:'f',name:'Сумка Picotin 18',sl:'ks',mat:'кожа',col:'gold',size:'—',cond:'ideal',price:2400,orig:3400,avail:'market',verified:true,city:'Baden',tg:'frankenplatz',st:'sold'},
    {cat:'clothes',brand:'Loro Piana',sex:'f',name:'Кардиган кашемировый',sl:'ks',mat:'кашемир',col:'молочный',size:'S',cond:'good',price:480,orig:1600,avail:'online',city:'Baden',tg:'frankenplatz',st:'sold'},
    {cat:'shoes',brand:'Aquazzura',sex:'f',name:'Босоножки Bel Air',sl:'an',mat:'кожа',col:'пудра',size:'38',cond:'ideal',price:260,orig:750,avail:'market',city:'Zürich',tg:'frankenplatz',st:'sold'}
  ];
  window.MC_ITEMS=ITEMS;window.MC_SELLERS=SELLERS;window.MC_DICT={CATS:CATS,COND:COND,AVAIL:AVAIL};
  function $(s,c){return (c||document).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
  var grid=$('#mcGrid'),count=$('#mcCount'),empty=$('#mcEmpty');
  if(!grid)return;
  var state={cat:'all',brand:'all',sizes:[],price:'all',sex:'all',canton:'all',avail:'all',verified:false};

  function card(it,i){
    var a=document.createElement('article');a.className='mc-card';a.setAttribute('data-i',i);a.tabIndex=0;a.setAttribute('role','button');
    a.innerHTML=
      '<div class="mc-ph'+(it.st==='booked'?' is-booked':'')+'"><span>фото · '+it.brand+' — пришлёт продавец</span>'+
      '<span class="mc-tags"><span class="mc-cond mc-cond--'+it.cond+'">'+COND[it.cond]+'</span>'+(it.verified?'<span class="mc-verif" title="Чек предоставлен продавцом">✓ Чек</span>':'')+'</span>'+
      (it.st==='booked'?'<span class="mc-stb">Бронь</span>':'')+(it.avail!=='online'?'<span class="mc-mk" title="Вещь будет на маркете 27.09">Маркет · 27.09</span>':'')+'</div>'+
      '<div class="mc-body"><p class="mc-brand">'+it.brand+'</p>'+
      '<h3 class="mc-name">'+it.name+'</h3>'+
      '<p class="mc-meta">Материал: <b>'+it.mat+'</b><br>Цвет: <b>'+it.col+'</b><br>Размер: <b>'+(it.size!=='—'?it.size:'—')+'</b></p>'+
      '<p class="mc-city">'+it.city+'</p>'+
      '<div class="mc-foot"><span class="mc-price">'+(it.orig?'<s class="mc-old">'+it.orig+'</s> ':'')+it.price+' <span>CHF</span></span></div>'+
      '<button class="mc-more'+(it.st==='booked'?' mc-more--q':'')+'" type="button">'+(it.st==='booked'?'В очередь':'Подробнее')+'</button></div>';
    return a;
  }
  function priceOk(p){
    if(state.price==='all')return true;
    if(state.price==='p1')return p<200;
    if(state.price==='p2')return p>=200&&p<=500;
    return p>500;
  }
  function sizeTags(it){
    var s=it.size||'';var t=[];
    if(it.cat==='shoes'){var n=parseFloat(s);if(n)t.push('sh'+n);return t}
    var m=s.match(/^(\d{2,3})/);if(m)t.push('eu'+m[1]);
    var l=s.match(/\((XS|S|M|L|XL|XXL|\d+\s*лет|\d+\s*год[а-я]*)\)/i);
    if(l)t.push('int'+l[1].replace(/\s/g,'').toUpperCase());
    else if(/^(XS|S|M|L|XL|XXL)$/.test(s))t.push('int'+s);
    return t;
  }
  function sizeOk(it){
    if(!state.sizes.length)return true;
    var tags=sizeTags(it);
    return state.sizes.some(function(sz){return tags.indexOf(sz)>=0});
  }
  function render(){
    grid.innerHTML='';
    var shown=ITEMS.filter(function(it){
      return it.st!=='sold'&&
             (state.cat==='all'||it.cat===state.cat)&&
             (state.brand==='all'||it.brand===state.brand)&&
             sizeOk(it)&&
             (state.canton==='all'||it.city===state.canton)&&
             (state.avail==='all'||(state.avail==='market'?(it.avail==='market'||it.avail==='both'):it.avail==='online'))&&
             (!state.verified||it.verified)&&
             (state.sex==='all'||it.sex===state.sex||(state.sex!=='k'&&it.sex==='u'))&&
             priceOk(it.price);
    });
    shown.forEach(function(it){grid.appendChild(card(it,ITEMS.indexOf(it)))});
    if(count)count.innerHTML='Показано <b>'+shown.length+'</b> из '+ITEMS.length+' вещей';
    if(empty)empty.style.display=shown.length?'none':'block';
  }

  /* чипы категорий */
  $$('#mcCats .mc-chip').forEach(function(c){
    c.addEventListener('click',function(){
      $$('#mcCats .mc-chip').forEach(function(x){x.classList.remove('is-on')});
      c.classList.add('is-on');state.cat=c.getAttribute('data-cat');var cs=$('#mcCatSel');if(cs)cs.value=state.cat;render();
    });
  });
  /* селекты: бренды собираем из данных */
  var bSel=$('#mcBrand');
  if(bSel){
    ITEMS.map(function(i){return i.brand}).filter(function(b,i,arr){return arr.indexOf(b)===i}).sort().forEach(function(b){
      var o=document.createElement('option');o.value=b;o.textContent=b;bSel.appendChild(o);
    });
    bSel.addEventListener('change',function(){state.brand=bSel.value;render()});
  }
  var xSel=$('#mcSex');if(xSel)xSel.addEventListener('change',function(){state.sex=xSel.value;render()});
  var sizePanel=$('#mcSizes');
  if(sizePanel){
    sizePanel.addEventListener('click',function(e){
      var b=e.target.closest('button[data-sz]');if(!b)return;
      b.classList.toggle('is-on');
      var v=b.getAttribute('data-sz');var i=state.sizes.indexOf(v);
      if(i>=0)state.sizes.splice(i,1);else state.sizes.push(v);
      var lbl=$('#mcSizeBtn .mc-szcount');if(lbl)lbl.textContent=state.sizes.length?' · '+state.sizes.length:'';
      render();
    });
    var sb=$('#mcSizeBtn');
    if(sb)sb.addEventListener('click',function(e){e.stopPropagation();sizePanel.classList.toggle('is-open');sb.classList.toggle('is-open')});
    document.addEventListener('click',function(e){if(sizePanel.classList.contains('is-open')&&!sizePanel.contains(e.target)&&!e.target.closest('#mcSizeBtn')){sizePanel.classList.remove('is-open');var sb2=$('#mcSizeBtn');if(sb2)sb2.classList.remove('is-open')}});
  }
  var kSel=$('#mcCanton');
  if(kSel){
    ITEMS.map(function(i){return i.city}).filter(function(b,i,arr){return arr.indexOf(b)===i}).sort().forEach(function(b){
      var o=document.createElement('option');o.value=b;o.textContent=b;kSel.appendChild(o);
    });
    kSel.addEventListener('change',function(){state.canton=kSel.value;render()});
  }
  var aSel=$('#mcAvailF');if(aSel)aSel.addEventListener('change',function(){state.avail=aSel.value;render()});
  var vChk=$('#mcVerifF');if(vChk)vChk.addEventListener('change',function(){state.verified=vChk.checked;render()});
  var clr=$('#mcClear');
  if(clr)clr.addEventListener('click',function(){
    state.cat='all';state.brand='all';state.sizes=[];state.price='all';state.sex='all';state.canton='all';state.avail='all';state.verified=false;
    $$('#mcCats .mc-chip').forEach(function(x){x.classList.toggle('is-on',x.getAttribute('data-cat')==='all')});
    var cs=$('#mcCatSel');if(cs)cs.value='all';
    ['mcSex','mcBrand','mcPrice','mcCanton','mcAvailF'].forEach(function(id){var el=$('#'+id);if(el)el.value='all'});
    if(vChk)vChk.checked=false;
    $$('#mcSizes button.is-on').forEach(function(b){b.classList.remove('is-on')});
    var lbl=$('#mcSizeBtn .mc-szcount');if(lbl)lbl.textContent='';
    render();
  });
  var pSel=$('#mcPrice');if(pSel)pSel.addEventListener('change',function(){state.price=pSel.value;render()});
  var cSel=$('#mcCatSel');
  if(cSel)cSel.addEventListener('change',function(){
    state.cat=cSel.value;
    $$('#mcCats .mc-chip').forEach(function(x){x.classList.toggle('is-on',x.getAttribute('data-cat')===cSel.value)});
    render();
  });
  var gv=$('#mcView');
  if(gv){
    var applyView=function(v){
      grid.classList.toggle('is-list',v==='list');
      $$('#mcView button').forEach(function(b){b.classList.toggle('is-on',b.getAttribute('data-view')===v)});
      try{localStorage.setItem('mcView',v)}catch(e){}
    };
    gv.addEventListener('click',function(e){var b=e.target.closest('button[data-view]');if(b)applyView(b.getAttribute('data-view'))});
    var sv;try{sv=localStorage.getItem('mcView')}catch(e){}
    if(sv==='list')applyView('list');
  }
  var ft=$('#mcFToggle');if(ft)ft.addEventListener('click',function(){ft.closest('.mc-filters').classList.toggle('is-open')});
  var fd=$('#mcFDone');if(fd)fd.addEventListener('click',function(){var f=fd.closest('.mc-filters');if(f)f.classList.remove('is-open')});
  document.addEventListener('click',function(e){var f=document.querySelector('.mc-filters.is-open');if(f&&!f.contains(e.target))f.classList.remove('is-open')});
  /* модалка товара */
  var modal=$('#mcModal');
  function openModal(it){
    if(!modal)return;
    $('#mcMPh').textContent='фото · '+it.brand+' — пришлёт продавец';
    $('#mcMBrand').textContent=it.brand;
    $('#mcMName').textContent=it.name;
    $('#mcMPrice').innerHTML=(it.orig?'<s class="mc-old">'+it.orig+' CHF</s> ':'')+it.price+' <small>CHF</small>';
    var av=$('#mcMAvail');if(av)av.innerHTML=AVAIL_M[it.avail]||'—';
    var vf=$('#mcMVerif');if(vf)vf.style.display=it.verified?'inline-flex':'none';
    $('#mcMCond').textContent=COND[it.cond];
    $('#mcMSize').textContent=it.size&&it.size!=='—'?it.size:'—';
    $('#mcMCat').textContent=CATS[it.cat];
    var mm=$('#mcMMat');if(mm)mm.textContent=it.mat||'—';
    var mc=$('#mcMCol');if(mc)mc.textContent=it.col||'—';
    $('#mcMCity').textContent=it.city;
    $('#mcMNote').textContent=it.note||'Все данные — состояние, чеки, качество — видно на фотографиях. Осталось что-то неясным — задай вопрос продавцу.';
    var sl=SELLERS[it.sl];var se=$('#mcMSeller');
    if(se&&sl){var all=ITEMS.filter(function(x){return x.sl===it.sl});var sold=all.filter(function(x){return x.st==='sold'}).length;
      /* Страницы продавца (market-seller) в репозитории нет — ссылка вела бы в 404.
   Пока показываем имя текстом; вернуть ссылку, когда страница появится. */
se.innerHTML='Продавец: <b>'+sl.name+'</b> · <span class="mc-star">★ '+sl.rating+'</span> · '+all.length+' вещей, '+sold+' продано';se.style.display='block'}
    else if(se)se.style.display='none';
    var bf=$('#mcBook');if(bf){bf.hidden=true;var ok=$('#mcBookOk');if(ok)ok.hidden=true}
    var bb=$('#mcMBook');if(bb){bb.querySelector('.t').textContent=it.st==='booked'?'Встать в очередь':'Забронировать';bb.querySelector('.s').textContent=it.st==='booked'?'если бронь сорвётся — ты следующая':'без оплаты · ни к чему не обязывает';bb.setAttribute('data-mode',it.st==='booked'?'queue':'book')}
    $('#mcMWrite').href='https://t.me/'+it.tg;
    modal.classList.add('is-open');
    document.body.style.overflow='hidden';
  }
  function closeModal(){if(!modal)return;modal.classList.remove('is-open');document.body.style.overflow=''}
  if(modal){
    modal.addEventListener('click',function(e){if(e.target.hasAttribute('data-mc-close'))closeModal()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});
  }
  grid.addEventListener('click',function(e){
    var c=e.target.closest('.mc-card');if(!c)return;
    openModal(ITEMS[+c.getAttribute('data-i')]);
  });
  grid.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var c=e.target.closest('.mc-card');if(!c)return;
    e.preventDefault();openModal(ITEMS[+c.getAttribute('data-i')]);
  });
  var bookBtn=$('#mcMBook'),offerBtn=$('#mcMOffer'),bookF=$('#mcBook');
  function showBook(mode){if(!bookF)return;bookF.hidden=false;
    $('#mcBookT').textContent=mode==='offer'?'Предложи свою цену':mode==='q'?'Вопрос продавцу':mode==='queue'?'Очередь на вещь':'Бронь на маркете · 27.09';
    $('#mcBPrice').hidden=mode!=='offer';
    if(mode==='offer')$('#mcBPrice').setAttribute('required','');else $('#mcBPrice').removeAttribute('required');
    var nt=$('#mcBNote');if(nt){nt.placeholder=mode==='q'?'Твой вопрос — замеры, состояние, чек':'Комментарий (необязательно)';if(mode==='q')nt.setAttribute('required','');else nt.removeAttribute('required')}
  }
  if(bookBtn)bookBtn.addEventListener('click',function(){showBook(bookBtn.getAttribute('data-mode')==='queue'?'queue':'book')});
  if(offerBtn)offerBtn.addEventListener('click',function(){showBook('offer')});
  var qBtn=$('#mcMAsk');if(qBtn)qBtn.addEventListener('click',function(){showBook('q')});
  /* Демо-отправка формы #mcBook УДАЛЕНА намеренно (2026-08-11).
     Она прятала поля и писала «Готово! Передали продавцу» — не отправляя ничего:
     тихая потеря заявок. Живая отправка живёт в site/forum-form.js
     (form_key='market-item'), он же добавляет согласие и honeypot.
     ⚠ При ре-синке дизайна эту строку снова вырезать. */
  render();
})();
