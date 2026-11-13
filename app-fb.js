/* الاتصال بالخادم: الحسابات + الأسئلة المحمية + المراقبة */
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,collection,getDocs,addDoc,query,orderBy,limit,onSnapshot} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const cfg={apiKey:"AIzaSyCM2ekbZQfb0zt1Z_gJwBH8URbEAnWT7J0",authDomain:"alraed-math-anas-qawasmeh.firebaseapp.com",projectId:"alraed-math-anas-qawasmeh",storageBucket:"alraed-math-anas-qawasmeh.firebasestorage.app",messagingSenderId:"690420503815",appId:"1:690420503815:web:177d4a289c4496fd6161a2"};
const ADMIN='anassamerqawasmeh0000@gmail.com';
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);

let state={stage:'loading'},subs=[],unsubProf=null,pend=null,creating=false,pingT=null;
const emit=()=>subs.forEach(f=>{try{f(state)}catch(e){console.error(e)}});

async function mkProfile(u){
  if(creating)return;creating=true;
  const p=pend||{};
  try{await setDoc(doc(db,'users',u.uid),{name:(p.name||u.email.split('@')[0]).slice(0,60),phone:(p.phone||'').slice(0,20),email:u.email,status:'pending',createdAt:Date.now(),lastSeen:Date.now()})}
  catch(e){state={stage:'error',err:e};emit()}
  creating=false;
}
function ping(u){
  clearInterval(pingT);
  const go=()=>{if(document.visibilityState==='visible')updateDoc(doc(db,'users',u.uid),{lastSeen:Date.now()}).catch(()=>{})};
  go();pingT=setInterval(go,120000);
}
function handle(u){
  if(unsubProf){unsubProf();unsubProf=null}
  clearInterval(pingT);
  if(!u){state={stage:'out'};emit();return}
  const admin=(u.email||'').toLowerCase()===ADMIN;
  if(admin&&!u.emailVerified){state={stage:'verify',user:u,admin:true};emit();return}
  unsubProf=onSnapshot(doc(db,'users',u.uid),snap=>{
    if(!snap.exists()){mkProfile(u);return}
    const p=snap.data();
    const st=admin?'ok':(p.status==='approved'?'ok':p.status==='blocked'?'blocked':'pending');
    const was=state.stage;
    state={stage:st,user:u,prof:p,admin};
    if(was!==st||was==='loading')emit();else emit();
    if(!pingT)ping(u);
  },err=>{state={stage:'error',err,user:u};emit()});
  ping(u);
}
onAuthStateChanged(auth,handle);

/* ---- الأسئلة المحمية (مقسّمة لقطع) ---- */
const CH=250000;
async function blob(id){
  const f=await getDoc(doc(db,'qz',id+'__0'));
  if(!f.exists())return null;
  const n=f.data().n;let s=f.data().d;
  if(n>1){const r=await Promise.all(Array.from({length:n-1},(_,i)=>getDoc(doc(db,'qz',id+'__'+(i+1)))));r.forEach(x=>{s+=x.exists()?x.data().d:''})}
  return s;
}
async function putBlob(id,str){
  const n=Math.max(1,Math.ceil(str.length/CH));
  const old=await getDoc(doc(db,'qz',id+'__0'));
  for(let i=0;i<n;i++)await setDoc(doc(db,'qz',id+'__'+i),{id,i,n,d:str.slice(i*CH,(i+1)*CH)});
  if(old.exists()){for(let i=n;i<old.data().n;i++)await deleteDoc(doc(db,'qz',id+'__'+i)).catch(()=>{})}
  return n;
}

/* ---- مزامنة تقدّم الطالب ---- */
const kvT={};
const kvGet=async k=>{const u=auth.currentUser;if(!u)return null;const d=await getDoc(doc(db,'users',u.uid,'kv',k));return d.exists()?d.data().d:null};
function kvSet(k,s){
  const u=auth.currentUser;if(!u||s.length>900000)return;
  clearTimeout(kvT[k]);kvT[k]=setTimeout(()=>setDoc(doc(db,'users',u.uid,'kv',k),{d:s}).catch(()=>{}),1500);
}

/* ---- المراقبة ---- */
function logAttempt(o){
  const u=auth.currentUser,p=state.prof;if(!u||!p)return;
  addDoc(collection(db,'att'),Object.assign({uid:u.uid,name:p.name,at:Date.now()},o)).catch(()=>{});
}
function logView(o){
  const u=auth.currentUser,p=state.prof;if(!u||!p)return;
  addDoc(collection(db,'vw'),Object.assign({uid:u.uid,name:p.name,at:Date.now()},o)).catch(()=>{});
}
const rows=async(c,n)=>(await getDocs(query(collection(db,c),orderBy('at','desc'),limit(n)))).docs.map(d=>Object.assign({_id:d.id},d.data()));

window.FB={
  ADMIN,
  get state(){return state},
  onState(f){subs.push(f);f(state)},
  async signup(name,phone,email,pass){pend={name,phone};await createUserWithEmailAndPassword(auth,email,pass);
    if(email.toLowerCase()===ADMIN)await sendEmailVerification(auth.currentUser).catch(()=>{})},
  login:(e,p)=>signInWithEmailAndPassword(auth,e,p),
  logout:()=>signOut(auth),
  reset:e=>sendPasswordResetEmail(auth,e),
  resend:()=>sendEmailVerification(auth.currentUser),
  async recheck(){const u=auth.currentUser;if(!u)return;await u.reload();await u.getIdToken(true);handle(auth.currentUser)},
  blob,putBlob,kvGet,kvSet,logAttempt,logView,
  users:async()=>(await getDocs(collection(db,'users'))).docs.map(d=>Object.assign({uid:d.id},d.data())),
  setStatus:(uid,s)=>updateDoc(doc(db,'users',uid),{status:s}),
  delUser:uid=>deleteDoc(doc(db,'users',uid)),
  atts:n=>rows('att',n),views:n=>rows('vw',n)
};
window.dispatchEvent(new Event('fbready'));
