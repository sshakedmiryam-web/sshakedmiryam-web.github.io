(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const grid=document.querySelector('#project-grid'),stage=document.querySelector('.work-exhibition');
 const dots=document.querySelector('.exhibition-dots'),counter=document.querySelector('.exhibition-count');
 let cards=[],position=0,target=0,lastIndex=-1,frame=0,lastTime=0,visible=false;
 let pointer={x:-1000,y:-1000},edge=0,drag=null,dragged=false,details=null;
 let detailCards=[],detailPosition=0,detailTarget=0,detailIndex=-1,detailEdge=0,detailDrag=null,detailDragged=false;
 const mod=(n,d)=>((n%d)+d)%d;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const spacing=()=>innerWidth<700?210:innerWidth>1600?310:282;
 const detailSpacing=()=>innerWidth<700?157:207;
 function rebuild(){
  cards=[...grid.querySelectorAll('.project-card')];position=target=0;lastIndex=-1;drag=null;edge=0;
  dots.replaceChildren(...cards.map((card,index)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','לפרויקט '+card.querySelector('h3').textContent);b.addEventListener('click',()=>{const current=mod(target,cards.length);let delta=index-current;if(delta>cards.length/2)delta-=cards.length;if(delta<-cards.length/2)delta+=cards.length;target+=delta;wake();});return b;}));
  paint(performance.now());wake();
 }
 function paint(time){
  const n=cards.length;if(!n)return;
  const active=mod(Math.round(position),n),step=spacing();
  const stageRect=grid.getBoundingClientRect();
  const scrollDepth=clamp((innerHeight*.5-(stageRect.top+stageRect.height*.5))/innerHeight,-1,1);
  cards.forEach((card,i)=>{
   let delta=mod(i-position+n/2,n)-n/2;
   // At two results, keep the second card on the side from which it approaches.
   if(n===2&&Math.abs(delta+1)<.001)delta=1;
   const distance=Math.abs(delta),shown=distance<2.8;
   const float=reduced.matches?0:Math.sin(time*.0011+i*.65)*4;
   card.style.setProperty('--card-x',(delta*-step).toFixed(2)+'px');
   card.style.setProperty('--card-y',(distance*8+float+scrollDepth*13).toFixed(2)+'px');
   card.style.setProperty('--card-z',(60-Math.pow(distance,1.3)*140).toFixed(2)+'px');
   card.style.setProperty('--card-rotate',clamp(delta*35,-65,65).toFixed(2)+'deg');
   card.style.setProperty('--card-roll',clamp(-delta*1.5,-4,4).toFixed(2)+'deg');
   card.style.setProperty('--card-opacity',shown?clamp(1-Math.max(0,distance-1.2)*.42,.1,1).toFixed(3):'0');
   card.style.setProperty('--card-order',Math.round(100-distance*20));
   card.style.pointerEvents=shown?'auto':'none';card.style.visibility=shown?'visible':'hidden';
   card.classList.toggle('active',i===active);card.tabIndex=i===active?0:-1;
   card.setAttribute('aria-hidden',String(!shown));
   if(i===active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
  });
  if(active!==lastIndex){lastIndex=active;counter.textContent=String(active+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');[...dots.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));}
 }
 function horizontalEdge(rect,neutralWidth){
  if(!fine.matches||reduced.matches||document.hidden||document.querySelector('#lightbox').open||pointer.y<rect.top||pointer.y>rect.bottom||rect.bottom<0||rect.top>innerHeight)return 0;
  const center=rect.left+rect.width/2,half=neutralWidth/2;
  const left=center-half,right=center+half;
  // The side cards are the hover zones; the central work remains a quiet zone.
  if(pointer.x<left&&pointer.x>=0)return-clamp(.22+(left-pointer.x)/Math.max(left-rect.left,1)*.6,.22,.85);
  if(pointer.x>right&&pointer.x<=innerWidth)return clamp(.22+(pointer.x-right)/Math.max(rect.right-right,1)*.6,.22,.85);
  return 0;
 }
 function tick(now){
  frame=0;const dt=Math.min(now-(lastTime||now),100);lastTime=now;
  if(visible&&!document.querySelector('#home').hidden){
   const nextEdge=drag?0:horizontalEdge(grid.getBoundingClientRect(),Math.min(grid.clientWidth*.52,(cards[0]?.offsetWidth||336)*1.08));
   if(edge&&!nextEdge&&!drag)target=Math.round(target);
   edge=nextEdge;stage.dataset.edge=edge<0?'left':edge>0?'right':'';
   if(edge)target-=edge*dt*.0016;
   if(Math.abs(target)>10000){const turns=Math.trunc(target/cards.length)*cards.length;target-=turns;position-=turns;}
   position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt*.013));
   if(Math.abs(target-position)<.0008)position=target;
   paint(now);
  }
  let detailsMoving=false;
  if(details?.isConnected){
   const rect=details.getBoundingClientRect(),inView=rect.bottom>0&&rect.top<innerHeight;
   const e=detailDrag?0:horizontalEdge(rect,Math.min(rect.width*.52,(detailCards[0]?.offsetWidth||250)*1.08));
   if(detailEdge&&!e&&!detailDrag)detailTarget=Math.round(detailTarget);
   detailEdge=e;details.dataset.edge=e<0?'left':e>0?'right':'';
   if(e)detailTarget-=e*dt*.0014;
   if(Math.abs(detailTarget)>10000){const turns=Math.trunc(detailTarget/detailCards.length)*detailCards.length;detailTarget-=turns;detailPosition-=turns;}
   detailPosition=reduced.matches?detailTarget:detailPosition+(detailTarget-detailPosition)*(1-Math.exp(-dt*.013));
   if(Math.abs(detailTarget-detailPosition)<.0008)detailPosition=detailTarget;
   paintDetails(now);
   detailsMoving=inView&&!document.hidden&&(!reduced.matches||Math.abs(detailTarget-detailPosition)>.001);
  }
  if((visible&&!document.querySelector('#home').hidden&&!document.hidden&&(!reduced.matches||Math.abs(target-position)>.001))||detailsMoving)frame=requestAnimationFrame(tick);
 }
 function wake(){if(!frame){lastTime=0;frame=requestAnimationFrame(tick);}}
 document.querySelectorAll('[data-showcase]').forEach(b=>b.addEventListener('click',()=>{target=Math.round(target)+(b.dataset.showcase==='next'?1:-1);wake();}));
 grid.addEventListener('portfolio:render',rebuild);
 grid.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')target+=-mod(Math.round(target),cards.length);else if(e.key==='End')target+=cards.length-1-mod(Math.round(target),cards.length);else target=Math.round(target)+(e.key==='ArrowLeft'?1:-1);wake();});
 grid.addEventListener('wheel',e=>{const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)*.7?e.deltaX:e.shiftKey?e.deltaY:0;if(!delta)return;e.preventDefault();target+=delta/450;wake();},{passive:false});
 grid.addEventListener('dragstart',e=>e.preventDefault());
 grid.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,start:e.clientX,target,moved:false};dragged=false;});
 window.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const delta=drag.start-e.clientX;if(Math.abs(delta)>8&&!drag.moved){drag.moved=true;grid.setPointerCapture(e.pointerId);}if(drag.moved){grid.classList.add('dragging');target=drag.target+delta/spacing();wake();}});
 const endDrag=()=>{if(!drag)return;dragged=drag.moved;if(grid.hasPointerCapture(drag.id))grid.releasePointerCapture(drag.id);if(drag.moved){target=Math.round(target);wake();}drag=null;grid.classList.remove('dragging');};
 window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);
 grid.addEventListener('click',e=>{const card=e.target.closest('.project-card');if(!card)return;if(dragged){e.preventDefault();dragged=false;return;}const index=cards.indexOf(card),active=mod(Math.round(target),cards.length);if(index!==active){e.preventDefault();let d=index-mod(target,cards.length);if(d>cards.length/2)d-=cards.length;if(d<-cards.length/2)d+=cards.length;target+=d;wake();}},true);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{edge=0;stage.dataset.edge='';}},{threshold:.02}).observe(grid);
 function paintDetails(time){
  const n=detailCards.length;if(!details||!n)return;const active=mod(Math.round(detailPosition),n);
  detailCards.forEach((card,i)=>{let d=mod(i-detailPosition+n/2,n)-n/2;if(n===2&&Math.abs(d+1)<.001)d=1;const distance=Math.abs(d),shown=distance<2.8;
   card.style.setProperty('--detail-x',(d*-detailSpacing()).toFixed(2)+'px');
   card.style.setProperty('--detail-y',(distance*5+(reduced.matches?0:Math.sin(time*.0011+i)*3)).toFixed(2)+'px');
   card.style.setProperty('--detail-z',(35-Math.pow(distance,1.3)*105).toFixed(2)+'px');
   card.style.setProperty('--detail-rotate',clamp(d*32,-62,62).toFixed(2)+'deg');
   card.style.setProperty('--detail-roll',clamp(-d,-3,3).toFixed(2)+'deg');
   card.style.setProperty('--detail-opacity',shown?clamp(1-Math.max(0,distance-1.2)*.35,.2,1).toFixed(3):'0');
   card.style.setProperty('--detail-order',Math.round(100-distance*20));card.style.pointerEvents=shown?'auto':'none';card.style.visibility=shown?'visible':'hidden';card.classList.toggle('active',i===active);card.setAttribute('aria-hidden',String(!shown));card.querySelector('button').tabIndex=i===active?0:-1;
  });
  if(detailIndex!==active){detailIndex=active;const count=document.querySelector('.detail-count');if(count)count.textContent=String(active+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');}
 }
 function moveDetail(index){const n=detailCards.length;let d=index-mod(detailTarget,n);if(d>n/2)d-=n;if(d<-n/2)d+=n;detailTarget+=d;wake();}
 function attachDetails(){
  details=document.querySelector('.gallery-track');detailCards=details?[...details.querySelectorAll('.gallery-item')]:[];detailPosition=detailTarget=0;detailIndex=-1;detailEdge=0;detailDrag=null;detailDragged=false;
  if(details){const track=details;
   document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{detailTarget=Math.round(detailTarget)+(b.dataset.gallery==='left'?1:-1);wake();}));
   track.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')moveDetail(0);else if(e.key==='End')moveDetail(detailCards.length-1);else{detailTarget=Math.round(detailTarget)+(e.key==='ArrowLeft'?1:-1);wake();}});
   track.addEventListener('wheel',e=>{const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)*.7?e.deltaX:e.shiftKey?e.deltaY:0;if(!d)return;e.preventDefault();detailTarget+=d/350;wake();},{passive:false});
   track.addEventListener('dragstart',e=>e.preventDefault());
   track.addEventListener('pointerdown',e=>{if(e.button===0){detailDrag={id:e.pointerId,start:e.clientX,target:detailTarget,moved:false,track};detailDragged=false;}});
   track.addEventListener('click',e=>{const card=e.target.closest('.gallery-item');if(!card)return;if(detailDragged){e.preventDefault();e.stopPropagation();detailDragged=false;return;}const index=detailCards.indexOf(card);if(index!==mod(Math.round(detailTarget),detailCards.length)){e.preventDefault();e.stopPropagation();moveDetail(index);}},true);
   paintDetails(performance.now());
  }wake();
 }
 window.addEventListener('pointermove',e=>{if(!detailDrag||e.pointerId!==detailDrag.id)return;const d=detailDrag.start-e.clientX;if(Math.abs(d)>8&&!detailDrag.moved){detailDrag.moved=true;detailDrag.track.setPointerCapture(e.pointerId);}if(detailDrag.moved){detailDrag.track.classList.add('dragging');detailTarget=detailDrag.target+d/detailSpacing();wake();}});
 function endDetailDrag(){if(!detailDrag)return;detailDragged=detailDrag.moved;if(detailDrag.track.hasPointerCapture(detailDrag.id))detailDrag.track.releasePointerCapture(detailDrag.id);if(detailDrag.moved){detailTarget=Math.round(detailTarget);wake();}detailDrag.track.classList.remove('dragging');detailDrag=null;}
 window.addEventListener('pointerup',endDetailDrag);window.addEventListener('pointercancel',endDetailDrag);
 new MutationObserver(attachDetails).observe(document.querySelector('#case'),{childList:true});
 attachDetails();
 window.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;if(visible||details)wake();},{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;edge=0;target=Math.round(target);detailTarget=Math.round(detailTarget);stage.dataset.edge='';if(details)details.dataset.edge='';});
 window.addEventListener('blur',()=>{pointer.x=-1000;pointer.y=-1000;edge=0;if(details)details.dataset.edge='';endDrag();endDetailDrag();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){edge=0;pointer.x=-1000;}else wake();});
 window.addEventListener('resize',()=>{paint(performance.now());paintDetails(performance.now());wake();},{passive:true});
 reduced.addEventListener('change',wake);
 // Page scrolling changes the depth of the hero without taking over page scrolling.
 let scrollQueued=false;
 const hero=document.querySelector('.hero');
 function scrollScene(){scrollQueued=false;hero.style.setProperty('--hero-scroll',clamp(scrollY/(hero.offsetHeight||1),0,1).toFixed(3));}
 window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(scrollScene);}if(details)wake();},{passive:true});scrollScene();
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target);}}),{threshold:.12});
 document.querySelectorAll('.perspective-grid,.closing>p').forEach(el=>{el.classList.add('scene-reveal');reveal.observe(el);});
 // A small pool of glass stars: transient, never replacing the native cursor.
 const sparkRoot=document.querySelector('#cursor-stars');
 const sparks=Array.from({length:14},()=>{const el=document.createElement('span');el.className='cursor-spark';sparkRoot.append(el);return el;});
 let starIndex=0,starTime=0,lastX=0,lastY=0;
 window.addEventListener('pointermove',e=>{
  if(!fine.matches||reduced.matches||e.pointerType==='touch')return;
  const tx=e.clientX,ty=e.clientY;
  const now=performance.now();if(now-starTime<65||Math.hypot(tx-lastX,ty-lastY)<12)return;
  starTime=now;lastX=tx;lastY=ty;const star=sparks[starIndex++%sparks.length];star.getAnimations().forEach(a=>a.cancel());
  const coding=document.body.dataset.area==='code';star.classList.toggle('code-spark',coding);star.textContent=coding?['</>','{ }','=>','();','[ ]','&&'][starIndex%6]:'';const size=12+(starIndex%4)*5,dx=Math.sin(starIndex*2.4)*23,dy=Math.cos(starIndex*1.8)*19;
  star.style.setProperty('--spark-size',size+'px');star.animate([{transform:`translate(${tx+dx}px,${ty+dy}px) rotate(0deg) scale(.4)`,opacity:0},{transform:`translate(${tx+dx}px,${ty+dy-4}px) rotate(15deg) scale(1)`,opacity:.85,offset:.22},{transform:`translate(${tx+dx*.65}px,${ty+dy-25}px) rotate(65deg) scale(.25)`,opacity:0}],{duration:650,easing:'ease-out',fill:'none'});
 },{passive:true});
 const hideCursor=()=>{sparks.forEach(s=>s.getAnimations().forEach(a=>a.cancel()));};
 document.documentElement.addEventListener('pointerleave',hideCursor);window.addEventListener('blur',hideCursor);reduced.addEventListener('change',hideCursor);
 rebuild();
})();

