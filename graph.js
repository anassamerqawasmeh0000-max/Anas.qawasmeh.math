/* رسم الاقتران — حاسبة بيانية للطلاب */
(function(){
const FN={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,floor:Math.floor,ceil:Math.ceil,sign:Math.sign,cbrt:Math.cbrt};
const PARAMS='abcdkm'.split('');
function norm(s){return String(s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/،/g,',').replace(/^\s*[yf]\s*(\(\s*x\s*\))?\s*=/i,'').replace(/√/g,'sqrt').replace(/π/g,'pi').replace(/²/g,'^2').replace(/³/g,'^3')}
function tok(s){const t=[];let i=0;s=norm(s).toLowerCase();while(i<s.length){const c=s[i];if(/\s/.test(c)){i++;continue}
 if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const v=parseFloat(s.slice(i,j));if(isNaN(v))throw new Error('رقم غير صحيح');t.push({t:'n',v});i=j;continue}
 if(/[a-z]/.test(c)){let m=null;for(const k of Object.keys(FN).concat(['pi'])){if(s.startsWith(k,i)&&(!m||k.length>m.length))m=k}
  if(m){t.push(m==='pi'?{t:'n',v:Math.PI}:{t:'f',v:m});i+=m.length;continue}
  if(c==='e'){t.push({t:'n',v:Math.E});i++;continue}
  if(c==='x'||PARAMS.includes(c)){t.push({t:'v',v:c});i++;continue}
  throw new Error('حرف غير معروف: '+c)}
 if('+-*/^(),'.includes(c)){t.push({t:'o',v:c});i++;continue}
 if(c==='|'){throw new Error('استخدم abs(x) بدل |x|')}
 throw new Error('رمز غير معروف: '+c)}return t}
function compile(src){const t=tok(src),used=new Set();let p=0;const pk=()=>t[p],nx=()=>t[p++];
 const isO=v=>pk()&&pk().t==='o'&&pk().v===v;
 function ex(){let l=tm();while(isO('+')||isO('-')){const o=nx().v,r=tm(),a=l;l=o==='+'?(x,P)=>a(x,P)+r(x,P):(x,P)=>a(x,P)-r(x,P)}return l}
 function tm(){let l=un();for(;;){const k=pk();if(!k)break;if(isO('*')||isO('/')){const o=nx().v,r=un(),a=l;l=o==='*'?(x,P)=>a(x,P)*r(x,P):(x,P)=>a(x,P)/r(x,P)}
  else if(k.t==='n'||k.t==='v'||k.t==='f'||(k.t==='o'&&k.v==='(')){const r=un(),a=l;l=(x,P)=>a(x,P)*r(x,P)}else break}return l}
 function un(){if(isO('-')){nx();const a=un();return(x,P)=>-a(x,P)}if(isO('+')){nx();return un()}return pw()}
 function pw(){const b=at();if(isO('^')){nx();const e=un();return(x,P)=>Math.pow(b(x,P),e(x,P))}return b}
 function at(){const k=nx();if(!k)throw new Error('المعادلة ناقصة');
  if(k.t==='n'){const v=k.v;return()=>v}
  if(k.t==='v'){used.add(k.v);const v=k.v;return v==='x'?(x)=>x:(x,P)=>P[v]}
  if(k.t==='f'){const f=FN[k.v];let a;if(isO('(')){nx();a=ex();if(!isO(')'))throw new Error('نقص قوس )');nx()}else a=pw();return(x,P)=>f(a(x,P))}
  if(k.t==='o'&&k.v==='('){const a=ex();if(!isO(')'))throw new Error('نقص قوس )');nx();return a}
  throw new Error('رمز في غير مكانه: '+k.v)}
 const f=ex();if(p<t.length)throw new Error('رمز زائد: '+t[p].v);return{f,used}}
const fmt=v=>{if(!Number.isFinite(v))return '—';const r=Math.round(v*1000)/1000;return String(Object.is(r,-0)?0:r)};
const COL=['#4aa3ff','#f6d77a','#ff8a7a'];
const PRE=[['y=x','x'],['خطي 2x+1','2x+1'],['x²','x^2'],['ax²+bx+c','a*x^2+b*x+c'],['√x','sqrt(x)'],['1/x','1/x'],['|x|','abs(x)'],['sin x','sin(x)'],['x³−3x','x^3-3*x'],['ax+b','a*x+b']];
function css(){if(document.getElementById('grcss'))return;const s=document.createElement('style');s.id='grcss';s.textContent=`.gr-cv{width:100%;height:340px;display:block;background:#0c1b38;border:1px solid var(--line);border-radius:14px;touch-action:none;cursor:grab}
.gr-row{display:flex;gap:8px;align-items:center;margin:8px 0}.gr-row input[type=text]{flex:1;min-width:0;direction:ltr;text-align:left;font-size:18px}.gr-dot{width:14px;height:14px;border-radius:50%;flex:none}
.gr-q{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.gr-q button{min-width:38px;padding:6px 8px;font-size:15px}
.gr-sl{display:flex;align-items:center;gap:8px;margin:6px 0}.gr-sl b{min-width:44px;direction:ltr;text-align:left}.gr-sl input{flex:1;min-width:0}
.gr-info{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:8px 0;font-size:15px;line-height:1.9}.gr-info b{color:var(--gold)}.gr-info .v{direction:ltr;unicode-bidi:isolate;display:inline-block}
.gr-ct{display:flex;gap:8px;margin:8px 0}.gr-tb{border-collapse:collapse;width:100%;direction:ltr;text-align:center;font-size:14px}.gr-tb td,.gr-tb th{border:1px solid var(--line);padding:4px}.gr-err{color:#ff8f8f;font-size:14px;min-height:18px}`;document.head.appendChild(s)}
window.graphPage=function(app){
 css();document.title='رسم الاقتران';
 const st={fns:[{s:'a*x^2+b*x+c',on:1},{s:'',on:1},{s:'',on:1}],P:{a:1,b:0,c:0,d:1,k:1,m:1},v:{cx:0,cy:0,sc:40},foc:0};
 app.innerHTML='<div class="crumb"><a href="#">الرئيسية</a> ‹ رسم الاقتران</div><h1>📈 رسم الاقتران</h1><p class="sub">اكتب الاقتران وشوف رسمه فورًا. اسحب الرسم للتحريك وكبّر بإصبعين. إذا استخدمت الحروف a وb وc بتطلع لك مقابض تحرّكها.</p>'
 +'<div class="chips" id="grp"></div><div id="grr"></div><div class="gr-q" id="grk"></div><div class="gr-err" id="gre"></div><canvas class="gr-cv" id="grc"></canvas>'
 +'<div class="gr-ct"><button class="btn" id="gz1">＋ تكبير</button><button class="btn" id="gz2">－ تصغير</button><button class="btn" id="gz0">⟲ رجوع</button></div><div id="grs"></div><div id="gri"></div>';
 const cv=document.getElementById('grc'),ctx=cv.getContext('2d');let W=0,H=0,dpr=1;
 const rowsEl=document.getElementById('grr');
 rowsEl.innerHTML=st.fns.map((f,i)=>'<div class="gr-row"><span class="gr-dot" style="background:'+COL[i]+'"></span><span class="sub" style="margin:0" dir="ltr">y=</span><input type="text" data-i="'+i+'" value="'+f.s+'" placeholder="'+(i?'اقتران إضافي (اختياري)':'مثال: x^2-4')+'" autocapitalize="off" autocomplete="off" spellcheck="false"></div>').join('');
 const inps=[...rowsEl.querySelectorAll('input')];
 document.getElementById('grp').innerHTML=PRE.map((p,i)=>'<button class="chip" data-p="'+i+'">'+p[0]+'</button>').join('');
 document.getElementById('grk').innerHTML=['x','^','(',')','+','-','*','/','sqrt(','abs(','sin(','cos(','pi'].map(k=>'<button class="btn" dir="ltr" data-k="'+k+'">'+(k==='*'?'×':k==='/'?'÷':k)+'</button>').join('');
 const getFns=()=>{const err=[];const out=st.fns.map((f,i)=>{f.c=null;const s=inps[i].value.trim();f.s=s;if(!s)return f;try{f.c=compile(s)}catch(e){err.push('المعادلة '+(i+1)+': '+e.message)}return f});document.getElementById('gre').textContent=err.join(' · ');return out};
 const ev=(f,x)=>{try{const v=f.c.f(x,st.P);return Number.isFinite(v)?v:NaN}catch(e){return NaN}};
 function size(){dpr=window.devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 const X=x=>W/2+(x-st.v.cx)*st.v.sc,Y=y=>H/2-(y-st.v.cy)*st.v.sc,ix=px=>(px-W/2)/st.v.sc+st.v.cx,iy=py=>-(py-H/2)/st.v.sc+st.v.cy;
 const step=()=>{const raw=70/st.v.sc,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p};
 function draw(){ctx.clearRect(0,0,W,H);const s=step(),x0=ix(0),x1=ix(W),y1=iy(0),y0=iy(H);
  ctx.lineWidth=1;ctx.font='11px sans-serif';ctx.textBaseline='top';
  for(let gx=Math.ceil(x0/s)*s;gx<=x1;gx+=s){const px=X(gx);ctx.strokeStyle=Math.abs(gx)<s/1e3?'#9fb2d6':'#1f365f';ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.stroke()}
  for(let gy=Math.ceil(y0/s)*s;gy<=y1;gy+=s){const py=Y(gy);ctx.strokeStyle=Math.abs(gy)<s/1e3?'#9fb2d6':'#1f365f';ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(W,py);ctx.stroke()}
  ctx.fillStyle='#9fb2d6';const ax=Math.min(Math.max(Y(0),4),H-14),ay=Math.min(Math.max(X(0),4),W-30);
  for(let gx=Math.ceil(x0/s)*s;gx<=x1;gx+=s){if(Math.abs(gx)<s/1e3)continue;ctx.fillText(fmt(gx),X(gx)+2,ax+2)}
  for(let gy=Math.ceil(y0/s)*s;gy<=y1;gy+=s){if(Math.abs(gy)<s/1e3)continue;ctx.fillText(fmt(gy),ay+3,Y(gy)+2)}
  ctx.fillText('x',W-10,ax-14);ctx.fillText('y',ay+6,2);
  st.fns.forEach((f,i)=>{if(!f.c)return;ctx.strokeStyle=COL[i];ctx.lineWidth=2.4;ctx.beginPath();let pen=false,py=NaN;const N=Math.min(1600,Math.ceil(W*2));
   for(let k=0;k<=N;k++){const x=x0+(x1-x0)*k/N,y=ev(f,x);if(isNaN(y)){pen=false;py=NaN;continue}const yy=Y(y);
    if(pen&&(Math.abs(yy-py)>H*1.5)){pen=false}
    if(Math.abs(yy)>1e5){pen=false;py=yy;continue}
    if(!pen){ctx.moveTo(X(x),yy);pen=true}else ctx.lineTo(X(x),yy);py=yy}ctx.stroke();
   (f.pts||[]).forEach(q=>{ctx.fillStyle=q.k==='z'?'#7ee2b0':q.k==='y'?'#fff':'#ff9fd0';ctx.beginPath();ctx.arc(X(q.x),Y(q.y),4.5,0,7);ctx.fill()})})}
 function analyse(){const x0=ix(0),x1=ix(W),out=[];st.fns.forEach((f,i)=>{f.pts=[];if(!f.c)return;const N=1500,xs=[],ys=[];for(let k=0;k<=N;k++){const x=x0+(x1-x0)*k/N;xs.push(x);ys.push(ev(f,x))}
  const P=f.pts,z=[],e=[];
  for(let k=1;k<=N;k++){const a=ys[k-1],b=ys[k];if(isNaN(a)||isNaN(b))continue;
   if(a===0&&(k===1||ys[k-2]!==0))z.push(xs[k-1]);else if(a*b<0){let lo=xs[k-1],hi=xs[k],fl=a;for(let j=0;j<55;j++){const m=(lo+hi)/2,fm=ev(f,m);if(isNaN(fm))break;if(fl*fm<=0)hi=m;else{lo=m;fl=fm}}const r=(lo+hi)/2,fr=ev(f,r);if(Math.abs(fr)<1e-5*Math.max(1,Math.abs(a),Math.abs(b)))z.push(r)}}
  for(let k=1;k<N;k++){const a=ys[k-1],b=ys[k],c=ys[k+1];if(isNaN(a)||isNaN(b)||isNaN(c))continue;if((b-a)*(c-b)<0&&Math.abs(b-a)<(y=>y)(1e3)){let lo=xs[k-1],hi=xs[k+1];const mx=b>a;for(let j=0;j<80;j++){const m1=lo+(hi-lo)/3,m2=hi-(hi-lo)/3,f1=ev(f,m1),f2=ev(f,m2);if(isNaN(f1)||isNaN(f2))break;if(mx?f1<f2:f1>f2)lo=m1;else hi=m2}const r=(lo+hi)/2,y=ev(f,r);if(!isNaN(y)&&Math.abs(y)<1e6)e.push({x:r,y,max:mx})}}
  const dd=(arr,kf)=>{const o=[];arr.forEach(v=>{if(!o.some(u=>Math.abs(kf(u)-kf(v))<(x1-x0)/400))o.push(v)});return o};
  const zs=dd(z,v=>v).slice(0,6),es=dd(e,v=>v.x).slice(0,4),y0=ev(f,0);
  zs.forEach(x=>P.push({k:'z',x,y:0}));es.forEach(v=>P.push({k:'e',x:v.x,y:v.y}));if(!isNaN(y0)&&x0<=0&&x1>=0)P.push({k:'y',x:0,y:y0});
  f._z=zs;f._e=es;f._y0=y0});}
 function info(){const h=st.fns.map((f,i)=>{if(!f.c)return '';const dot='<span class="gr-dot" style="background:'+COL[i]+';display:inline-block;vertical-align:middle"></span> ';
   const V=t=>'<span class="v">'+t+'</span>';
   return '<div class="gr-info">'+dot+'<b>y = '+V(esc(f.s))+'</b><br>'
   +'التقاطع مع محور y: '+(isNaN(f._y0)?'غير موجود':V('(0, '+fmt(f._y0)+')'))+'<br>'
   +'الأصفار (التقاطع مع محور x): '+(f._z.length?f._z.map(x=>V('('+fmt(x)+', 0)')).join(' · '):'لا يوجد ضمن المشهد الحالي')
   +(f._e.length?'<br>القيم العظمى والصغرى: '+f._e.map(v=>(v.max?'عظمى ':'صغرى ')+V('('+fmt(v.x)+', '+fmt(v.y)+')')).join(' · '):'')+'</div>'}).join('');
  document.getElementById('gri').innerHTML=h+tableHtml()}
 function tableHtml(){const f=st.fns.find(f=>f.c);if(!f)return '';const xs=[-3,-2,-1,0,1,2,3];return '<div class="gr-info" style="overflow-x:auto"><b>جدول القيم</b> <small style="color:var(--mut)">(للاقتران الأول)</small><table class="gr-tb"><tr><th>x</th>'+xs.map(x=>'<td>'+x+'</td>').join('')+'</tr><tr><th>y</th>'+xs.map(x=>'<td>'+fmt(ev(f,x))+'</td>').join('')+'</tr></table></div>'}
 function sliders(){const need=new Set();st.fns.forEach(f=>{if(f.c)f.c.used.forEach(v=>{if(v!=='x')need.add(v)})});const el=document.getElementById('grs');
  const keys=PARAMS.filter(p=>need.has(p));const sig=keys.join();if(el.dataset.sig===sig)return;el.dataset.sig=sig;
  el.innerHTML=keys.length?'<div class="gr-info"><b>حرّك القيم:</b>'+keys.map(k=>'<div class="gr-sl"><b>'+k+' = <span id="gv'+k+'">'+fmt(st.P[k])+'</span></b><input type="range" min="-10" max="10" step="0.1" value="'+st.P[k]+'" data-s="'+k+'"></div>').join('')+'</div>':'';
  el.querySelectorAll('[data-s]').forEach(r=>r.oninput=()=>{st.P[r.dataset.s]=+r.value;document.getElementById('gv'+r.dataset.s).textContent=fmt(+r.value);redraw(1)})}
 function redraw(keep){if(!keep){getFns();sliders()}analyse();draw();info()}
 inps.forEach(i=>{i.oninput=()=>redraw();i.onfocus=()=>{st.foc=+i.dataset.i}});
 document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{inps[0].value=PRE[+b.dataset.p][1];inps[1].value='';inps[2].value='';redraw()});
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const i=inps[st.foc]||inps[0],k=b.dataset.k,s=i.selectionStart==null?i.value.length:i.selectionStart,e=i.selectionEnd==null?s:i.selectionEnd;i.value=i.value.slice(0,s)+k+i.value.slice(e);i.focus();const p=s+k.length;try{i.setSelectionRange(p,p)}catch(x){}redraw()});
 const zoom=(f,px,py)=>{px=px==null?W/2:px;py=py==null?H/2:py;const bx=ix(px),by=iy(py);st.v.sc=Math.min(2000,Math.max(2,st.v.sc*f));st.v.cx=bx-(px-W/2)/st.v.sc;st.v.cy=by+(py-H/2)/st.v.sc;redraw(1)};
 document.getElementById('gz1').onclick=()=>zoom(1.4);document.getElementById('gz2').onclick=()=>zoom(1/1.4);document.getElementById('gz0').onclick=()=>{st.v={cx:0,cy:0,sc:40};redraw(1)};
 const ptr=new Map();let pd=0;
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.offsetX,y:e.offsetY});pd=0;cv.style.cursor='grabbing'};
 cv.onpointermove=e=>{if(!ptr.has(e.pointerId))return;const o=ptr.get(e.pointerId),n={x:e.offsetX,y:e.offsetY};
  if(ptr.size===1){st.v.cx-=(n.x-o.x)/st.v.sc;st.v.cy+=(n.y-o.y)/st.v.sc;ptr.set(e.pointerId,n);redraw(1)}
  else if(ptr.size===2){const ids=[...ptr.keys()],a=ptr.get(ids[0]),b=ptr.get(ids[1]),d0=Math.hypot(a.x-b.x,a.y-b.y);ptr.set(e.pointerId,n);const a2=ptr.get(ids[0]),b2=ptr.get(ids[1]),d1=Math.hypot(a2.x-b2.x,a2.y-b2.y);if(d0>0)zoom(d1/d0,(a2.x+b2.x)/2,(a2.y+b2.y)/2)}};
 const up=e=>{ptr.delete(e.pointerId);cv.style.cursor='grab'};cv.onpointerup=up;cv.onpointercancel=up;
 cv.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.15:1/1.15,e.offsetX,e.offsetY)},{passive:false});
 const rz=()=>{if(!document.getElementById('grc'))return window.removeEventListener('resize',rz);size();redraw(1)};window.addEventListener('resize',rz);
 size();redraw();
};
})();
