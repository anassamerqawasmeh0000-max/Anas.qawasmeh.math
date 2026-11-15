/* مولّد الامتحانات التلقائي — أسئلة بأرقام عشوائية (نموذج جديد كل مرة) */
(function(){
const rngOf=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const mkR=seed=>{const r=rngOf(seed);const R={r,ri:(a,b)=>a+Math.floor(r()*(b-a+1)),pk:a=>a[Math.floor(r()*a.length)],
 sh:a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}};
 R.nz=(a,b)=>{let v=0;while(!v)v=R.ri(a,b);return v};return R};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
const M=l=>'<span class="m" dir="ltr" style="unicode-bidi:isolate">'+katex.renderToString(String(l),{throwOnError:false})+'</span>';
const N=x=>String(x).replace('-','-');
const P=x=>x<0?'('+x+')':String(x);
const sg=(x,first)=>first?(x<0?'-'+(-x):''+x):(x<0?'-'+(-x):'+'+x);
function fr(p,q){if(q<0){p=-p;q=-q}const g=gcd(p,q);p/=g;q/=g;if(q===1)return String(p);return (p<0?'-':'')+'\\frac{'+Math.abs(p)+'}{'+q+'}'}
function term(c,v,first){ // c*v
 const a=Math.abs(c);let s=(a===1&&v)?'':String(a);s+=v||'';if(!v)s=String(a);
 return (c<0?'-':(first?'':'+'))+s}
function poly(cs,v){v=v||'x';const n=cs.length-1;let s='';cs.forEach((c,i)=>{if(!c)return;const d=n-i;const vv=d===0?'':d===1?v:v+'^{'+d+'}';s+=term(c,vv,!s)});return s||'0'}
function evl(cs,x){const n=cs.length-1,X=x<0?'('+x+')':String(x);let o='';cs.forEach((c,i)=>{if(!c)return;const d=n-i,ab=Math.abs(c);let t=(ab===1&&d>0)?'':String(ab)+(d>0?'\\cdot ':'');if(d>0)t+=X+(d>1?'^{'+d+'}':'');o+=(c<0?'-':(o?'+':''))+t});return o||'0'}
const eqfr=(p,q)=>{const r=fr(p,q),w='\\frac{'+p+'}{'+q+'}';return w===r?w:w+'='+r};
function lin2(a,b){let s='';if(a)s+=term(a,'x',!s);if(b)s+=term(b,'y',!s);return s||'0'}
const num=x=>String(x);
const L4=['a','b','c','d'];
/* يبني سؤالاً: ans ونصّ، wr قائمة مشتتات (بالترتيب)، ويختار 3 مختلفة */
function build(R,o){
 const key=s=>(typeof s==='object'?s.h:s);
 const seen=new Set([key(o.ans)]),w=[];
 for(const x of o.wr){const k=key(x);if(!seen.has(k)){seen.add(k);w.push(x)}}
 if(w.length<3)throw new Error('few');
 const pool=R.sh(w.slice(0,Math.max(3,Math.min(w.length,4)))).slice(0,3);
 const all=R.sh([o.ans].concat(pool)),ai=all.findIndex(x=>key(x)===key(o.ans));
 const opts={};all.forEach((x,i)=>{opts[L4[i]]=typeof x==='object'?x.h:M(x)});
 return {q:o.q,opts,ans:L4[ai],sol:o.sol}}
const nums=(ans,cands)=>[ans+1,ans-1,ans+2,ans-2,ans*2].reduce((a,x)=>a,[]).concat([]);
const padn=(ans,c)=>c.concat([ans+1,ans-1,ans+2,ans-2,ans+3,ans-3,ans*2]).filter(x=>Number.isFinite(x));
const T={}; // مولدات
const G=[];
const add=(g,id,t,f)=>G.push({g,id,t,f});

/* ===== الثامن ===== */
add('g8','eq1','معادلات من الدرجة الأولى',R=>{const a=R.ri(2,9),x=R.nz(-9,12),b=R.nz(-15,15),c=a*x+b;
 return build(R,{q:'حلّ المعادلة: '+M(poly([a,b])+'='+c),ans:x,wr:padn(x,[(c+b)/a,-x,c-b,x+a]).filter(v=>Number.isInteger(v)).map(num).concat([]).map(Number),
 sol:['المطلوب: إيجاد قيمة <b>x</b>.','نعزل الحد الذي فيه x: '+(b<0?'نضيف '+M(-b):'نطرح '+M(b))+' إلى الطرفين'+(b<0?'':' ')+': '+M(a+'x='+c+(b<0?'+'+(-b):'-'+b)+'='+(c-b)),'نقسم الطرفين على '+M(a)+': '+M('x=\\frac{'+(c-b)+'}{'+a+'}='+x),'نتحقق: '+M(a+'\\times'+P(x)+(b<0?'-'+(-b):'+'+b)+'='+c)+' ✓']})});
add('g8','eq2','معادلات المتغير في الطرفين',R=>{const c=R.ri(1,5),a=c+R.ri(1,5),x=R.nz(-8,9),b=R.ri(-10,10),d=b+(a-c)*x;
 return build(R,{q:'حلّ المعادلة: '+M(poly([a,b])+'='+poly([c,d])),ans:x,wr:padn(x,[-x,(d+b)/(a+c),(d-b)/(a+c),(b-d)/(a-c)]).filter(Number.isInteger),
 sol:['نجمع حدود x في طرف وحدها: نطرح '+M(term(c,'x',true))+' من الطرفين: '+M(poly([a-c,b])+'='+d),(b<0?'نضيف '+M(-b)+' للطرفين: ':b>0?'نطرح '+M(b)+' من الطرفين: ':'')+M(term(a-c,'x',true)+'='+(d-b)),(a-c===1?'':'نقسم على '+M(a-c)+': ')+M('x='+x),'نتحقق: الطرف الأول '+M(a*x+b)+' والطرف الثاني '+M(c*x+d)+' ✓']})});
add('g8','pow','قوانين الأسس',R=>{const a=R.pk([2,3,5,7]),m=R.ri(2,7),n=R.ri(2,6),k=R.ri(0,2);let q,ans,wr,sol;
 if(k===0){q=M(a+'^{'+m+'}\\times '+a+'^{'+n+'}');ans=a+'^{'+(m+n)+'}';wr=[a+'^{'+m*n+'}',(a*a)+'^{'+(m+n)+'}',a+'^{'+(m>n?m-n:m+n+1)+'}',a+'^{'+(m+n+1)+'}'];sol=['عند ضرب قوتين لهما نفس الأساس نجمع الأسس: '+M('a^m\\times a^n=a^{m+n}'),M(a+'^{'+m+'}\\times '+a+'^{'+n+'}='+a+'^{'+m+'+'+n+'}='+a+'^{'+(m+n)+'}')]}
 else if(k===1){const mm=m+n;q=M('\\frac{'+a+'^{'+mm+'}}{'+a+'^{'+n+'}}');ans=a+'^{'+m+'}';wr=[a+'^{'+(mm+n)+'}',a+'^{'+(mm*n)+'}',a+'^{'+Math.round(mm/n)+'}',a+'^{'+(m+1)+'}'];sol=['عند قسمة قوتين لهما نفس الأساس نطرح الأسس: '+M('\\frac{a^m}{a^n}=a^{m-n}'),M(a+'^{'+mm+'-'+n+'}='+a+'^{'+m+'}')]}
 else{q=M('('+a+'^{'+m+'})^{'+n+'}');ans=a+'^{'+m*n+'}';wr=[a+'^{'+(m+n)+'}',a+'^{'+(m*n+1)+'}',a+'^{'+(m*n-1)+'}',(a*n)+'^{'+m+'}'];sol=['عند رفع قوة لقوة نضرب الأسس: '+M('(a^m)^n=a^{m\\times n}'),M('('+a+'^{'+m+'})^{'+n+'}='+a+'^{'+m+'\\times '+n+'}='+a+'^{'+m*n+'}')]}
 return build(R,{q:'اكتب الناتج على صورة قوة واحدة: '+q,ans,wr,sol})});
add('g8','sci','الصيغة العلمية',R=>{const ds=String(R.ri(101,999)),mant=ds[0]+'.'+ds.slice(1),e=R.pk([3,4,5,6,7,8,-3,-4,-5,-6]);let nm;
 if(e>0)nm=ds+'0'.repeat(e-2);else nm='0.'+'0'.repeat(-e-1)+ds;
 const g=nm.includes('.')?nm:nm.replace(/\B(?=(\d{3})+(?!\d))/g,'\\,');
 return build(R,{q:'اكتب العدد '+M(g)+' بالصيغة العلمية:',ans:mant+'\\times10^{'+e+'}',wr:[mant+'\\times10^{'+(e+1)+'}',mant+'\\times10^{'+(e-1)+'}',mant+'\\times10^{'+(-e)+'}',ds[0]+ds[1]+'.'+ds[2]+'\\times10^{'+(e-1)+'}'],
 sol:['الصيغة العلمية: '+M('a\\times10^n')+' حيث '+M('1\\le a<10')+'.','نحرّك الفاصلة العشرية لتصير بعد الرقم '+M(ds[0])+' فنحصل على '+M(mant)+'.','عدد الخانات التي حرّكنا الفاصلة بها هو '+M(Math.abs(e))+(e>0?' (العدد كبير فالأس موجب).':' (العدد صغير فالأس سالب).'),'الجواب: '+M(mant+'\\times10^{'+e+'}')]})});
add('g8','pyth','نظرية فيثاغورس',R=>{const tr=R.pk([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10]]),k=R.pk([1,1,2,3]);let [a,b,c]=tr.map(x=>x*k);if(tr[2]===10&&k>1){a=3*k;b=4*k;c=5*k}
 if(R.r()<.55)return build(R,{q:'مثلث قائم الزاوية طولا ضلعيه القائمين '+M(a)+' سم و'+M(b)+' سم. جد طول الوتر (بالسم):',ans:c,wr:padn(c,[a+b,b-a,a*b/ (k||1)]).filter(Number.isInteger),
  sol:['نظرية فيثاغورس: '+M('c^2=a^2+b^2'),M('c^2='+a+'^2+'+b+'^2='+a*a+'+'+b*b+'='+c*c),M('c=\\sqrt{'+c*c+'}='+c)+' سم']});
 return build(R,{q:'مثلث قائم الزاوية طول وتره '+M(c)+' سم وطول أحد ضلعيه القائمين '+M(a)+' سم. جد طول الضلع القائم الآخر (بالسم):',ans:b,wr:padn(b,[c-a,c+a,a+c-1]).filter(Number.isInteger),
  sol:['نظرية فيثاغورس: '+M('c^2=a^2+b^2')+' فيكون '+M('b^2=c^2-a^2'),M('b^2='+c+'^2-'+a+'^2='+c*c+'-'+a*a+'='+b*b),M('b=\\sqrt{'+b*b+'}='+b)+' سم']})});
