(() => {
 'use strict';
 // Brand ads remain in the source materials; they contain the logo withheld by request.
 const projects=window.PORTFOLIO.filter(p=>p.id!=='campaign');
 Object.assign(projects.find(p=>p.id==='visuals'),{name:'יום בחיי היצירה',en:'CHARACTER & MOTION',video:'visuals',intro:'דמות מאוירת שמלווה יום של יצירה: מול המחשב, בתנועה וברגע של מחשבה. סדרת איורים וסרטון מתוך חומרי ההנפשה.',essence:'לשדר יצירתיות, נגישות ואישיות. דמות עקבית, צבעוניות רכה וסביבה ביתית מחברות את הצופה לעולם העבודה של היוצרת.',approach:'שפה איורית עקבית בין תנוחות וסצנות שונות, עם תשומת לב למבט, למחווה ולסביבה.',audience:'מותגים ויוצרות תוכן שמחפשים דמות מזוהה לשילוב בתוכן דיגיטלי.',highlights:['דמות עם אופי','המחווה מספרת סיפור','סביבה שמלווה את היצירה']});
 const home=document.querySelector('#home'),casePage=document.querySelector('#case'),grid=document.querySelector('#project-grid');
 const dialog=document.querySelector('#lightbox'),lightImage=document.querySelector('#lightbox-image');
 let currentFilter='all',lastFocus=null,homeScroll=0;
 const image=p=>p.image||`${p.id}-cover.webp`;
 const full=p=>p.image||`${p.id}-full.webp`;
 const bar='<div class="window-bar"><span></span><span></span><span></span></div>';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function renderGrid(filter){
  const list=projects.filter(p=>filter==='all'||p.category===filter);
  grid.innerHTML=list.map((p,i)=>`<a class="project-card enter" href="#project/${p.id}" aria-label="לצפייה בפרויקט ${esc(p.name)}" style="animation-delay:${Math.min(i*40,200)}ms"><div class="visual ${p.phone?'phone-visual':''} ${p.custom?'art-visual':''}"><span class="project-en" dir="ltr">${esc(p.en)}</span><div class="preview">${bar}<img src="images/${p.phone?'homeapp-full.webp':image(p)}" alt="${esc(p.name)} — ${esc(p.type)}" loading="lazy" decoding="async"></div><span class="project-open" aria-hidden="true">↖︎</span></div><div class="project-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.type)}</p></div><span class="project-num">${String(projects.indexOf(p)+1).padStart(2,'0')}</span></div></a>`).join('');
  document.querySelector('#result-count').textContent=`${list.length} פרויקטים`;
  document.querySelector('[data-filter="all"] sup').textContent=projects.length;
  grid.dispatchEvent(new CustomEvent('portfolio:render'));
 }
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderGrid(currentFilter);}));
 function caseMarkup(p){
  const gallery=p.gallery||[1,2,3].map(i=>`${p.id}-detail-${i}.webp`);
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  return `<section class="case-header"><a class="back-link" href="#work"><span>→︎</span> לכל העבודות</a><div class="case-heading-top"><span class="eyebrow">${esc(p.type)}</span><span dir="ltr">${esc(p.en)}</span></div><h1>${esc(p.name)}</h1><p class="case-line">${esc(p.line)}</p></section>
   <section class="case-layout" aria-label="עיצוב הפרויקט והסיפור שמאחוריו"><div class="case-shot-wrap"><button class="case-shot ${p.phone?'phone':''}" data-lightbox="${full(p)}" data-caption="${esc(p.name)} — התצוגה המלאה" aria-label="הגדלת התצוגה המלאה של ${esc(p.name)}"><img src="images/${full(p)}" alt="${esc(p.name)} — ${p.custom?'הדימוי המקורי':'צילום מסך מלא'}" fetchpriority="high"></button><div class="shot-label"><span>${p.custom?'הדימוי המקורי':p.id==='nursing'?'שקופית פתיחה':'התצוגה המלאה · לחצו להגדלה'}</span><span>${p.phone?'MOBILE DESIGN':'DESIGN IN DETAIL'}</span></div></div><aside class="case-story"><p>${esc(p.intro)}</p><h2>מה רצינו לשדר?</h2><p class="detail-copy">${esc(p.essence)}</p><h3>למי זה נועד?</h3><p class="detail-copy">${esc(p.audience)}</p><h3>איך זה קיבל צורה?</h3><p class="detail-copy">${esc(p.approach)}</p><div class="palette" aria-label="צבעי הפרויקט">${p.colors.map(c=>`<span style="--swatch:${c}" title="${c}"></span>`).join('')}</div>${p.note?`<p class="detail-note">${esc(p.note)}</p>`:''}</aside></section>
   <section class="gallery-section section"><div class="gallery-title"><div><h2>הפרטים שעושים הבדל.</h2><p>מבט מקרוב על הבחירות הקטנות שבונות את התמונה הגדולה.</p></div><div class="gallery-controls"><button data-gallery="right" aria-label="גלילה ימינה בגלריה">→︎</button><span class="detail-count" dir="ltr" aria-live="polite">01 / ${String(gallery.length).padStart(2,'0')}</span><button data-gallery="left" aria-label="גלילה שמאלה בגלריה">←︎</button></div></div><div class="gallery-track" tabindex="0" role="region" aria-roledescription="קרוסלת פרטי עיצוב" aria-label="גלריית פרטי העיצוב — גלילה ימינה ושמאלה">${gallery.map((entry,i)=>{const g=typeof entry==='string'?{image:entry,title:p.highlights[i%p.highlights.length]}:entry;return `<figure class="gallery-item ${p.phone?'phone-gallery':''} ${g.kind==='overview'?'overview-gallery':''}"><button data-lightbox="${g.image}" data-caption="${esc(p.name)} · ${esc(g.title)}" aria-label="הגדלת פרט: ${esc(g.title)}"><img src="images/${g.image}" alt="${esc(g.title)}" loading="lazy"></button><figcaption><span dir="ltr">${String(i+1).padStart(2,'0')}</span> / ${esc(g.title)}${g.kind==='overview'?'<small>צילום מלא · לחצו לצפייה</small>':''}</figcaption></figure>`;}).join('')}</div></section>
   ${p.slides?`<section class="section presentation-section"><div class="presentation-heading"><span class="eyebrow">הסיפור במלואו</span><h2>כל המצגת, שקופית אחר שקופית.</h2><p>14 שקופיות לפי הסדר · לחצו על כל תמונה להגדלה</p></div><div class="presentation-grid">${p.slides.map((slide,i)=>`<figure><button data-lightbox="${slide.image}" data-caption="${esc(p.name)} · ${String(i+1).padStart(2,'0')} · ${esc(slide.title)}" aria-label="הגדלת שקופית ${i+1}: ${esc(slide.title)}"><img src="images/${slide.image}" alt="שקופית ${i+1}: ${esc(slide.title)}" loading="lazy"></button><figcaption><span dir="ltr">${String(i+1).padStart(2,'0')}</span> ${esc(slide.title)}</figcaption></figure>`).join('')}</div></section>`:''}
   ${p.video?`<section class="section video-section"><span class="eyebrow">עוד זווית על הפרויקט</span><h2>כשהעיצוב מתחיל לזוז.</h2><video controls playsinline preload="none" poster="images/${image(p)}" aria-label="סרטון הפרויקט ${esc(p.name)}"><source src="media/${p.video}.mp4" type="video/mp4">הדפדפן אינו תומך בניגון וידאו.</video></section>`:''}
   <a class="next-project" href="#project/${next.id}"><div><span class="eyebrow">ממשיכים לפרויקט הבא</span><h2>${esc(next.name)}</h2></div><span class="next-arrow">↖︎</span></a>`;
 }
 function route(){
  if(dialog.open)dialog.close();
  const hash=location.hash,p=projects.find(x=>hash===`#project/${x.id}`);
  if(p){if(!home.hidden)homeScroll=window.scrollY;home.hidden=true;casePage.hidden=false;casePage.innerHTML=caseMarkup(p);document.title=`${p.name} — שקד אשתר`;window.scrollTo({top:0,behavior:'instant'});casePage.focus({preventScroll:true});wireGallery();}
  else{const wasCase=!casePage.hidden;home.hidden=false;casePage.hidden=true;casePage.innerHTML='';document.title='שקד אשתר — עיצוב אתרים, UX/UI ופיתוח';if(wasCase){const section=document.getElementById(hash==='#perspective'?'perspective':hash==='#work'?'work':'home');section?.scrollIntoView({behavior:'instant'});}else if(hash)document.getElementById(hash.slice(1))?.scrollIntoView();}
 }
 function wireGallery(){document.querySelector('.gallery-track')?.dispatchEvent(new CustomEvent('portfolio:details'));}
 document.addEventListener('click',e=>{const target=e.target.closest('[data-lightbox]');if(!target)return;lastFocus=target;lightImage.src='images/'+target.dataset.lightbox;lightImage.alt=target.dataset.caption;lightImage.classList.remove('actual-size');document.querySelector('#lightbox-title').textContent=target.dataset.caption;document.querySelector('#zoom-toggle').textContent='גודל מלא ＋';dialog.showModal();document.body.classList.add('modal-open');document.querySelector('.lightbox-scroll').scrollTop=0;});
 document.querySelector('#lightbox-close').addEventListener('click',()=>dialog.close());
 document.querySelector('#zoom-toggle').addEventListener('click',e=>{const actual=lightImage.classList.toggle('actual-size');e.currentTarget.textContent=actual?'התאמה למסך －':'גודל מלא ＋';});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus({preventScroll:true});});
 window.addEventListener('hashchange',route);renderGrid(currentFilter);route();
})();


