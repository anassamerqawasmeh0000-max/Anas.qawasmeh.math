/* الحاسبة العلمية */
(function(){
const FN=['asin','acos','atan','sin','cos','tan','log','ln','sqrt','cbrt','abs'];
function tok(s){const t=[];let i=0;while(i<s.length){const c=s[i];if(c===' '){i++;continue}
 if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const tx=s.slice(i,j);if((tx.match(/\./g)||[]).length>1||tx==='.')throw new Error('رقم غير صحيح');t.push({t:'n',v:parseFloat(tx)});i=j;continue}
 if(c==='π'){t.push({t:'n',v:Math.PI});i++;continue}
 if(c==='√'){t.push({t:'f',v:'sqrt'});i++;continue}
 if(c==='∛'){t.push({t:'f',v:'cbrt'});i++;continue}
 if(s.startsWith('Ans',i)){t.push({t:'a'});i+=3;continue}
 const f=FN.find(k=>s.startsWith(k,i));if(f){t.push({t:'f',v:f});i+=f.length;continue}
 if(c==='e'){t.push({t:'n',v:Math.E});i++;continue}
 if(c==='E'){t.push({t:'o',v:'E'});i++;continue}
 const m={'×':'*','÷':'/','−':'-','²':'²','³':'³'}[c]||c;
 if('+-*/^()!%²³'.includes(m)){t.push({t:'o',v:m});i++;continue}
 throw new Error('رمز غير معروف')}return t}
function fact(n){if(n<0||n!==Math.floor(n)||n>170)throw new Error('المضروب لعدد صحيح من 0 إلى 170');let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function evaluate(src,o){o=o||{};const deg=o.deg!==false,ans=o.ans||0,t=tok(src);let p=0;
 const pk=()=>t[p],isO=v=>pk()&&pk().t==='o'&&pk().v===v,D=x=>deg?x*Math.PI/180:x,R=x=>deg?x*180/Math.PI:x;
 const F={sin:x=>Math.sin(D(x)),cos:x=>Math.cos(D(x)),tan:x=>{const c=Math.cos(D(x));if(Math.abs(c)<1e-12)throw new Error('غير معرّف');return Math.sin(D(x))/c},
  asin:x=>{if(x<-1||x>1)throw new Error('خارج المجال');return R(Math.asin(x))},acos:x=>{if(x<-1||x>1)throw new Error('خارج المجال');return R(Math.acos(x))},atan:x=>R(Math.atan(x)),
  log:x=>{if(x<=0)throw new Error('اللوغاريتم لعدد موجب فقط');return Math.log10(x)},ln:x=>{if(x<=0)throw new Error('اللوغاريتم لعدد موجب فقط');return Math.log(x)},
  sqrt:x=>{if(x<0)throw new Error('لا جذر تربيعي لعدد سالب');return Math.sqrt(x)},cbrt:Math.cbrt,abs:Math.abs};
 function ex(){let l=tm();while(isO('+')||isO('-')){const op=t[p++].v,r=tm();l=op==='+'?l+r:l-r}return l}
 function tm(){let l=un();for(;;){const k=pk();if(!k)break;if(isO('*')||isO('/')){const op=t[p++].v,r=un();if(op==='/'){if(r===0)throw new Error('لا يمكن القسمة على صفر');l=l/r}else l=l*r}
  else if(k.t==='n'||k.t==='f'||k.t==='a'||(k.t==='o'&&k.v==='(')){l=l*un()}else break}return l}
 function un(){if(isO('-')){p++;return -un()}if(isO('+')){p++;return un()}return pw()}
 function pw(){let b=pf();if(isO('^')){p++;const e=un();b=Math.pow(b,e)}else if(isO('E')){p++;const e=un();b=b*Math.pow(10,e)}return b}
 function pf(){let v=at();for(;;){if(isO('!')){p++;v=fact(v)}else if(isO('%')){p++;v=v/100}else if(isO('²')){p++;v=v*v}else if(isO('³')){p++;v=v*v*v}else break}return v}
 function close(){if(isO(')'))p++;else if(p<t.length)throw new Error('نقص قوس')}
 function at(){const k=t[p++];if(!k)throw new Error('العملية ناقصة');if(k.t==='n')return k.v;if(k.t==='a')return ans;
  if(k.t==='f'){let a;if(isO('(')){p++;a=ex();close()}else a=pf();return F[k.v](a)}
  if(k.t==='o'&&k.v==='('){const a=ex();close();return a}throw new Error('ترتيب غير صحيح')}
 const v=ex();if(p<t.length)throw new Error('ترتيب غير صحيح');if(!Number.isFinite(v))throw new Error('الناتج غير معرّف');return v}
function fmt(v){if(Math.abs(v)<1e-12)return '0';let r=parseFloat(v.toPrecision(12));const a=Math.abs(r);
 if(a>=1e12||a<1e-6){const [m,e]=r.toExponential(9).split('e');return parseFloat(m)+'×10^'+(+e)}return String(parseFloat(r.toPrecision(10)))}
function frac(v){if(!Number.isFinite(v)||Math.abs(v)>1e9)return null;if(Math.abs(v-Math.round(v))<1e-11)return null;const s=v<0?-1:1;let x=Math.abs(v),h0=0,h1=1,k0=1,k1=0,y=x;
 for(let i=0;i<25;i++){const a=Math.floor(y),h=a*h1+h0,k=a*k1+k0;h0=h1;h1=h;k0=k1;k1=k;if(k>100000)break;if(Math.abs(x-h/k)<1e-11)return (s<0?'−':'')+h+'/'+k;const f=y-a;if(f<1e-13)break;y=1/f}return null}
window.CALC={evaluate,fmt,frac};
const K1=[['2nd','k2'],['DEG','kd'],['(','ko'],[')','ko'],['⌫','kx'],
 ['sin','kf'],['cos','kf'],['tan','kf'],['log','kf'],['ln','kf'],
 ['x²','kf'],['xʸ','kf'],['√','kf'],['π','kf'],['e','kf'],
 ['7'],['8'],['9'],['÷','ko'],['AC','kx'],
 ['4'],['5'],['6'],['×','ko'],['%','ko'],
 ['1'],['2'],['3'],['−','ko'],['Ans','ko'],
 ['0'],['.'],['EXP','ko'],['+','ko'],['=','ke']];
const ALT={sin:'sin⁻¹',cos:'cos⁻¹',tan:'tan⁻¹',log:'10ˣ',ln:'eˣ','x²':'x³','xʸ':'1/x','√':'∛','π':'|x|',e:'n!'};
const INS={sin:'sin(',cos:'cos(',tan:'tan(',log:'log(',ln:'ln(','sin⁻¹':'asin(','cos⁻¹':'acos(','tan⁻¹':'atan(','10ˣ':'10^(','eˣ':'e^(','x²':'²','x³':'³','xʸ':'^(','1/x':'1÷(','√':'√(','∛':'∛(','|x|':'abs(','n!':'!',EXP:'E'};
function css(){if(document.getElementById('clcss'))return;const s=document.createElement('style');s.id='clcss';s.textContent=`.cl{max-width:440px;margin:0 auto}.cl-d{background:#0c1b38;border:1px solid var(--line);border-radius:14px;padding:12px 14px;direction:ltr;text-align:right;min-height:104px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
.cl-e{color:var(--mut);font-size:19px;min-height:26px;word-break:break-all;font-family:ui-monospace,Menlo,monospace}.cl-r{font-size:34px;font-weight:700;color:var(--gold);word-break:break-all;line-height:1.25}.cl-r.er{font-size:18px;color:#ff8f8f;direction:rtl;text-align:left}
.cl-k{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:10px;direction:ltr}.cl-k button{font:600 19px Cairo,sans-serif;padding:13px 0;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;touch-action:manipulation}
.cl-k button:active{filter:brightness(1.35)}.cl-k .kf{background:#0d1d3c;font-size:16px;color:#bcd0f5}.cl-k .ko{background:#1c3a6e}.cl-k .kx{background:#5a2330}.cl-k .ke{background:var(--gold);color:#0a1630;border-color:var(--gold)}.cl-k .k2,.cl-k .kd{background:#0d1d3c;font-size:14px;color:var(--gold)}.cl-k .on{outline:2px solid var(--gold)}
.cl-h{margin-top:12px}.cl-h button{display:block;width:100%;direction:ltr;text-align:right;background:none;border:0;border-bottom:1px solid var(--line);color:var(--mut);font:15px ui-monospace,Menlo,monospace;padding:7px 4px;cursor:pointer}.cl-h b{color:var(--fg)}`;document.head.appendChild(s)}
window.calcPage=function(app){css();document.title='الحاسبة العلمية';
 let ex='',ans=0,deg=true,alt=false,done=false,showF=false,last=null,derr=null,H=[];try{H=JSON.parse(localStorage.getItem('calch')||'[]')}catch(e){}
 app.innerHTML='<div class="crumb"><a href="#">الرئيسية</a> ‹ الحاسبة العلمية</div><h1>🧮 الحاسبة العلمية</h1><div class="cl"><div class="cl-d"><div class="cl-e" id="cle"></div><div class="cl-r" id="clr">0</div></div>'
 +'<div class="chips" style="margin-top:8px"><button class="chip" id="clf">كسر ⇄ عشري</button><span class="pill" id="clm">الزوايا بالدرجات</span></div><div class="cl-k" id="clk"></div><div class="cl-h" id="clh"></div>'
 +'<p class="sub">الزر <b>2nd</b> بيبدّل الأزرار للدوال العكسية. الزر <b>DEG</b> بيبدّل بين الدرجات والراديان. <b>Ans</b> هو آخر ناتج.</p></div>';
 const E=document.getElementById('cle'),Rr=document.getElementById('clr'),Kk=document.getElementById('clk');
 const keys=()=>{Kk.innerHTML=K1.map(k=>{let l=k[0];if(alt&&ALT[l])l=ALT[l];if(k[0]==='DEG')l=deg?'DEG':'RAD';return '<button class="'+(k[1]||'')+(k[0]==='2nd'&&alt?' on':'')+'" data-k="'+l+'">'+l+'</button>'}).join('');
  Kk.querySelectorAll('button').forEach(b=>b.onclick=()=>press(b.dataset.k))};
 const hist=()=>{document.getElementById('clh').innerHTML=H.length?'<div class="lh"><span>آخر العمليات</span></div>'+H.slice().reverse().map((h,i)=>'<button data-h="'+(H.length-1-i)+'">'+esc(h.e)+' = <b>'+esc(h.r)+'</b></button>').join(''):'';
  document.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{ex=H[+b.dataset.h].e;done=false;show()})};
 const show=()=>{E.textContent=ex;Rr.classList.remove('er');if(!ex){Rr.textContent=last!=null?(showF&&frac(last)||fmt(last)):'0';return}
  if(done){Rr.style.opacity=1;if(derr){Rr.textContent=derr;Rr.classList.add('er')}else Rr.textContent=showF&&frac(last)||fmt(last);return}
  try{const v=evaluate(ex,{deg,ans});Rr.textContent='= '+fmt(v);Rr.style.opacity=.55}catch(e){Rr.textContent='';Rr.style.opacity=1}};
 function press(k){
  if(k==='2nd'){alt=!alt;keys();return}
  if(k==='DEG'||k==='RAD'){deg=!deg;document.getElementById('clm').textContent=deg?'الزوايا بالدرجات':'الزوايا بالراديان';keys();if(done&&ex){done=false}show();return}
  if(k==='AC'){ex='';done=false;last=null;showF=false;show();return}
  if(k==='⌫'){if(done){done=false}else{const m=ex.match(/(asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|log\(|ln\(|abs\(|√\(|∛\(|Ans|.)$/);ex=m?ex.slice(0,-m[0].length):''}show();return}
  if(k==='='){if(!ex)return;done=true;derr=null;try{const v=evaluate(ex,{deg,ans});ans=v;last=v;H.push({e:ex,r:fmt(v)});H=H.slice(-8);try{localStorage.setItem('calch',JSON.stringify(H))}catch(e){}hist()}catch(e){derr=e.message}show();return}
  const ins=INS[k]||k;
  if(done){const op=/^[+×÷−^²³!%]/.test(ins)||ins==='E';ex=op?'Ans':'';done=false;showF=false}
  ex+=ins;if(alt&&ALT[Object.keys(ALT).find(a=>ALT[a]===k)]){alt=false;keys()}show()}
 document.getElementById('clf').onclick=()=>{showF=!showF;if(done||!ex)show();if(showF&&last!=null&&!frac(last))toast('الناتج ما إله صورة كسر بسيطة')};
 keys();hist();show()};
})();