add('g8','circ','الدائرة: المساحة والمحيط',R=>{const r=R.ri(2,15),ar=R.r()<.5;
 return build(R,{q:'دائرة طول نصف قطرها '+M(r)+' سم. جد '+(ar?'مساحتها':'محيطها')+' بدلالة '+M('\\pi')+':',ans:ar?r*r+'\\pi':2*r+'\\pi',wr:ar?[2*r+'\\pi',r+'\\pi',2*r*r+'\\pi',r*r*r+'\\pi']:[r*r+'\\pi',r+'\\pi',4*r+'\\pi',2*r*r+'\\pi'],
 sol:ar?['مساحة الدائرة: '+M('A=\\pi r^2'),M('A=\\pi\\times'+r+'^2='+r*r+'\\pi')+' سم²']:['محيط الدائرة: '+M('C=2\\pi r'),M('C=2\\times'+r+'\\pi='+2*r+'\\pi')+' سم']})});
add('g8','pct','النسبة المئوية',R=>{let p,d;do{p=R.pk([40,60,80,120,150,200,250,300,400,500]);d=R.pk([10,20,25,30,40,50])}while((p*d)%100);const dis=p*d/100,up=R.r()<.4;
 return build(R,{q:up?'سعر سلعة '+M(p)+' دينارًا، ارتفع سعرها بنسبة '+M(d+'\\%')+'. ما سعرها الجديد (بالدينار)؟':'سعر سلعة '+M(p)+' دينارًا، وقد خُفّض سعرها بنسبة '+M(d+'\\%')+'. ما سعرها بعد التخفيض (بالدينار)؟',ans:up?p+dis:p-dis,
  wr:up?[dis,p-dis,p+d,p*d]:[dis,p+dis,p-d,p*d],sol:['مقدار التغيير = '+M('\\frac{'+d+'}{100}\\times'+p+'='+dis)+' دينار.',up?'السعر الجديد = '+M(p+'+'+dis+'='+(p+dis)):'السعر بعد التخفيض = '+M(p+'-'+dis+'='+(p-dis))]})});
