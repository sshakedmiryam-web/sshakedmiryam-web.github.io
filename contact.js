(() => {
 'use strict';
 const email='sshakedmiryam@gmail.com',phone='972532420720';
 const form=document.querySelector('#contact-form'),status=document.querySelector('#contact-status');
 const emailInput=form.elements.email,phoneInput=form.elements.phone;
 function clearError(){emailInput.setCustomValidity('');status.textContent='';}
 emailInput.addEventListener('input',clearError);phoneInput.addEventListener('input',clearError);
 const directEmail=document.querySelector('#contact-email'),directWhatsApp=document.querySelector('#contact-whatsapp');
 directEmail.href='mailto:'+email;directEmail.querySelector('b').textContent=email;
 directWhatsApp.href='https://wa.me/'+phone;directWhatsApp.querySelector('b').textContent='053-242-0720';
 function message(){const data=new FormData(form);return ['היי שקד, אשמח לדבר על פרויקט חדש.','','שם: '+String(data.get('name')).trim(),data.get('email')?'מייל: '+String(data.get('email')).trim():'',data.get('phone')?'טלפון: '+String(data.get('phone')).trim():'','','על הפרויקט:',String(data.get('message')).trim()].filter((line,i,a)=>line||a[i-1]).join('\n');}
 function destinations(){const body=message();return {email:'mailto:'+email+'?subject='+encodeURIComponent('פנייה מתיק העבודות — '+form.elements.name.value.trim())+'&body='+encodeURIComponent(body),whatsapp:'https://wa.me/'+phone+'?text='+encodeURIComponent(body)};}
 function updateLinks(){const links=destinations();for(const channel of ['email','whatsapp'])form.querySelector('[data-contact-channel="'+channel+'"]').dataset.destination=links[channel];}
 form.addEventListener('input',updateLinks);updateLinks();
 form.addEventListener('submit',event=>{
  event.preventDefault();emailInput.setCustomValidity('');
  if(!emailInput.value.trim()&&!phoneInput.value.trim()){const error='השאירו כתובת מייל או מספר טלפון כדי שאוכל לחזור אליכם.';emailInput.setCustomValidity(error);status.textContent=error;emailInput.reportValidity();return;}
  if(!form.reportValidity())return;
  const channel=event.submitter?.dataset.contactChannel||'email',url=destinations()[channel];
  if(channel==='whatsapp')window.open(url,'_blank','noopener,noreferrer');else window.location.href=url;
  status.textContent=channel==='whatsapp'?'ההודעה מוכנה בווטסאפ. להשלמת הפנייה יש ללחוץ שם על שליחה.':'ההודעה מוכנה בתוכנת המייל. להשלמת הפנייה יש ללחוץ שם על שליחה. אם לא נפתחה תוכנה, אפשר לפנות בכתובת שמופיעה לצד הטופס.';
 });
})();
