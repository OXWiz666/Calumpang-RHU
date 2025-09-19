import{r as d,P as Ee,q as ne,j as t,b as H,d as le}from"./app-9IFjvyjq.js";import{A as $e}from"./AdminLayout-B1EVrWwj.js";import{B as Z}from"./button-BWLYpXz0.js";import{b as ke,e as Te,C as Oe,a as Ie,c as Fe,d as Pe}from"./card-BZqhk5Ws.js";import{I as ze}from"./input-fLU5VnAr.js";import{A as Le,a as Re,b as Me}from"./avatar-eTivO2nx.js";import{B as k}from"./badge-Da4cSqJP.js";import{S as de,a as ce,b as me,c as pe,d as T}from"./select-p8YEwkY-.js";import{C as Be}from"./CustomModal-B_1zsoCZ.js";import{S as He,T as _e,a as Ke,b as ue,c as O,d as Ue,e as I}from"./table2-D0uN2hlO.js";import{P as he}from"./PrimaryButton-B7Xo7hc8.js";import{I as Ve}from"./InputError-DJC9RL82.js";import{C as qe,A as We,a as Ye,b as Ze,c as Qe,d as Ge,e as Je,f as Xe,g as et}from"./alert-dialog-BK7fNhSv.js";import{m as tt}from"./proxy-D62Q3uN7.js";import{S as st}from"./search-CCpMc_T5.js";import{F as rt}from"./filter-ppKoOxkI.js";import{E as at}from"./eye-B-87yDjC.js";import{T as it}from"./trash-2-vvbptI_1.js";import{C as ot}from"./chevron-left-0-p9DiDT.js";import{C as nt}from"./chevron-right-CvfxXXcM.js";import"./utils-Dqxj4mrw.js";import"./separator-Ck3s5O1g.js";import"./index-DMLVHKle.js";import"./index-iJsz53jB.js";import"./moment-C5S46NFB.js";import"./dialog-BlSttdnZ.js";import"./index-ZSsit5F4.js";import"./Combination-BD7y2hDp.js";import"./react-icons.esm-CBUbwQJY.js";import"./label-C2QZitaL.js";import"./index-C6jRhQFj.js";import"./popover-D55FYzXF.js";import"./format-BtYX0kVO.js";import"./isBefore-CNJkrGzj.js";import"./isSameMonth-CLqEvLGB.js";import"./index-D1R9fGnO.js";import"./TextInput-VzTatbZ2.js";import"./createLucideIcon-DsPw26Nq.js";import"./x-QWiAXd0n.js";import"./settings-RhmjAov2.js";import"./house-3fFlpYPo.js";import"./calendar-DQr9f7aC.js";import"./users-CRZKArp7.js";import"./bell-Oyzr8Ilp.js";import"./index-BkKJZgfk.js";import"./autoprefixer-CLq4rudv.js";import"./pusher-Dk5bIoJZ.js";import"./trending-up-_LM6MF-k.js";import"./file-text-2oyp6bUV.js";import"./layers-CYkgeNxD.js";import"./chart-column-Bqapy0n2.js";import"./index-5FqUdhJW.js";import"./index-Bhu2lbiL.js";import"./arrow-up-BuTJVTCc.js";let lt={data:""},dt=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||lt,ct=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,mt=/\/\*[^]*?\*\/|  +/g,xe=/\n+/g,E=(e,s)=>{let r="",i="",n="";for(let o in e){let a=e[o];o[0]=="@"?o[1]=="i"?r=o+" "+a+";":i+=o[1]=="f"?E(a,o):o+"{"+E(a,o[1]=="k"?"":s)+"}":typeof a=="object"?i+=E(a,s?s.replace(/([^,])+/g,l=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,p=>/&/.test(p)?p.replace(/&/g,l):l?l+" "+p:p)):o):a!=null&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=E.p?E.p(o,a):o+":"+a+";")}return r+(s&&n?s+"{"+n+"}":n)+i},A={},fe=e=>{if(typeof e=="object"){let s="";for(let r in e)s+=r+fe(e[r]);return s}return e},pt=(e,s,r,i,n)=>{let o=fe(e),a=A[o]||(A[o]=(p=>{let x=0,h=11;for(;x<p.length;)h=101*h+p.charCodeAt(x++)>>>0;return"go"+h})(o));if(!A[a]){let p=o!==e?e:(x=>{let h,u,f=[{}];for(;h=ct.exec(x.replace(mt,""));)h[4]?f.shift():h[3]?(u=h[3].replace(xe," ").trim(),f.unshift(f[0][u]=f[0][u]||{})):f[0][h[1]]=h[2].replace(xe," ").trim();return f[0]})(e);A[a]=E(n?{["@keyframes "+a]:p}:p,r?"":"."+a)}let l=r&&A.g?A.g:null;return r&&(A.g=A[a]),((p,x,h,u)=>{u?x.data=x.data.replace(u,p):x.data.indexOf(p)===-1&&(x.data=h?p+x.data:x.data+p)})(A[a],s,i,l),a},ut=(e,s,r)=>e.reduce((i,n,o)=>{let a=s[o];if(a&&a.call){let l=a(r),p=l&&l.props&&l.props.className||/^go/.test(l)&&l;a=p?"."+p:l&&typeof l=="object"?l.props?"":E(l,""):l===!1?"":l}return i+n+(a??"")},"");function q(e){let s=this||{},r=e.call?e(s.p):e;return pt(r.unshift?r.raw?ut(r,[].slice.call(arguments,1),s.p):r.reduce((i,n)=>Object.assign(i,n&&n.call?n(s.p):n),{}):r,dt(s.target),s.g,s.o,s.k)}let ge,Q,G;q.bind({g:1});let S=q.bind({k:1});function ht(e,s,r,i){E.p=s,ge=e,Q=r,G=i}function $(e,s){let r=this||{};return function(){let i=arguments;function n(o,a){let l=Object.assign({},o),p=l.className||n.className;r.p=Object.assign({theme:Q&&Q()},l),r.o=/ *go\d+/.test(p),l.className=q.apply(r,i)+(p?" "+p:"");let x=e;return e[0]&&(x=l.as||e,delete l.as),G&&x[0]&&G(l),ge(x,l)}return s?s(n):n}}var xt=e=>typeof e=="function",V=(e,s)=>xt(e)?e(s):e,ft=(()=>{let e=0;return()=>(++e).toString()})(),be=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let s=matchMedia("(prefers-reduced-motion: reduce)");e=!s||s.matches}return e}})(),gt=20,J="default",ve=(e,s)=>{let{toastLimit:r}=e.settings;switch(s.type){case 0:return{...e,toasts:[s.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===s.toast.id?{...a,...s.toast}:a)};case 2:let{toast:i}=s;return ve(e,{type:e.toasts.find(a=>a.id===i.id)?1:0,toast:i});case 3:let{toastId:n}=s;return{...e,toasts:e.toasts.map(a=>a.id===n||n===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return s.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==s.toastId)};case 5:return{...e,pausedAt:s.time};case 6:let o=s.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+o}))}}},U=[],ye={toasts:[],pausedAt:void 0,settings:{toastLimit:gt}},C={},je=(e,s=J)=>{C[s]=ve(C[s]||ye,e),U.forEach(([r,i])=>{r===s&&i(C[s])})},we=e=>Object.keys(C).forEach(s=>je(e,s)),bt=e=>Object.keys(C).find(s=>C[s].toasts.some(r=>r.id===e)),W=(e=J)=>s=>{je(s,e)},vt={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},yt=(e={},s=J)=>{let[r,i]=d.useState(C[s]||ye),n=d.useRef(C[s]);d.useEffect(()=>(n.current!==C[s]&&i(C[s]),U.push([s,i]),()=>{let a=U.findIndex(([l])=>l===s);a>-1&&U.splice(a,1)}),[s]);let o=r.toasts.map(a=>{var l,p,x;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((l=e[a.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:a.duration||((p=e[a.type])==null?void 0:p.duration)||(e==null?void 0:e.duration)||vt[a.type],style:{...e.style,...(x=e[a.type])==null?void 0:x.style,...a.style}}});return{...r,toasts:o}},jt=(e,s="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:s,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||ft()}),L=e=>(s,r)=>{let i=jt(s,e,r);return W(i.toasterId||bt(i.id))({type:2,toast:i}),i.id},v=(e,s)=>L("blank")(e,s);v.error=L("error");v.success=L("success");v.loading=L("loading");v.custom=L("custom");v.dismiss=(e,s)=>{let r={type:3,toastId:e};s?W(s)(r):we(r)};v.dismissAll=e=>v.dismiss(void 0,e);v.remove=(e,s)=>{let r={type:4,toastId:e};s?W(s)(r):we(r)};v.removeAll=e=>v.remove(void 0,e);v.promise=(e,s,r)=>{let i=v.loading(s.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let o=s.success?V(s.success,n):void 0;return o?v.success(o,{id:i,...r,...r==null?void 0:r.success}):v.dismiss(i),n}).catch(n=>{let o=s.error?V(s.error,n):void 0;o?v.error(o,{id:i,...r,...r==null?void 0:r.error}):v.dismiss(i)}),e};var wt=1e3,Nt=(e,s="default")=>{let{toasts:r,pausedAt:i}=yt(e,s),n=d.useRef(new Map).current,o=d.useCallback((u,f=wt)=>{if(n.has(u))return;let b=setTimeout(()=>{n.delete(u),a({type:4,toastId:u})},f);n.set(u,b)},[]);d.useEffect(()=>{if(i)return;let u=Date.now(),f=r.map(b=>{if(b.duration===1/0)return;let w=(b.duration||0)+b.pauseDuration-(u-b.createdAt);if(w<0){b.visible&&v.dismiss(b.id);return}return setTimeout(()=>v.dismiss(b.id,s),w)});return()=>{f.forEach(b=>b&&clearTimeout(b))}},[r,i,s]);let a=d.useCallback(W(s),[s]),l=d.useCallback(()=>{a({type:5,time:Date.now()})},[a]),p=d.useCallback((u,f)=>{a({type:1,toast:{id:u,height:f}})},[a]),x=d.useCallback(()=>{i&&a({type:6,time:Date.now()})},[i,a]),h=d.useCallback((u,f)=>{let{reverseOrder:b=!1,gutter:w=8,defaultPosition:R}=f||{},F=r.filter(N=>(N.position||R)===(u.position||R)&&N.height),M=F.findIndex(N=>N.id===u.id),B=F.filter((N,P)=>P<M&&N.visible).length;return F.filter(N=>N.visible).slice(...b?[B+1]:[0,B]).reduce((N,P)=>N+(P.height||0)+w,0)},[r]);return d.useEffect(()=>{r.forEach(u=>{if(u.dismissed)o(u.id,u.removeDelay);else{let f=n.get(u.id);f&&(clearTimeout(f),n.delete(u.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:p,startPause:l,endPause:x,calculateOffset:h}}},Ct=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,At=S`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,St=S`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Dt=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ct} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${At} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${St} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Et=S`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,$t=$("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Et} 1s linear infinite;
`,kt=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Tt=S`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ot=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${kt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Tt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,It=$("div")`
  position: absolute;
`,Ft=$("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Pt=S`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,zt=$("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Pt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Lt=({toast:e})=>{let{icon:s,type:r,iconTheme:i}=e;return s!==void 0?typeof s=="string"?d.createElement(zt,null,s):s:r==="blank"?null:d.createElement(Ft,null,d.createElement($t,{...i}),r!=="loading"&&d.createElement(It,null,r==="error"?d.createElement(Dt,{...i}):d.createElement(Ot,{...i})))},Rt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Mt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Bt="0%{opacity:0;} 100%{opacity:1;}",Ht="0%{opacity:1;} 100%{opacity:0;}",_t=$("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Kt=$("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ut=(e,s)=>{let r=e.includes("top")?1:-1,[i,n]=be()?[Bt,Ht]:[Rt(r),Mt(r)];return{animation:s?`${S(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${S(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Vt=d.memo(({toast:e,position:s,style:r,children:i})=>{let n=e.height?Ut(e.position||s||"top-center",e.visible):{opacity:0},o=d.createElement(Lt,{toast:e}),a=d.createElement(Kt,{...e.ariaProps},V(e.message,e));return d.createElement(_t,{className:e.className,style:{...n,...r,...e.style}},typeof i=="function"?i({icon:o,message:a}):d.createElement(d.Fragment,null,o,a))});ht(d.createElement);var qt=({id:e,className:s,style:r,onHeightUpdate:i,children:n})=>{let o=d.useCallback(a=>{if(a){let l=()=>{let p=a.getBoundingClientRect().height;i(e,p)};l(),new MutationObserver(l).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return d.createElement("div",{ref:o,className:s,style:r},n)},Wt=(e,s)=>{let r=e.includes("top"),i=r?{top:0}:{bottom:0},n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:be()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${s*(r?1:-1)}px)`,...i,...n}},Yt=q`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,_=16,Zt=({reverseOrder:e,position:s="top-center",toastOptions:r,gutter:i,children:n,toasterId:o,containerStyle:a,containerClassName:l})=>{let{toasts:p,handlers:x}=Nt(r,o);return d.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:_,left:_,right:_,bottom:_,pointerEvents:"none",...a},className:l,onMouseEnter:x.startPause,onMouseLeave:x.endPause},p.map(h=>{let u=h.position||s,f=x.calculateOffset(h,{reverseOrder:e,gutter:i,defaultPosition:s}),b=Wt(u,f);return d.createElement(qt,{id:h.id,key:h.id,onHeightUpdate:x.updateHeight,className:h.visible?Yt:"",style:b},h.type==="custom"?V(h.message,h):n?n(h):d.createElement(Vt,{toast:h,position:u}))}))},K=v;function Gs({appointments_:e}){var ee,te,se,re;const[s,r]=d.useState(e.data),[i,n]=d.useState(""),[o,a]=d.useState("all"),[l,p]=d.useState({key:"date",direction:"ascending"});[...s.filter(m=>{var y;const c=((y=m.user)==null?void 0:y.firstname.toLowerCase().includes(i.toLowerCase()))||m.user_id.toLowerCase().includes(i.toLowerCase()),g=o==="all"||m.status===o;return c&&g})].sort((m,c)=>{const g=m[l.key],y=c[l.key];if(g==null)return l.direction==="ascending"?-1:1;if(y==null)return l.direction==="ascending"?1:-1;if(typeof g=="string"&&typeof y=="string"){const j=g.toLowerCase().localeCompare(y.toLowerCase());return l.direction==="ascending"?j:-j}return g<y?l.direction==="ascending"?-1:1:g>y?l.direction==="ascending"?1:-1:0});const h=m=>{const c="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center transition-all duration-200";switch(m){case 2:return t.jsxs(k,{className:`${c} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-green-600 mr-2"}),"Completed"]});case 1:return t.jsxs(k,{className:`${c} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"}),"Scheduled"]});case 3:return t.jsxs(k,{className:`${c} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-red-600 mr-2"}),"Cancelled"]});case 4:return t.jsxs(k,{className:`${c} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-red-600 mr-2"}),"Declined"]});case 5:return t.jsxs(k,{className:`${c} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-green-600 mr-2"}),"Confirmed"]});case 6:return t.jsxs(k,{className:`${c} bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100`,children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"}),"Archived"]});default:return t.jsx(k,{children:m})}},u=()=>t.jsx(t.Fragment,{}),[f,b]=d.useState(!1),[w,R]=d.useState({}),{data:F,setData:M,processing:B,errors:N,post:P}=Ee({status:null}),Ne=(m,c)=>{fetch(`/auth/appointment/get/${c}`).then(g=>g.json()).then(g=>{R(g),M("status",g.status)}),b(!0)},X=m=>{b(!1)},{inertia:Qt}=ne(),[D,z]=d.useState({isOpen:!1,type:null,appointmentId:null}),Ce=async m=>{var c,g,y;try{const j=await le.post("/auth/appointments/archive",{appointment_id:m});K.success(((c=j.data)==null?void 0:c.message)||"Appointment archived successfully"),H.reload({only:["appointments_"]})}catch(j){console.error("Error archiving appointment:",j),K.error(((y=(g=j.response)==null?void 0:g.data)==null?void 0:y.message)||"Failed to archive appointment")}finally{z({isOpen:!1,type:null,appointmentId:null})}},Ae=async m=>{var c,g,y;try{const j=await le.post("/auth/appointments/unarchive",{appointment_id:m});K.success(((c=j.data)==null?void 0:c.message)||"Appointment restored successfully"),H.reload({only:["appointments_"]})}catch(j){console.error("Error restoring appointment:",j),K.error(((y=(g=j.response)==null?void 0:g.data)==null?void 0:y.message)||"Failed to restore appointment")}finally{z({isOpen:!1,type:null,appointmentId:null})}};d.useEffect(()=>{r(e.data)},[e]);const Se=m=>{m.preventDefault(),P(route("admin.appointment.status.update",{appointment:w.id}),{onSuccess:()=>{X(),alert_toast("Success!","Status updated successfully!","success"),H.reload({only:["appointments_"]})}})},{links:De}=ne().props.appointments_;return t.jsxs($e,{header:"Appointments",tools:u(),children:[t.jsx(Zt,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#fff",color:"#363636",borderRadius:"8px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}}),t.jsxs(tt.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"space-y-6",children:[t.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm",children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"All Appointments"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Manage and track all appointment records"})]}),t.jsxs("div",{className:"flex flex-col md:flex-row gap-4",children:[t.jsxs("div",{className:"relative",children:[t.jsx(st,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"}),t.jsx(ze,{type:"text",placeholder:"Search appointments...",value:i,onChange:m=>n(m.target.value),className:"pl-10 w-full md:w-[250px] bg-gray-50 border-gray-200 focus:border-primary"})]}),t.jsxs(de,{value:o,onValueChange:a,children:[t.jsxs(ce,{className:"w-[180px] bg-gray-50 border-gray-200",children:[t.jsx(rt,{className:"h-4 w-4 mr-2 text-gray-400"}),t.jsx(me,{placeholder:"Filter by status"})]}),t.jsxs(pe,{children:[t.jsx(T,{value:"all",children:"All Statuses"}),t.jsx(T,{value:1,children:"Scheduled"}),t.jsx(T,{value:2,children:"Completed"}),t.jsx(T,{value:3,children:"Cancelled"})]})]})]})]}),t.jsx("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden",children:t.jsx("div",{className:"overflow-x-auto",children:t.jsx(He,{data:s,defaultSort:{key:"user.firstname",direction:"asc"},children:({sortedData:m})=>t.jsxs(_e,{children:[t.jsx(Ke,{children:t.jsxs(ue,{children:[t.jsx(O,{sortKey:"user.firstname",sortable:!0,children:"Patient"}),t.jsx(O,{sortKey:"date",children:"Date & Time"}),t.jsx(O,{children:"Doctor"}),t.jsx(O,{sortKey:"service.servicename",children:"Purpose"}),t.jsx(O,{sortKey:"status",children:"Status"}),t.jsx(O,{children:"Actions"})]})}),t.jsxs(Ue,{children:[m.length<=0&&t.jsx("div",{className:" m-5",children:"No Records Available."}),m.map((c,g)=>{var y,j,ae,ie,oe;return t.jsxs(ue,{className:"hover:bg-gray-50 transition-colors duration-150",children:[t.jsx(I,{children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsxs(Le,{children:[t.jsx(Re,{alt:(y=c.user)==null?void 0:y.firstname}),t.jsx(Me,{children:(j=c.user)==null?void 0:j.firstname.split(" ").map(Y=>Y[0]).join("")})]}),t.jsxs("div",{children:[t.jsxs("div",{className:"font-medium",children:[(ae=c.user)==null?void 0:ae.firstname," ",(ie=c.user)==null?void 0:ie.lastname]}),t.jsx("div",{className:"text-sm text-muted-foreground",children:c.user_id})]})]})}),t.jsxs(I,{children:[t.jsx("div",{className:"font-medium",children:new Date(c.date).toLocaleDateString()}),t.jsx("div",{className:"text-sm text-muted-foreground",children:c.time})]}),t.jsx(I,{children:"Not Set"}),t.jsx(I,{children:(oe=c.service)==null?void 0:oe.servicename}),t.jsx(I,{children:h(c.status)}),t.jsx(I,{className:"flex items-center gap-3",children:t.jsxs("div",{className:"flex items-center space-x-2",children:[t.jsx(he,{onClick:Y=>{Ne(Y,c.id)},className:"inline-flex items-center p-2 rounded-full hover:bg-gray-100",disabled:c.status===5,children:t.jsx(at,{className:"h-4 w-4"})}),c.status!==6?t.jsxs(Z,{variant:"outline",size:"sm",onClick:()=>z({isOpen:!0,type:"archive",appointmentId:c.id}),className:"inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200",children:[t.jsx(it,{className:"h-4 w-4 mr-2"}),"Archive"]}):t.jsxs(Z,{variant:"outline",size:"sm",onClick:()=>z({isOpen:!0,type:"unarchive",appointmentId:c.id}),className:"inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors duration-200",children:[t.jsx(qe,{className:"h-4 w-4 mr-2"}),"Restore"]})]})})]},g)})]})]})})})}),t.jsxs("div",{className:"bg-white p-4 rounded-lg shadow-sm flex items-center justify-between",children:[t.jsxs("div",{className:"text-sm text-gray-600",children:["Showing ",t.jsx("span",{className:"font-medium",children:e.from})," to"," ",t.jsx("span",{className:"font-medium",children:e.to})," of"," ",t.jsx("span",{className:"font-medium",children:e.total})," Results"]}),t.jsx("div",{className:"flex gap-2",children:De.map((m,c)=>t.jsx(Z,{variant:m.active?"default":"outline",size:"sm",disabled:!m.url||m.active,onClick:()=>m.url&&H.get(m.url),className:"min-w-[40px] h-[36px]",children:m.label.includes("Previous")?t.jsx(ot,{className:"h-4 w-4"}):m.label.includes("Next")?t.jsx(nt,{className:"h-4 w-4"}):m.label},c))})]})]}),t.jsxs(Be,{isOpen:f,hasCancel:!0,onClose:X,maxWidth:"2xl",canceltext:"Okay",savetext:"",children:[t.jsx(ke,{children:"Appointment Details"}),t.jsx(Te,{}),t.jsxs(Oe,{children:[t.jsx(Ie,{}),t.jsx(Fe,{children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Name"}),t.jsxs("p",{className:"text-gray-900",children:[(ee=w.user)==null?void 0:ee.firstname," ",(te=w.user)==null?void 0:te.lastname]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Service"}),t.jsx("p",{className:"text-gray-900",children:(se=w.service)==null?void 0:se.servicename})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Date"}),t.jsx("p",{className:"text-gray-900",children:w.date})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Time"}),t.jsx("p",{className:"text-gray-900",children:w.time})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Email"}),t.jsx("p",{className:"text-gray-900",children:(re=w.user)==null?void 0:re.email})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-500",children:"Phone"}),t.jsx("p",{className:"text-gray-900",children:w.phone})]})]})})]}),t.jsxs(Pe,{children:[t.jsx("div",{className:"flex items-center justify-between",children:t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("div",{className:"flex items-center gap-2",children:t.jsx("span",{className:"text-sm font-medium",children:"Status:"})}),t.jsxs(de,{value:F.status,onValueChange:m=>{M("status",m)},id:"axz",children:[t.jsx(ce,{className:"w-[180px]",children:t.jsx(me,{placeholder:"Status"})}),t.jsxs(pe,{children:[t.jsx(T,{value:1,children:"Scheduled"}),t.jsx(T,{value:5,children:"Confirm"}),t.jsx(T,{value:4,children:"Decline"})]})]}),t.jsx(he,{disabled:B,onClick:Se,children:"Save"})]})}),t.jsx(Ve,{message:N.status})]})]}),t.jsx(We,{open:D.isOpen,onOpenChange:m=>z({isOpen:m,type:null,appointmentId:null}),children:t.jsxs(Ye,{className:"max-w-[400px]",children:[t.jsxs(Ze,{children:[t.jsx(Qe,{className:"text-lg font-semibold",children:D.type==="archive"?"Archive Appointment":"Restore Appointment"}),t.jsx(Ge,{className:"text-gray-600",children:D.type==="archive"?"Are you sure you want to archive this appointment? This will remove it from the active list.":"Are you sure you want to restore this appointment? This will return it to the active list."})]}),t.jsxs(Je,{children:[t.jsx(Xe,{className:"border-gray-200 hover:bg-gray-50",children:"Cancel"}),t.jsx(et,{onClick:()=>{D.type==="archive"?Ce(D.appointmentId):Ae(D.appointmentId)},className:`${D.type==="archive"?"bg-red-600 hover:bg-red-700":"bg-green-600 hover:bg-green-700"} text-white`,children:D.type==="archive"?"Archive":"Restore"})]})]})})]})}export{Gs as default};