add('g8','like','تبسيط المقادير الجبرية',R=>{let a,b,c,d,s,t;do{a=R.nz(-7,9);b=R.nz(-7,9);c=R.nz(-7,9);d=R.nz(-7,9);s=a+c;t=b+d}while(!s||!t||s===a||t===b);
 const ex=lin2(a,b)+term(c,'x',false)+term(d,'y',false);
 return build(R,{q:'بسّط المقدار: '+M(ex),ans:lin2(s,t),wr:[lin2(a-c,b-d),lin2(a+c,b-d),lin2(a-c,b+d),lin2(s,-t),lin2(-s,t)],
  sol:['نجمع الحدود المتشابهة (التي فيها '+M('x')+' معًا والتي فيها '+M('y')+' معًا).',M('x')+': '+M(a+(c<0?'':'+')+c+'='+s).replace(/^/,''),M('y')+': '+M(b+(d<0?'':'+')+d+'='+t),'الناتج: '+M(lin2(s,t))]})});
add('g8','stat','الوسط الحسابي والوسيط',R=>{if(R.r()<.5){const a=[R.ri(2,20),R.ri(2,20),R.ri(2,20),R.ri(2,20)],s=a.reduce((x,y)=>x+y,0),m=R.ri(5,18);let l=m*5-s;if(l<1||l>40){a[0]+=0;l=m*5-s;if(l<1){return T.retry}}
  const arr=a.concat([l]);const mean=m;return build(R,{q:'جد الوسط الحسابي للقيم: '+M(R.sh(arr).join(',\\ ')),ans:mean,wr:padn(mean,[Math.max(...arr),Math.min(...arr),arr.reduce((x,y)=>x+y,0)]),sol:['الوسط الحسابي = مجموع القيم ÷ عددها.','المجموع = '+M(arr.join('+')+'='+mean*5),'الوسط = '+M('\\frac{'+mean*5+'}{5}='+mean)]})}
 const set=new Set();while(set.size<7)set.add(R.ri(3,40));const arr=[...set],so=arr.slice().sort((x,y)=>x-y),med=so[3];
 return build(R,{q:'جد الوسيط للقيم: '+M(arr.join(',\\ ')),ans:med,wr:[arr[3],Math.round(so.reduce((x,y)=>x+y,0)/7),so[2],so[4],so[6]],sol:['نرتّب القيم تصاعديًا: '+M(so.join(',\\ ')),'عددها '+M(7)+' (فردي) فالوسيط هو القيمة الوسطى (الرابعة): '+M(med)]})});
add('g8','vol','المساحة والحجم',R=>{const a=R.ri(2,12),b=R.ri(2,10),c=R.ri(2,9);
 return build(R,{q:'متوازي مستطيلات أبعاده '+M(a)+' سم و'+M(b)+' سم و'+M(c)+' سم. جد حجمه (بالسم³):',ans:a*b*c,wr:[2*(a*b+a*c+b*c),a+b+c,4*(a+b+c),a*b+c],
  sol:['حجم متوازي المستطيلات = الطول × العرض × الارتفاع.',M('V='+a+'\\times'+b+'\\times'+c+'='+a*b*c)+' سم³']})});
add('g8','ratio','النسبة والتناسب',R=>{const a=R.ri(2,6);let b=R.ri(2,9);if(b===a)b++;const k=R.ri(2,7),c=a*k,x=b*k;
 return build(R,{q:'إذا كانت '+M(a+':'+b+'='+c+':x')+' فإن '+M('x')+' تساوي:',ans:x,wr:padn(x,[c+b-a,c-a+b,a*b]).filter(Number.isInteger),
  sol:['نكتب النسبتين على صورة كسرين: '+M('\\frac{'+a+'}{'+b+'}=\\frac{'+c+'}{x}'),'نضرب تبادليًّا: '+M(a+'x='+b+'\\times'+c+'='+b*c),'نقسم على '+M(a)+': '+M('x='+x)]})});

