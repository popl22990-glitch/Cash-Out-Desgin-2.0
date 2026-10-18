const $=id=>document.getElementById(id);
let photos={customer:'',admin:'',receipt:'',watermark:'',logo:''};
let messages=[
 {who:'customer',text:'အမ ငွေထုတ်မယ်နော်။',time:'10:40:20'},
 {who:'admin',text:'ဟုတ်ကဲ့ပါရှင့် ခဏလေး စောင့်ပေးပါနော်။',time:'10:40:32'},
 {who:'admin',text:'ငွေလွှဲပေးပြီးပါပြီရှင့်။ ငွေအဝင်လေး စစ်ကြည့်ပေးပါဦးနော်။',time:'10:46:31'},
 {who:'customer',text:'ရပါပြီရှင့်။ ကျေးဇူးပါ။',time:'10:46:40'}
];
function toast(s){const e=$('toast');e.textContent=s;e.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>e.classList.remove('show'),2200)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function avatar(who){const name=$(who==='customer'?'customerName':'adminName').value.trim()||(who==='customer'?'Customer':'Admin');return photos[who]?`<img src="${photos[who]}" alt="">`:esc(name.slice(0,1).toUpperCase())}
function renderEditors(){
 $('messageEditors').innerHTML='';
 messages.forEach((m,i)=>{
  const wrap=document.createElement('div');wrap.className='message-edit-card';wrap.style.cssText='border:1px solid #35435b;border-radius:12px;padding:12px;gap:9px;background:#0d1626';
  wrap.innerHTML=`<div style="display:flex;gap:8px;align-items:center;justify-content:space-between"><strong style="font-size:12px">${i+1}. ${m.who==='customer'?'Customer':'Admin'}${m.type==='image'?' · ပုံ':''}</strong><button type="button" class="btn ghost" data-del="${i}" style="padding:6px 9px">ဖျက်မည် ✕</button></div><label>ဘယ်ဘက်/ညာဘက်<select data-who="${i}"><option value="customer" ${m.who==='customer'?'selected':''}>Customer (ဘယ်ဘက်)</option><option value="admin" ${m.who==='admin'?'selected':''}>Admin (ညာဘက်)</option></select></label>${m.type==='image'?`<img src="${m.image}" alt="ပို့ထားသောပုံ" style="max-width:120px;max-height:100px;object-fit:contain;border-radius:8px">`:`<label>စာသား<textarea rows="2" data-text="${i}">${esc(m.text)}</textarea></label>`}<label>အချိန်<input data-time="${i}" value="${esc(m.time)}" placeholder="10:40:20"></label>`;
  $('messageEditors').appendChild(wrap);
 });
 $('messageEditors').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{messages.splice(+b.dataset.del,1);renderEditors();render()});
 $('messageEditors').querySelectorAll('[data-text]').forEach(e=>e.oninput=()=>{messages[+e.dataset.text].text=e.value;render()});
 $('messageEditors').querySelectorAll('[data-time]').forEach(e=>e.oninput=()=>{messages[+e.dataset.time].time=e.value;render()});
 $('messageEditors').querySelectorAll('[data-who]').forEach(e=>e.onchange=()=>{messages[+e.dataset.who].who=e.value;renderEditors();render()});
}
function render(){
 const body=$('chatBody');body.innerHTML='';
 messages.forEach(m=>{
  const customer=m.who==='customer',name=$(customer?'customerName':'adminName').value.trim()||(customer?'Customer':'Admin');
  const row=document.createElement('div');row.className='message-row '+(customer?'left':'right');
  const content=m.type==='image'?`<img src="${m.image}" alt="${customer?'Customer':'Admin'} ပို့ထားသောပုံ" style="display:block;width:auto;max-width:160px;max-height:160px;object-fit:contain;border:1px solid #dce3ec;border-radius:9px;padding:2px;background:#fff">`:`<div class="bubble ${customer?'incoming':'outgoing'}">${esc(m.text)}</div>`;
  row.innerHTML=customer?`<div class="avatar customer-avatar">${avatar('customer')}</div><div class="message-stack"><div class="person">${esc(name)}</div>${content}<div class="meta"><span>${esc($('chatDate').value)}</span><span>${esc(m.time)}</span> · read</div></div>`:`<div class="message-stack align-right"><div class="person">${esc(name)}</div>${content}<div class="meta"><span>${esc($('chatDate').value)}</span><span>${esc(m.time)}</span> · sent</div></div><div class="avatar admin-avatar">${avatar('admin')}</div>`;
  body.appendChild(row);
 });
 if($('amountToggle').checked){const row=document.createElement('div');row.className='message-row right';row.innerHTML=`<div class="message-stack align-right"><div class="amount-bubble">${esc('-'+$('amount').value)}</div><div class="meta">${esc($('chatDate').value)}</div></div><div class="avatar admin-avatar">${avatar('admin')}</div>`;body.appendChild(row)}
 if(photos.receipt && $('receiptToggle').checked){const box=document.createElement('div');box.style.cssText='align-self:flex-end;max-width:90%;';box.innerHTML=`<img src="${photos.receipt}" alt="Uploaded receipt" style="display:block;max-width:100%;max-height:600px;object-fit:contain;border:2px solid #d4a017;border-radius:10px">`;body.appendChild(box)}
 const colors={red:'#e52323',blue:'#1768d5',gold:'#d4a017'};$('chatCanvas').style.setProperty('--accent',colors[$('theme').value]||colors.red);
 const wm=$('watermarkOverlay');if(photos.watermark){wm.hidden=false;wm.style.width=$('wmSize').value+'%';wm.style.left=$('wmX').value+'%';wm.style.top=$('wmY').value+'%';wm.style.opacity=String(Number($('wmOpacity').value)/100);$('watermarkImage').src=photos.watermark}else{wm.hidden=true}
 const custom=$('customTextOverlay');custom.textContent=$('customText').value;custom.hidden=!$('customText').value;custom.style.left=$('textX').value+'%';custom.style.top=$('textY').value+'%';custom.style.fontSize=$('textSize').value+'px';custom.style.color=$('textColor').value;custom.style.webkitTextStroke=`${$('strokeWidth').value}px ${$('strokeColor').value}`;
 const mode=$('backgroundMode').value;const bg=mode==='dark'?'#151b26':mode==='color' ? $('backgroundColor').value:'#ffffff';$('chatCanvas').style.background=bg;$('chatCanvas').style.color=$('chatTextColor').value;$('chatCanvas').querySelector('.chat-top').style.background=$('headerColor').value;
 const scale=Number($('previewScale').value)/100;$('chatCanvas').style.width='100%';$('chatCanvas').style.maxWidth=(720*scale)+'px';$('previewScaleValue').textContent=$('previewScale').value+'%';
 $('brandTitle').textContent=$('titleInput').value.trim()||'Wai Yan Tun Chat Studio';$('previewLogo').innerHTML=photos.logo?`<img src="${photos.logo}" alt="Logo" style="width:100%;height:100%;object-fit:contain">`:'✦';$('brandmark').innerHTML=photos.logo?`<img src="${photos.logo}" alt="Logo">`:esc($('logoText').value||'CS');
}
['customerName','adminName','chatDate','amount'].forEach(id=>$(id).addEventListener('input',render));
['customText','textColor','strokeColor','textSize','strokeWidth','textX','textY','titleInput','logoText','backgroundMode','backgroundColor','headerColor','chatTextColor','previewScale'].forEach(id=>$(id).addEventListener('input',()=>{const labels={textSize:'textSizeValue',strokeWidth:'strokeWidthValue',textX:'textXValue',textY:'textYValue'};if(labels[id])$(labels[id]).textContent=$(id).value+(id==='textX'||id==='textY'?'%':'px');render()}));
$('removeText').onclick=()=>{$('customText').value='';render();toast('စာသားဖယ်ရှားပြီးပါပြီ။')};
$('titleInput').addEventListener('input',render);$('logoText').addEventListener('input',render);
$('logoPhoto').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/'))return toast('Logo ပုံဖိုင်ကို ရွေးပါ။');if(f.size>10*1024*1024)return toast('ပုံဖိုင် 10MB ထက်မကြီးရပါ။');const r=new FileReader();r.onload=()=>{photos.logo=r.result;render();toast('Logo ပြောင်းပြီးပါပြီ။')};r.readAsDataURL(f)};
$('removeLogo').onclick=()=>{photos.logo='';$('logoPhoto').value='';$('logoText').value='';render();toast('Logo ဖယ်ရှားပြီးပါပြီ။')};
$('theme').onchange=render;$('amountToggle').onchange=render;$('receiptToggle').onchange=render;
$('addCustomer').onclick=()=>{messages.push({who:'customer',text:'စာသားအသစ်',time:'10:47:00'});renderEditors();render()};
$('addAdmin').onclick=()=>{messages.push({who:'admin',text:'စာသားအသစ်',time:'10:47:00'});renderEditors();render()};
function upload(id,key){$(id).onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/'))return toast('Image ဖိုင်ကို ရွေးပါ။');if(f.size>10*1024*1024)return toast('ပုံဖိုင် 10MB ထက်မကြီးရပါ။');const r=new FileReader();r.onload=()=>{photos[key]=r.result;render()};r.readAsDataURL(f)}}
upload('customerPhoto','customer');upload('adminPhoto','admin');upload('receiptPhoto','receipt');upload('watermarkPhoto','watermark');
function sendChatImage(inputId,who){const input=$(inputId);const file=input.files?.[0];if(!file)return toast('ပို့မည့်ပုံကို အရင်ရွေးပါ။');if(!file.type.startsWith('image/'))return toast('Image ဖိုင်ကို ရွေးပါ။');if(file.size>10*1024*1024)return toast('ပုံဖိုင် 10MB ထက်မကြီးရပါ။');const reader=new FileReader();reader.onload=()=>{const now=new Date();const time=[now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');messages.push({who,type:'image',image:reader.result,text:'',time});input.value='';renderEditors();render();toast((who==='customer'?'Customer':'Admin')+' အဖြစ် ပုံထည့်ပြီးပါပြီ။')};reader.readAsDataURL(file)}
$('sendCustomerPhoto').onclick=()=>sendChatImage('customerMessagePhoto','customer');$('sendAdminPhoto').onclick=()=>sendChatImage('adminMessagePhoto','admin');
$('removeReceipt').onclick=()=>{photos.receipt='';$('receiptPhoto').value='';render();toast('ပြေစာပုံ ဖယ်ရှားပြီးပါပြီ။')};
$('watermarkPhoto').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/'))return toast('Watermark အတွက် ပုံဖိုင်ရွေးပါ။');if(f.size>10*1024*1024)return toast('ပုံဖိုင် 10MB ထက်မကြီးရပါ။');const r=new FileReader();r.onload=()=>{photos.watermark=r.result;$('watermarkThumb').src=r.result;$('watermarkThumbWrap').hidden=false;render();toast('Watermark ပုံ ထည့်ပြီးပါပြီ။')};r.readAsDataURL(f)};
['wmSize','wmOpacity','wmX','wmY'].forEach(id=>$(id).addEventListener('input',()=>{const label={wmSize:'wmSizeValue',wmOpacity:'wmOpacityValue',wmX:'wmXValue',wmY:'wmYValue'}[id];$(label).textContent=$(id).value+'%';render()}));
$('removeWatermark').onclick=()=>{photos.watermark='';$('watermarkPhoto').value='';$('watermarkThumbWrap').hidden=true;render();toast('Watermark ဖယ်ရှားပြီးပါပြီ။')};
$('copyBtn').onclick=async()=>{const txt=messages.map(m=>`${m.who==='customer'?$('customerName').value:$('adminName').value}: ${m.text}\n${$('chatDate').value} ${m.time}`).join('\n\n');try{await navigator.clipboard.writeText(txt);toast('Chat စာသား Copy လုပ်ပြီးပါပြီ။')}catch{const t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('Chat စာသား Copy လုပ်ပြီးပါပြီ။')}};
$('downloadBtn').onclick=async()=>{if(!window.html2canvas)return toast('PNG Download အတွက် Internet ချိတ်ဆက်ပါ။');const b=$('downloadBtn');b.disabled=true;b.textContent='ပြင်ဆင်နေသည်…';try{const canvasEl=$('chatCanvas');const c=await html2canvas(canvasEl,{scale:2,backgroundColor:null,useCORS:true,allowTaint:false,logging:false,windowWidth:Math.max(document.documentElement.clientWidth,canvasEl.scrollWidth),onclone:doc=>{const el=doc.getElementById('chatCanvas');el.style.transform='none';el.style.maxWidth='none';el.style.width=canvasEl.getBoundingClientRect().width+'px';const w=doc.getElementById('watermarkOverlay');if(w&&!w.hidden){w.style.overflow='visible';w.style.maxHeight='none';const im=w.querySelector('img');if(im){im.style.maxHeight='none';im.style.maxWidth='none';}}}});const a=document.createElement('a');a.download='chat-design.png';a.href=c.toDataURL('image/png');a.click();toast('PNG Download ပြီးပါပြီ။')}catch(e){toast('Download မအောင်မြင်ပါ။ ထပ်ကြိုးစားပါ။')}finally{b.disabled=false;b.textContent='Chat Image Download'}};
$('resetBtn').onclick=()=>{if(confirm('မူလစာသားများအတိုင်း ပြန်ထားမလား?'))location.reload()};
renderEditors();render();