(() => {
 'use strict';
 const body=document.body,zone=document.querySelector('#code');
 const description=document.querySelector('#hero-description'),designDescription=description.innerHTML;
 function area(value){
  const code=value==='code';body.dataset.area=code?'code':'design';zone.hidden=!code;
  document.querySelectorAll('.header-link,.hero-bottom a,.skip').forEach(link=>link.href=code?'#code':'#work');
  document.querySelectorAll('[data-area-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.areaChoice===value)));
  document.querySelector('.round-link').href=code?'#code':'#work';document.querySelector('.hero-action-label').textContent=code?'לגלות את הקוד':'להיכנס לעולם שלי';
  description.innerHTML=code?'פרויקטים שכתבתי, מהקוד ועד החוויה.<br>מקום לרעיונות שבניתי בעצמי.':designDescription;
  const link=document.querySelector('.header nav a:first-child');link.href=code?'#code':'#work';link.textContent=code?'פרויקטי קוד':'העבודות';
 }
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let switching=false;
 async function switchArea(value){
  if(switching)return;
  const next=value==='code'?'code':'design',hash=next==='code'?'#code-hero':'#design-hero';
  const update=()=>{
   area(next);
   // Update the route without hashchange handlers competing over the scroll position.
   if(location.hash!==hash)history.pushState(null,'',hash);
   window.scrollTo({top:0,behavior:'instant'});
  };
  if(body.dataset.area===next||reducedMotion.matches){update();return;}
  switching=true;body.dataset.areaTransition='active';
  let veil;
  try{
   if(document.startViewTransition){
    const transition=document.startViewTransition(update);
    await transition.finished;
   }else{
    veil=document.createElement('div');veil.className='area-transition-veil';veil.setAttribute('aria-hidden','true');
    veil.style.background=next==='code'?'#590018':'#f7f1e8';body.append(veil);
    await veil.animate([{opacity:0},{opacity:1}],{duration:200,easing:'ease-in-out',fill:'forwards'}).finished;
    update();
    await veil.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease-out',fill:'forwards'}).finished;
   }
  }catch{
   update();
  }finally{
   veil?.remove();delete body.dataset.areaTransition;switching=false;
  }
 }
 function preview(value){body.dataset.preview=value;document.querySelectorAll('[data-preview-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewChoice===value)));}
 function layers(value){body.dataset.layers=value;document.querySelector('.layer-toggle').setAttribute('aria-pressed',String(value==='on'));}
 function save(){try{localStorage.setItem('shaked-studio-view',JSON.stringify({preview:body.dataset.preview,layers:body.dataset.layers}));}catch{}}
 try{const p=JSON.parse(localStorage.getItem('shaked-studio-view')||'null');if(p){if(['studio','original'].includes(p.preview))preview(p.preview);if(['on','off'].includes(p.layers))layers(p.layers);}}catch{}
 document.querySelectorAll('[data-area-choice]').forEach(b=>b.addEventListener('click',()=>switchArea(b.dataset.areaChoice)));
 document.querySelectorAll('[data-preview-choice]').forEach(b=>b.addEventListener('click',()=>{preview(b.dataset.previewChoice);save();}));
 document.querySelector('.layer-toggle').addEventListener('click',()=>{layers(body.dataset.layers==='on'?'off':'on');save();});
 function hashArea(){if(['#code','#code-hero'].includes(location.hash))area('code');else if(['#work','#perspective','#project-grid','#design-hero'].includes(location.hash)||location.hash.startsWith('#project/'))area('design');if(['#code-hero','#design-hero'].includes(location.hash))requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));else if(['#code','#work','#perspective','#project-grid'].includes(location.hash))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));}
 window.addEventListener('hashchange',hashArea);hashArea();
 // Local source previews use textContent; imported code is never executed.
 const picker=document.querySelector('#code-files'),drop=document.querySelector('#code-drop');
 const importControl=document.querySelector('.code-import');importControl.setAttribute('role','button');importControl.tabIndex=0;importControl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();picker.click();}});
 const list=document.querySelector('.code-file-list'),status=document.querySelector('#code-status');
 let files=[],readVersion=0;
 const types=new Set(['js','jsx','ts','tsx','html','css','scss','json','py','md','txt','sql','java','c','cpp','h','cs','go','rs','vue','svelte','php','rb','yaml','yml','xml','sh']);
 async function openFiles(incoming){
  const version=++readVersion,accepted=[...incoming].filter(f=>types.has(f.name.split('.').pop().toLowerCase())&&f.size<=2*1024*1024).slice(0,30);
  if(!accepted.length){status.textContent='בחרו קבצי קוד או טקסט, עד 2MB לקובץ.';return;}
  const loaded=await Promise.all(accepted.map(async file=>({name:file.name,text:await file.text()})));if(version!==readVersion)return;files=loaded;
  list.replaceChildren(...files.map((f,i)=>{const b=document.createElement('button');b.type='button';b.textContent=f.name;b.dir='ltr';b.addEventListener('click',()=>show(i));return b;}));
  document.querySelector('.code-editor').hidden=false;drop.classList.add('has-files');status.textContent=`${files.length} קבצים נפתחו בתצוגה מקדימה מקומית. הם לא פורסמו באתר.`;show(0);
 }
 function show(index){const f=files[index];document.querySelector('#code-source').textContent=f.text;document.querySelector('#code-file-name').textContent=f.name;document.querySelector('#code-file-info').textContent=f.text.split('\n').length+' שורות';[...list.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 picker.addEventListener('change',()=>openFiles(picker.files).catch(()=>{status.textContent='לא ניתן לקרוא את הקובץ. נסו לבחור אותו שוב.';}));
 ['dragenter','dragover'].forEach(event=>drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add('drag-over');}));
 ['dragleave','drop'].forEach(event=>drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove('drag-over');}));
 drop.addEventListener('drop',e=>openFiles(e.dataTransfer.files).catch(()=>{status.textContent='לא ניתן לקרוא את הקבצים.';}));
})();