/* ===== التاسع ===== */
add('g9','fact','التحليل إلى عوامل',R=>{let p,q;do{p=R.nz(-9,9);q=R.nz(-9,9)}while(p===q||p+q===0);
 const f=(u,v)=>'(x'+sg(u)+')(x'+sg(v)+')';
 return build(R,{q:'حلّل إلى العوامل: '+M(poly([1,p+q,p*q])),ans:f(p,q),wr:[f(-p,-q),f(p,-q),f(-p,q)],
  sol:['نبحث عن عددين حاصل ضربهما '+M(p*q)+' ومجموعهما '+M(p+q)+'.','العددان هما '+M(p)+' و '+M(q)+'.','الناتج: '+M(f(p,q)),'نتحقق بالتوزيع: '+M('x^2'+sg(p+q)+'x'+sg(p*q))+' ✓']})});
add('g9','quad','حل معادلة تربيعية بالتحليل',R=>{let p,q;do{p=R.nz(-9,9);q=R.nz(-9,9)}while(Math.abs(p)===Math.abs(q));
 const st=(u,v)=>{const s=[u,v].sort((a,b)=>a-b);return 'x='+s[0]+',\\ x='+s[1]};
 return build(R,{q:'جد حلّي المعادلة: '+M(poly([1,-(p+q),p*q])+'=0'),ans:st(p,q),wr:[st(-p,-q),st(p,-q),st(-p,q)],
  sol:['نحلّل: '+M('(x'+sg(-p)+')(x'+sg(-q)+')=0'),'كل عامل يساوي صفرًا: '+M('x'+sg(-p)+'=0')+' أو '+M('x'+sg(-q)+'=0'),'الحلّان: '+M(st(p,q))]})});
add('g9','disc','المميّز وعدد الجذور',R=>{let a,b,c,D;do{a=R.nz(-4,5);b=R.nz(-9,9);c=R.nz(-9,9);D=b*b-4*a*c}while(false);
 if(R.r()<.5)return build(R,{q:'جد قيمة المميّز '+M('\\Delta=b^2-4ac')+' للمعادلة: '+M(poly([a,b,c])+'=0'),ans:D,wr:padn(D,[b*b+4*a*c,4*a*c-b*b,b*b-2*a*c,b*b-4*a*Math.abs(c)]),
  sol:['نحدّد المعاملات: '+M('a='+a+',\\ b='+b+',\\ c='+c),M('\\Delta='+P(b)+'^2-4\\cdot'+P(a)+'\\cdot'+P(c)+'='+b*b+(4*a*c>0?'-':'+')+Math.abs(4*a*c)+'='+D)]});
 const o=['جذران حقيقيان مختلفان','جذر حقيقي واحد (مكرر)','لا يوجد جذور حقيقية','عدد لا نهائي من الجذور'].map(h=>({h}));
 const k=D>0?0:D===0?1:2;
 return build(R,{q:'ما عدد الجذور الحقيقية للمعادلة '+M(poly([a,b,c])+'=0')+'؟',ans:o[k],wr:o.filter((_,i)=>i!==k),
  sol:[M('\\Delta=b^2-4ac='+P(b)+'^2-4\\cdot'+P(a)+'\\cdot'+P(c)+'='+D),D>0?'المميّز موجب إذن للمعادلة جذران حقيقيان مختلفان.':D===0?'المميّز يساوي صفرًا إذن للمعادلة جذر حقيقي واحد مكرّر.':'المميّز سالب إذن لا يوجد جذور حقيقية.']})});
add('g9','slope','ميل المستقيم',R=>{let x1,y1,x2,y2,dx,dy;do{x1=R.ri(-6,6);y1=R.ri(-6,6);x2=R.ri(-6,6);y2=R.ri(-6,6);dx=x2-x1;dy=y2-y1}while(!dx||!dy||Math.abs(dx)===Math.abs(dy));
 return build(R,{q:'جد ميل المستقيم المار بالنقطتين '+M('A('+x1+','+y1+')')+' و '+M('B('+x2+','+y2+')')+':',ans:fr(dy,dx),wr:[fr(dx,dy),fr(-dy,dx),fr(-dx,dy),fr(dy+dx,dx)],
  sol:['الميل = '+M('\\frac{y_2-y_1}{x_2-x_1}'),M('m=\\frac{'+P(y2)+'-'+P(y1)+'}{'+P(x2)+'-'+P(x1)+'}=\\frac{'+dy+'}{'+dx+'}='+fr(dy,dx))]})});
add('g9','line','معادلة المستقيم',R=>{const m=R.nz(-5,5),x1=R.ri(-5,5),y1=R.ri(-8,8),b=y1-m*x1;
 const f=(mm,bb)=>'y='+poly([mm,bb]);
 return build(R,{q:'جد معادلة المستقيم المار بالنقطة '+M('('+x1+','+y1+')')+' وميله '+M(m)+':',ans:f(m,b),wr:[f(m,-b),f(-m,b),f(m,y1+m*x1),f(m,y1),f(m,b+1)],
  sol:['نستخدم صيغة الميل ونقطة: '+M('y-y_1=m(x-x_1)'),M('y-'+P(y1)+'='+m+'(x-'+P(x1)+')'),'نفك الأقواس ونرتّب: '+M(f(m,b))]})});
add('g9','dist','المسافة بين نقطتين',R=>{const t=R.pk([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]),k=R.pk([1,1,2]),sx=R.pk([1,-1]),sy=R.pk([1,-1]),dx=t[0]*k*sx,dy=t[1]*k*sy,x1=R.ri(-5,5),y1=R.ri(-5,5),x2=x1+dx,y2=y1+dy,d=t[2]*k;
 return build(R,{q:'جد المسافة بين النقطتين '+M('A('+x1+','+y1+')')+' و '+M('B('+x2+','+y2+')')+':',ans:d,wr:padn(d,[Math.abs(dx)+Math.abs(dy),d*d,Math.abs(dx*dy)]),
  sol:['صيغة المسافة: '+M('d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}'),M('d=\\sqrt{'+P(dx)+'^2+'+P(dy)+'^2}=\\sqrt{'+dx*dx+'+'+dy*dy+'}=\\sqrt{'+d*d+'}='+d)]})});
add('g9','mid','نقطة المنتصف',R=>{const x1=R.ri(-8,8),y1=R.ri(-8,8),x2=x1+2*R.nz(-5,5),y2=y1+2*R.nz(-5,5),mx=(x1+x2)/2,my=(y1+y2)/2;
 const f=(a,b)=>'('+a+','+b+')';
 return build(R,{q:'جد إحداثيات نقطة منتصف القطعة الواصلة بين '+M('A('+x1+','+y1+')')+' و '+M('B('+x2+','+y2+')')+':',ans:f(mx,my),wr:[f(x1+x2,y1+y2),f(mx,y1+y2),f((x2-x1)/2,(y2-y1)/2),f(my,mx)],
  sol:['نقطة المنتصف = '+M('\\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2}\\right)'),M('\\left(\\frac{'+P(x1)+'+'+P(x2)+'}{2},\\frac{'+P(y1)+'+'+P(y2)+'}{2}\\right)='+f(mx,my))]})});
add('g9','rad','تبسيط الجذور',R=>{const k=R.ri(2,9),m=R.pk([2,3,5,6,7]);
 return build(R,{q:'بسّط: '+M('\\sqrt{'+k*k*m+'}'),ans:k+'\\sqrt{'+m+'}',wr:[m+'\\sqrt{'+k+'}',k*k+'\\sqrt{'+m+'}','\\sqrt{'+k*m+'}',(k+m)+'\\sqrt{'+m+'}'],
  sol:['نحلّل العدد إلى مربع كامل × عدد: '+M(k*k*m+'='+k*k+'\\times'+m),M('\\sqrt{'+k*k+'\\times'+m+'}=\\sqrt{'+k*k+'}\\times\\sqrt{'+m+'}='+k+'\\sqrt{'+m+'}')]})});
add('g9','sys','نظام معادلتين خطيتين',R=>{let x,y;do{x=R.nz(-6,8);y=R.nz(-6,8)}while(Math.abs(x)===Math.abs(y));const p=R.pk([1,2,3]);
 const f=(a,b)=>'('+a+','+b+')';
 return build(R,{q:'جد حلّ النظام: '+M('\\begin{cases}'+(p===1?'x':p+'x')+'+y'+'='+(p*x+y)+'\\\\ x-y='+(x-y)+'\\end{cases}'),ans:f(x,y),wr:[f(y,x),f(x,-y),f(-x,y),f(-x,-y)],
  sol:['نجمع المعادلتين لنحذف '+M('y')+': '+M((p+1)+'x='+(p*x+y+x-y)),M('x='+x),'نعوّض في '+M('x-y='+(x-y))+': '+M(x+'-y='+(x-y))+' فيكون '+M('y='+y),'الحل: '+M(f(x,y))]})});
add('g9','exp','فك الأقواس والتوزيع',R=>{const a=R.ri(2,6),b=R.nz(-9,9);
 return build(R,{q:'ما ناتج فك المقدار '+M('('+poly([a,b])+')^2')+'؟',ans:poly([a*a,2*a*b,b*b]),wr:[poly([a*a,0,b*b]),poly([a*a,a*b,b*b]),poly([a*a,2*a*b,-b*b]),poly([a,2*a*b,b*b])],
  sol:['نستخدم '+M('(u+v)^2=u^2+2uv+v^2')+' حيث '+M('u='+term(a,'x',true))+' و '+M('v='+b),M('u^2='+a*a+'x^2')+'، '+M('2uv='+2*a*b+'x')+'، '+M('v^2='+b*b),'الناتج: '+M(poly([a*a,2*a*b,b*b]))]})});
add('g9','ineq','المتباينات الخطية',R=>{let a,k,b,c,rel;do{a=R.nz(-6,6);k=R.nz(-7,7)}while(Math.abs(a)===1);b=R.ri(-9,9);c=a*k+b;rel=R.pk(['>','<','\\ge','\\le']);
 const flip={'>':'<','<':'>','\\ge':'\\le','\\le':'\\ge'},fin=a>0?rel:flip[rel];
 return build(R,{q:'حلّ المتباينة: '+M(poly([a,b])+rel+c),ans:'x'+fin+k,wr:['x'+flip[fin]+k,'x'+fin+(-k),'x'+flip[fin]+(-k),'x'+fin+(k+1)],
  sol:['نعزل '+M('x')+': '+(b<0?'نضيف '+M(-b)+' إلى الطرفين':b>0?'نطرح '+M(b)+' من الطرفين':'')+': '+M(term(a,'x',true)+rel+(c-b)),'نقسم على '+M(a)+(a<0?' <b>فتنعكس إشارة المتباينة</b> لأن العدد سالب':'')+'.','الحل: '+M('x'+fin+k)]})});
add('g9','trig','النسب المثلثية',R=>{const t=R.pk([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),k=R.pk([1,2]),a=t[0]*k,b=t[1]*k,c=t[2]*k,w=R.pk(['sin','cos','tan']);
 const ans={sin:fr(a,c),cos:fr(b,c),tan:fr(a,b)}[w];
 const c4=[fr(a,c),fr(b,c),fr(a,b),fr(b,a),fr(c,a)];
 return build(R,{q:'في المثلث '+M('ABC')+' القائم الزاوية في '+M('B')+' فيه '+M('AB='+b)+' و '+M('BC='+a)+' و '+M('AC='+c)+'. جد '+M('\\'+w+' A')+':',ans,wr:c4,
  sol:['الزاوية '+M('A')+': المقابل لها '+M('BC='+a)+'، المجاور '+M('AB='+b)+'، والوتر '+M('AC='+c)+'.',w==='sin'?M('\\sin A=\\frac{\\text{}}{}').replace(/.*/,M('\\sin A=\\frac{BC}{AC}='+eqfr(a,c))):w==='cos'?M('\\cos A=\\frac{AB}{AC}='+eqfr(b,c)):M('\\tan A=\\frac{BC}{AB}='+eqfr(a,b))]})});
add('g9','negexp','الأسس الصفرية والسالبة',R=>{const b=R.pk([2,3,4,5,10]),n=R.pk([2,3]);if(R.r()<.3)return build(R,{q:'جد قيمة: '+M(b+'^0+'+b+'^1'),ans:String(1+b),wr:[String(b),String(2*b),'0',String(b*b)],sol:['أي عدد غير الصفر مرفوع للأس صفر يساوي '+M(1)+'.',M(b+'^0='+1+',\\ '+b+'^1='+b),'المجموع '+M(1+b)]});
 return build(R,{q:'جد قيمة: '+M(b+'^{-'+n+'}'),ans:'\\frac{1}{'+Math.pow(b,n)+'}',wr:['-'+Math.pow(b,n),'-\\frac{1}{'+Math.pow(b,n)+'}',String(Math.pow(b,n)),'\\frac{1}{'+b*n+'}'],
  sol:['الأس السالب يعني مقلوب القوة: '+M('a^{-n}=\\frac{1}{a^n}'),M(b+'^{-'+n+'}=\\frac{1}{'+b+'^{'+n+'}}=\\frac{1}{'+Math.pow(b,n)+'}')]})});

/* ===== أول ثانوي ===== */
add('f3','vertex','رأس القطع المكافئ',R=>{const a=R.pk([1,2,-1,-2,3]),h=R.nz(-5,5),b=-2*a*h,c=R.ri(-8,8),k=c-a*h*h;if(!k||k===c)return T.retry;
 const f=(x,y)=>'('+x+','+y+')';
 return build(R,{q:'جد إحداثيات رأس منحنى الاقتران '+M('f(x)='+poly([a,b,c])),ans:f(h,k),wr:[f(-h,k),f(h,c),f(h,-k),f(-h,-k)],
  sol:['الإحداثي السيني للرأس: '+M('x=\\frac{-b}{2a}=\\frac{'+(-b)+'}{'+2*a+'}='+h),'الإحداثي الصادي: '+M('f('+h+')='+evl([a,b,c],h)+'='+k),'الرأس: '+M(f(h,k))]})});
add('f3','domsq','مجال اقتران الجذر التربيعي',R=>{let a,k;do{a=R.pk([1,2,3,-1,-2,-3]);k=R.nz(-6,6)}while(false);const b=-a*k;
 const gt=a>0,I=(kk)=>'['+kk+',\\infty)',J=(kk)=>'(-\\infty,'+kk+']';
 return build(R,{q:'جد مجال الاقتران '+M('f(x)=\\sqrt{'+poly([a,b])+'}')+':',ans:gt?I(k):J(k),wr:[gt?'('+k+',\\infty)':'(-\\infty,'+k+')',gt?J(k):I(k),gt?I(-k):J(-k),'\\mathbb{R}'],
  sol:['يجب أن يكون ما تحت الجذر أكبر من أو يساوي صفرًا: '+M(poly([a,b])+'\\ge0'),M(term(a,'x',true)+'\\ge'+(-b)),'نقسم على '+M(a)+(a<0?' (فتنعكس الإشارة)':'')+': '+M('x'+(gt?'\\ge':'\\le')+k),'المجال: '+M(gt?I(k):J(k))]})});
add('f3','domrat','مجال الاقتران النسبي',R=>{const r=R.ri(2,7),a=R.nz(-4,4),b=R.nz(-6,6);
 return build(R,{q:'جد مجال الاقتران '+M('f(x)=\\frac{'+poly([a,b])+'}{x^2-'+r*r+'}')+':',ans:'\\mathbb{R}\\setminus\\{-'+r+','+r+'\\}',wr:['\\mathbb{R}\\setminus\\{'+r+'\\}','\\mathbb{R}\\setminus\\{'+r*r+'\\}','\\mathbb{R}','\\mathbb{R}\\setminus\\{0\\}'],
  sol:['المقام لا يجوز أن يساوي صفرًا: '+M('x^2-'+r*r+'\\ne0'),M('(x-'+r+')(x+'+r+')\\ne0')+' فيكون '+M('x\\ne'+r)+' و '+M('x\\ne-'+r),'المجال: '+M('\\mathbb{R}\\setminus\\{-'+r+','+r+'\\}')]})});
add('f3','fval','قيمة الاقتران والتركيب',R=>{const a=R.nz(-3,3),b=R.nz(-5,5),c=R.nz(-6,6),m=R.nz(-3,3),n=R.nz(-5,5),k=R.ri(-3,3);const F=x=>a*x*x+b*x+c,Gg=x=>m*x+n;
 if(R.r()<.45)return build(R,{q:'إذا كان '+M('f(x)='+poly([a,b,c]))+'، فجد '+M('f('+k+')')+':',ans:F(k),wr:padn(F(k),[F(-k),a*k+b*k+c,a*k*k+b+c]).filter(Number.isFinite),
  sol:['نعوّض '+M('x='+k)+' في الاقتران:',M('f('+k+')='+evl([a,b,c],k)+'='+F(k))]});
 return build(R,{q:'إذا كان '+M('f(x)='+poly([a,b,c]))+' و '+M('g(x)='+poly([m,n]))+'، فجد '+M('(f\\circ g)('+k+')')+':',ans:F(Gg(k)),wr:padn(F(Gg(k)),[Gg(F(k)),F(k)+Gg(k),F(k)*Gg(k)]),
  sol:['أولًا نجد '+M('g('+k+')='+evl([m,n],k)+'='+Gg(k)),'ثم نعوّض الناتج في '+M('f')+': '+M('f('+Gg(k)+')='+evl([a,b,c],Gg(k))+'='+F(Gg(k)))]})});
add('f3','arith','المتتاليات الحسابية',R=>{const a1=R.ri(-5,12),d=R.nz(-6,7),n=R.ri(6,15),an=a1+(n-1)*d;
 if(R.r()<.5)return build(R,{q:'متتالية حسابية حدّها الأول '+M(a1)+' وأساسها '+M(d)+'. جد الحد '+M('a_{'+n+'}')+':',ans:an,wr:padn(an,[a1+n*d,a1+(n-2)*d,a1*n*d]).filter(Number.isFinite),
  sol:['قانون الحد النوني: '+M('a_n=a_1+(n-1)d'),M('a_{'+n+'}='+a1+'+('+n+'-1)('+P(d)+')='+a1+'+'+(n-1)*d+'='+an)]});
 const S=n*(a1+an)/2;return build(R,{q:'متتالية حسابية حدّها الأول '+M(a1)+' وأساسها '+M(d)+'. جد مجموع أول '+M(n)+' حدًّا:',ans:S,wr:padn(S,[n*(a1+an),n*(2*a1+n*d)/2,S+n]).filter(Number.isFinite),
  sol:['أولًا نجد الحد الأخير: '+M('a_{'+n+'}='+a1+'+('+n+'-1)('+P(d)+')='+an),'مجموع الحدود: '+M('S_n=\\frac{n}{2}(a_1+a_n)'),M('S_{'+n+'}=\\frac{'+n+'}{2}('+a1+'+'+P(an)+')='+S)]})});
add('f3','geom','المتتاليات الهندسية',R=>{const a1=R.pk([1,2,3,5]),r=R.pk([2,3,-2]),n=R.ri(4,7),an=a1*Math.pow(r,n-1);
 return build(R,{q:'متتالية هندسية حدّها الأول '+M(a1)+' وأساسها '+M(r)+'. جد الحد '+M('a_{'+n+'}')+':',ans:an,wr:[a1*Math.pow(r,n),a1*n*r,a1+(n-1)*r,Math.pow(a1*r,n-1)],
  sol:['قانون الحد النوني للهندسية: '+M('a_n=a_1\\,r^{\\,n-1}'),M('a_{'+n+'}='+a1+'\\times'+P(r)+'^{'+(n-1)+'}='+a1+'\\times'+P(Math.pow(r,n-1))+'='+an)]})});
add('f3','abs','المعادلات المطلقة',R=>{const a=R.pk([1,2,3,-2]),x1=R.nz(-7,8);let c=R.ri(2,9),b;let x2=(-2*0);
 // |ax+b|=c  => x=(c-b)/a , (-c-b)/a ; choose b so both integer
 b=R.ri(-8,8);const s1=(c-b)/a,s2=(-c-b)/a;if(!Number.isInteger(s1)||!Number.isInteger(s2)||s1===s2)return T.retry;
 const st=(u,v)=>{const s=[u,v].sort((p,q)=>p-q);return '\\{'+s[0]+',\\ '+s[1]+'\\}'};
 return build(R,{q:'جد مجموعة حل المعادلة '+M('|'+poly([a,b])+'|='+c)+':',ans:st(s1,s2),wr:['\\{'+s1+'\\}','\\{'+s2+'\\}',st(-s1,-s2),'\\varnothing',st(s1+1,s2-1)],
  sol:['القيمة المطلقة تعني حالتين: '+M(poly([a,b])+'='+c)+' أو '+M(poly([a,b])+'=-'+c),'الحالة الأولى: '+M('x='+s1),'الحالة الثانية: '+M('x='+s2),'مجموعة الحل: '+M(st(s1,s2))]})});
add('f3','inv','الاقتران العكسي',R=>{const a=R.pk([2,3,4,5]),b=R.nz(-9,9);
 return build(R,{q:'جد الاقتران العكسي للاقتران '+M('f(x)='+poly([a,b])),ans:'f^{-1}(x)=\\frac{'+poly([1,-b])+'}{'+a+'}',wr:['f^{-1}(x)=\\frac{'+poly([1,b])+'}{'+a+'}','f^{-1}(x)='+poly([a,-b]),'f^{-1}(x)=\\frac{'+a+'}{'+poly([1,-b])+'}','f^{-1}(x)=\\frac{'+poly([1,-b])+'}{'+(-a)+'}'],
  sol:['نكتب '+M('y='+poly([a,b])),'نبدّل '+M('x')+' و '+M('y')+': '+M('x='+poly([a,b],'y')),'نحلّ لـ '+M('y')+': '+M(a+'y=x'+sg(-b))+' فيكون '+M('y=\\frac{'+poly([1,-b])+'}{'+a+'}')]})});
add('f3','radian','الزوايا بالراديان',R=>{const ds=[30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360],d=R.pk(ds),f=x=>{const g=gcd(x,180),p=x/g,q=180/g;return (p===1?'':String(p))+'\\pi'+(q===1?'':'').replace('','')};
 const rad=x=>{const g=gcd(x,180),p=x/g,q=180/g;const top=(p===1?'':p)+'\\pi';return q===1?top:'\\frac{'+top+'}{'+q+'}'};
 const o=R.sh(ds.filter(x=>x!==d)).slice(0,5);
 return build(R,{q:'حوّل الزاوية '+M(d+'^\\circ')+' إلى راديان:',ans:rad(d),wr:o.map(rad),sol:['نضرب بـ '+M('\\frac{\\pi}{180}')+': '+M(d+'\\times\\frac{\\pi}{180}='+rad(d))]})});
add('f3','sumprod','مجموع الجذور وحاصل ضربها',R=>{const a=R.pk([1,2,3,4,5]),b=R.nz(-9,9),c=R.nz(-9,9),su=R.r()<.5;
 return build(R,{q:'للمعادلة '+M(poly([a,b,c])+'=0')+' جذران، جد '+(su?'مجموعهما':'حاصل ضربهما')+':',ans:su?fr(-b,a):fr(c,a),wr:su?[fr(b,a),fr(c,a),fr(-c,a),fr(-b,2*a)]:[fr(-c,a),fr(b,a),fr(-b,a),fr(c,2*a)],
  sol:['نحدّد '+M('a='+a+',\\ b='+b+',\\ c='+c),su?'مجموع الجذرين = '+M('\\frac{-b}{a}='+eqfr(-b,a)):'حاصل ضرب الجذرين = '+M('\\frac{c}{a}='+eqfr(c,a))]})});
add('f3','qineq','المتباينات التربيعية',R=>{let p,q;do{p=R.ri(-7,6);q=R.ri(-6,8)}while(q<=p+1);const rel=R.pk(['>','<','\\ge','\\le']);
 const o={A:'('+p+','+q+')',B:'(-\\infty,'+p+')\\cup('+q+',\\infty)',C:'['+p+','+q+']',D:'(-\\infty,'+p+']\\cup['+q+',\\infty)'},k={'<':'A','>':'B','\\le':'C','\\ge':'D'}[rel];
 const e='(x'+sg(-p)+')(x'+sg(-q)+')';
 return build(R,{q:'حلّ المتباينة: '+M(e+rel+'0'),ans:o[k],wr:Object.keys(o).filter(z=>z!==k).map(z=>o[z]),
  sol:['جذرا المقدار: '+M('x='+p)+' و '+M('x='+q)+' فيقسمان خط الأعداد إلى ثلاث فترات.','نحدّد إشارة المقدار: هو '+(rel==='<'||rel==='\\le'?'سالب ':'موجب ')+(rel==='<'||rel==='\\le'?'بين الجذرين':'خارج الجذرين')+'، '+(rel==='\\le'||rel==='\\ge'?'والجذران يدخلان في الحل لأن الإشارة فيها «يساوي».':'والجذران لا يدخلان في الحل لأن الإشارة بدون «يساوي».'),'الحل: '+M(o[k])]})});
add('f3','perp','الميل المتعامد',R=>{const m=R.pk([2,3,4,5,-2,-3,-4,-5]);
 return build(R,{q:'ما ميل المستقيم العمودي على المستقيم '+M('y='+poly([m,R.nz(-6,6)]))+'؟',ans:fr(-1,m),wr:[fr(1,m),String(m),String(-m),fr(-1,m*m)],
  sol:['ميل المستقيم المعطى '+M('m_1='+m)+'.','للعمودي: '+M('m_1\\times m_2=-1'),M('m_2=\\frac{-1}{'+P(m)+'}='+fr(-1,m))]})});
add('f3','log','اللوغاريتمات',R=>{const b=R.pk([2,3,5,10]),n=R.ri(2,4),v=Math.pow(b,n);
 if(R.r()<.5)return build(R,{q:'جد قيمة: '+M('\\log_{'+b+'}'+v),ans:n,wr:[b*n,v/b,n+1,n-1,v-b],sol:['نسأل: '+M(b)+' مرفوعة لأي أس تعطي '+M(v)+'؟',M(b+'^{'+n+'}='+v)+' فإذن '+M('\\log_{'+b+'}'+v+'='+n)]});
 return build(R,{q:'جد قيمة '+M('x')+' إذا كان '+M('\\log_{'+b+'}x='+n),ans:v,wr:[b*n,n*n,Math.pow(n,b),v+b,v-b],sol:['نحوّل إلى الصيغة الأسية: '+M('x='+b+'^{'+n+'}'),M('x='+v)]})});
add('f3','rem','نظرية الباقي',R=>{const a=R.pk([1,2]),b=R.nz(-4,4),c=R.nz(-6,6),d=R.nz(-9,9),r=R.nz(-3,3),pv=x=>a*x*x*x+b*x*x+c*x+d,pr=pv(r);
 return build(R,{q:'جد باقي قسمة '+M('p(x)='+poly([a,b,c,d]))+' على '+M('(x'+sg(-r)+')')+':',ans:pr,wr:padn(pr,[pv(-r),d,pv(r)+d]).filter(Number.isFinite),
  sol:['نظرية الباقي: باقي قسمة '+M('p(x)')+' على '+M('(x-a)')+' هو '+M('p(a)')+'.',M('a='+r),M('p('+r+')='+evl([a,b,c,d],r)+'='+pr)]})});

/* ===== بناء الامتحان ===== */
const TOPICS=g=>G.filter(x=>x.g===g).map(x=>({id:x.id,t:x.t}));
function gen(g,topics,count,seed){
 let pool=G.filter(x=>x.g===g&&(!topics||!topics.length||topics.includes(x.id)));
 if(!pool.length)pool=G.filter(x=>x.g===g);
 const R0=mkR(seed*7919+3),order=[];while(order.length<count)R0.sh(pool).forEach(x=>{if(order.length<count)order.push(x)});
 const out=[];
 order.forEach((t,i)=>{let q=null,tries=0;while(!q&&tries<40){tries++;const R=mkR(seed*100003+i*977+tries*31);try{const r=t.f(R);if(r&&r!==T.retry)q=r}catch(e){}}
  if(!q)return;q.n=out.length+1;q.marks=1;q.key='GEN-'+g+'-'+t.id+':'+seed+'-'+i;q.topic=t.t;out.push(q)});
 return out}
window.GEN={topics:TOPICS,gen,_all:G,_T:T};
})();
