import{R as P,r as s,j as N,b as Vn,q as vn}from"./app-G8iqleJv.js";import{A as Jr}from"./AdminLayout-C4X4y_vD.js";import{B as eo}from"./button-B_LnOuxf.js";import"./input-DFrqRW5G.js";import"./avatar-BI-JSTSG.js";import"./table-DvPtF1Xa.js";import"./select-BtrVkcdI.js";import"./dialog-D79V5GE4.js";import{P as to}from"./PrimaryButton-Cyy6hg6I.js";import{D as no}from"./DangerButton-oTHsLXmp.js";import{h as ro}from"./moment-C5S46NFB.js";import{C as oo}from"./chevron-left-CMGSbyZL.js";import{C as ao}from"./chevron-right-BkRYFXw_.js";import{m as so}from"./pusher-Bov-XCiP.js";import{c as io}from"./createLucideIcon-CtVvwcl8.js";import{T as lo}from"./trash-2-CG2jRtsF.js";import"./utils-k0UhslF6.js";import"./card-cIg_B_IG.js";import"./separator-DEyoKzwW.js";import"./index-DHagqIMV.js";import"./index-BHXf0KTI.js";import"./index-DdMWTZ3t.js";import"./index-CE5llJVL.js";import"./index-3LKL4iwc.js";import"./label-tl9XpKj-.js";import"./popover-CkyzJ440.js";import"./react-icons.esm-BGTDVcWI.js";import"./format-BtYX0kVO.js";import"./isBefore-CNJkrGzj.js";import"./isSameMonth-CLqEvLGB.js";import"./floating-ui.react-dom-B6MwqTU1.js";import"./Combination-BkR281CS.js";import"./TextInput-BVgWFEty.js";import"./x-yhBls2Ii.js";import"./settings-DF6TMztZ.js";import"./calendar-CpLaM_M8.js";import"./users-D055v8MD.js";import"./badge-BLwlscqv.js";import"./bell-COWyhG_0.js";import"./autoprefixer-DaV7nXpj.js";import"./layers-DYzwe8gK.js";import"./chart-column-BT4j9c0o.js";import"./index-B2jg9BR7.js";import"./index-nEL1Ci1r.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],uo=io("Pencil",co);var Y=function(){return Y=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},Y.apply(this,arguments)};function ft(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,a;r<o;r++)(a||!(r in t))&&(a||(a=Array.prototype.slice.call(t,0,r)),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}var _="-ms-",Ke="-moz-",A="-webkit-",Un="comm",xt="rule",Vt="decl",po="@import",qn="@keyframes",go="@layer",Kn=Math.abs,Ut=String.fromCharCode,Nt=Object.assign;function fo(e,t){return W(e,0)^45?(((t<<2^W(e,0))<<2^W(e,1))<<2^W(e,2))<<2^W(e,3):0}function Zn(e){return e.trim()}function ge(e,t){return(e=t.exec(e))?e[0]:e}function E(e,t,n){return e.replace(t,n)}function lt(e,t,n){return e.indexOf(t,n)}function W(e,t){return e.charCodeAt(t)|0}function Ne(e,t,n){return e.slice(t,n)}function ce(e){return e.length}function Xn(e){return e.length}function qe(e,t){return t.push(e),e}function ho(e,t){return e.map(t).join("")}function Cn(e,t){return e.filter(function(n){return!ge(n,t)})}var vt=1,Me=1,Qn=0,ne=0,T=0,Ge="";function Ct(e,t,n,r,o,a,i,d){return{value:e,root:t,parent:n,type:r,props:o,children:a,line:vt,column:Me,length:i,return:"",siblings:d}}function xe(e,t){return Nt(Ct("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function Te(e){for(;e.root;)e=xe(e.root,{children:[e]});qe(e,e.siblings)}function mo(){return T}function bo(){return T=ne>0?W(Ge,--ne):0,Me--,T===10&&(Me=1,vt--),T}function ae(){return T=ne<Qn?W(Ge,ne++):0,Me++,T===10&&(Me=1,vt++),T}function Pe(){return W(Ge,ne)}function ct(){return ne}function St(e,t){return Ne(Ge,e,t)}function Mt(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function wo(e){return vt=Me=1,Qn=ce(Ge=e),ne=0,[]}function yo(e){return Ge="",e}function jt(e){return Zn(St(ne-1,Lt(e===91?e+2:e===40?e+1:e)))}function xo(e){for(;(T=Pe())&&T<33;)ae();return Mt(e)>2||Mt(T)>3?"":" "}function vo(e,t){for(;--t&&ae()&&!(T<48||T>102||T>57&&T<65||T>70&&T<97););return St(e,ct()+(t<6&&Pe()==32&&ae()==32))}function Lt(e){for(;ae();)switch(T){case e:return ne;case 34:case 39:e!==34&&e!==39&&Lt(T);break;case 40:e===41&&Lt(e);break;case 92:ae();break}return ne}function Co(e,t){for(;ae()&&e+T!==57;)if(e+T===84&&Pe()===47)break;return"/*"+St(t,ne-1)+"*"+Ut(e===47?e:ae())}function So(e){for(;!Mt(Pe());)ae();return St(e,ne)}function Ro(e){return yo(dt("",null,null,null,[""],e=wo(e),0,[0],e))}function dt(e,t,n,r,o,a,i,d,l){for(var h=0,u=0,g=i,y=0,f=0,x=0,R=1,O=1,$=1,C=0,m="",v=o,D=a,S=r,p=m;O;)switch(x=C,C=ae()){case 40:if(x!=108&&W(p,g-1)==58){lt(p+=E(jt(C),"&","&\f"),"&\f",Kn(h?d[h-1]:0))!=-1&&($=-1);break}case 34:case 39:case 91:p+=jt(C);break;case 9:case 10:case 13:case 32:p+=xo(x);break;case 92:p+=vo(ct()-1,7);continue;case 47:switch(Pe()){case 42:case 47:qe($o(Co(ae(),ct()),t,n,l),l);break;default:p+="/"}break;case 123*R:d[h++]=ce(p)*$;case 125*R:case 59:case 0:switch(C){case 0:case 125:O=0;case 59+u:$==-1&&(p=E(p,/\f/g,"")),f>0&&ce(p)-g&&qe(f>32?Rn(p+";",r,n,g-1,l):Rn(E(p," ","")+";",r,n,g-2,l),l);break;case 59:p+=";";default:if(qe(S=Sn(p,t,n,h,u,o,d,m,v=[],D=[],g,a),a),C===123)if(u===0)dt(p,t,S,S,v,a,g,d,D);else switch(y===99&&W(p,3)===110?100:y){case 100:case 108:case 109:case 115:dt(e,S,S,r&&qe(Sn(e,S,S,0,0,o,d,m,o,v=[],g,D),D),o,D,g,d,r?v:D);break;default:dt(p,S,S,S,[""],D,0,d,D)}}h=u=f=0,R=$=1,m=p="",g=i;break;case 58:g=1+ce(p),f=x;default:if(R<1){if(C==123)--R;else if(C==125&&R++==0&&bo()==125)continue}switch(p+=Ut(C),C*R){case 38:$=u>0?1:(p+="\f",-1);break;case 44:d[h++]=(ce(p)-1)*$,$=1;break;case 64:Pe()===45&&(p+=jt(ae())),y=Pe(),u=g=ce(m=p+=So(ct())),C++;break;case 45:x===45&&ce(p)==2&&(R=0)}}return a}function Sn(e,t,n,r,o,a,i,d,l,h,u,g){for(var y=o-1,f=o===0?a:[""],x=Xn(f),R=0,O=0,$=0;R<r;++R)for(var C=0,m=Ne(e,y+1,y=Kn(O=i[R])),v=e;C<x;++C)(v=Zn(O>0?f[C]+" "+m:E(m,/&\f/g,f[C])))&&(l[$++]=v);return Ct(e,t,n,o===0?xt:d,l,h,u,g)}function $o(e,t,n,r){return Ct(e,t,n,Un,Ut(mo()),Ne(e,2,-2),0,r)}function Rn(e,t,n,r,o){return Ct(e,t,n,Vt,Ne(e,0,r),Ne(e,r+1,-1),r,o)}function Jn(e,t,n){switch(fo(e,t)){case 5103:return A+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return A+e+e;case 4789:return Ke+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return A+e+Ke+e+_+e+e;case 5936:switch(W(e,t+11)){case 114:return A+e+_+E(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return A+e+_+E(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return A+e+_+E(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return A+e+_+e+e;case 6165:return A+e+_+"flex-"+e+e;case 5187:return A+e+E(e,/(\w+).+(:[^]+)/,A+"box-$1$2"+_+"flex-$1$2")+e;case 5443:return A+e+_+"flex-item-"+E(e,/flex-|-self/g,"")+(ge(e,/flex-|baseline/)?"":_+"grid-row-"+E(e,/flex-|-self/g,""))+e;case 4675:return A+e+_+"flex-line-pack"+E(e,/align-content|flex-|-self/g,"")+e;case 5548:return A+e+_+E(e,"shrink","negative")+e;case 5292:return A+e+_+E(e,"basis","preferred-size")+e;case 6060:return A+"box-"+E(e,"-grow","")+A+e+_+E(e,"grow","positive")+e;case 4554:return A+E(e,/([^-])(transform)/g,"$1"+A+"$2")+e;case 6187:return E(E(E(e,/(zoom-|grab)/,A+"$1"),/(image-set)/,A+"$1"),e,"")+e;case 5495:case 3959:return E(e,/(image-set\([^]*)/,A+"$1$`$1");case 4968:return E(E(e,/(.+:)(flex-)?(.*)/,A+"box-pack:$3"+_+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+A+e+e;case 4200:if(!ge(e,/flex-|baseline/))return _+"grid-column-align"+Ne(e,t)+e;break;case 2592:case 3360:return _+E(e,"template-","")+e;case 4384:case 3616:return n&&n.some(function(r,o){return t=o,ge(r.props,/grid-\w+-end/)})?~lt(e+(n=n[t].value),"span",0)?e:_+E(e,"-start","")+e+_+"grid-row-span:"+(~lt(n,"span",0)?ge(n,/\d+/):+ge(n,/\d+/)-+ge(e,/\d+/))+";":_+E(e,"-start","")+e;case 4896:case 4128:return n&&n.some(function(r){return ge(r.props,/grid-\w+-start/)})?e:_+E(E(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return E(e,/(.+)-inline(.+)/,A+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(ce(e)-1-t>6)switch(W(e,t+1)){case 109:if(W(e,t+4)!==45)break;case 102:return E(e,/(.+:)(.+)-([^]+)/,"$1"+A+"$2-$3$1"+Ke+(W(e,t+3)==108?"$3":"$2-$3"))+e;case 115:return~lt(e,"stretch",0)?Jn(E(e,"stretch","fill-available"),t,n)+e:e}break;case 5152:case 5920:return E(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(r,o,a,i,d,l,h){return _+o+":"+a+h+(i?_+o+"-span:"+(d?l:+l-+a)+h:"")+e});case 4949:if(W(e,t+6)===121)return E(e,":",":"+A)+e;break;case 6444:switch(W(e,W(e,14)===45?18:11)){case 120:return E(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+A+(W(e,14)===45?"inline-":"")+"box$3$1"+A+"$2$3$1"+_+"$2box$3")+e;case 100:return E(e,":",":"+_)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return E(e,"scroll-","scroll-snap-")+e}return e}function ht(e,t){for(var n="",r=0;r<e.length;r++)n+=t(e[r],r,e,t)||"";return n}function Eo(e,t,n,r){switch(e.type){case go:if(e.children.length)break;case po:case Vt:return e.return=e.return||e.value;case Un:return"";case qn:return e.return=e.value+"{"+ht(e.children,r)+"}";case xt:if(!ce(e.value=e.props.join(",")))return""}return ce(n=ht(e.children,r))?e.return=e.value+"{"+n+"}":""}function Oo(e){var t=Xn(e);return function(n,r,o,a){for(var i="",d=0;d<t;d++)i+=e[d](n,r,o,a)||"";return i}}function Po(e){return function(t){t.root||(t=t.return)&&e(t)}}function ko(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case Vt:e.return=Jn(e.value,e.length,n);return;case qn:return ht([xe(e,{value:E(e.value,"@","@"+A)})],r);case xt:if(e.length)return ho(n=e.props,function(o){switch(ge(o,r=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":Te(xe(e,{props:[E(o,/:(read-\w+)/,":"+Ke+"$1")]})),Te(xe(e,{props:[o]})),Nt(e,{props:Cn(n,r)});break;case"::placeholder":Te(xe(e,{props:[E(o,/:(plac\w+)/,":"+A+"input-$1")]})),Te(xe(e,{props:[E(o,/:(plac\w+)/,":"+Ke+"$1")]})),Te(xe(e,{props:[E(o,/:(plac\w+)/,_+"input-$1")]})),Te(xe(e,{props:[o]})),Nt(e,{props:Cn(n,r)});break}return""})}}var Do={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},J={},Le=typeof process<"u"&&J!==void 0&&(J.REACT_APP_SC_ATTR||J.SC_ATTR)||"data-styled",er="active",tr="data-styled-version",Rt="6.1.18",qt=`/*!sc*/
`,mt=typeof window<"u"&&typeof document<"u",Io=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&J!==void 0&&J.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&J.REACT_APP_SC_DISABLE_SPEEDY!==""?J.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&J.REACT_APP_SC_DISABLE_SPEEDY:typeof process<"u"&&J!==void 0&&J.SC_DISABLE_SPEEDY!==void 0&&J.SC_DISABLE_SPEEDY!==""&&J.SC_DISABLE_SPEEDY!=="false"&&J.SC_DISABLE_SPEEDY),$t=Object.freeze([]),ze=Object.freeze({});function jo(e,t,n){return n===void 0&&(n=ze),e.theme!==n.theme&&e.theme||t||n.theme}var nr=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),Ao=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,_o=/(^-|-$)/g;function $n(e){return e.replace(Ao,"-").replace(_o,"")}var Ho=/(a)(d)/gi,ot=52,En=function(e){return String.fromCharCode(e+(e>25?39:97))};function zt(e){var t,n="";for(t=Math.abs(e);t>ot;t=t/ot|0)n=En(t%ot)+n;return(En(t%ot)+n).replace(Ho,"$1-$2")}var At,rr=5381,Fe=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},or=function(e){return Fe(rr,e)};function To(e){return zt(or(e)>>>0)}function Fo(e){return e.displayName||e.name||"Component"}function _t(e){return typeof e=="string"&&!0}var ar=typeof Symbol=="function"&&Symbol.for,sr=ar?Symbol.for("react.memo"):60115,No=ar?Symbol.for("react.forward_ref"):60112,Mo={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Lo={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},ir={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},zo=((At={})[No]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},At[sr]=ir,At);function On(e){return("type"in(t=e)&&t.type.$$typeof)===sr?ir:"$$typeof"in e?zo[e.$$typeof]:Mo;var t}var Wo=Object.defineProperty,Bo=Object.getOwnPropertyNames,Pn=Object.getOwnPropertySymbols,Go=Object.getOwnPropertyDescriptor,Yo=Object.getPrototypeOf,kn=Object.prototype;function lr(e,t,n){if(typeof t!="string"){if(kn){var r=Yo(t);r&&r!==kn&&lr(e,r,n)}var o=Bo(t);Pn&&(o=o.concat(Pn(t)));for(var a=On(e),i=On(t),d=0;d<o.length;++d){var l=o[d];if(!(l in Lo||n&&n[l]||i&&l in i||a&&l in a)){var h=Go(t,l);try{Wo(e,l,h)}catch{}}}}return e}function De(e){return typeof e=="function"}function Kt(e){return typeof e=="object"&&"styledComponentId"in e}function Oe(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function Dn(e,t){if(e.length===0)return"";for(var n=e[0],r=1;r<e.length;r++)n+=e[r];return n}function Qe(e){return e!==null&&typeof e=="object"&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function Wt(e,t,n){if(n===void 0&&(n=!1),!n&&!Qe(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var r=0;r<t.length;r++)e[r]=Wt(e[r],t[r]);else if(Qe(t))for(var r in t)e[r]=Wt(e[r],t[r]);return e}function Zt(e,t){Object.defineProperty(e,"toString",{value:t})}function Ie(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(t.length>0?" Args: ".concat(t.join(", ")):""))}var Vo=function(){function e(t){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=t}return e.prototype.indexOfGroup=function(t){for(var n=0,r=0;r<t;r++)n+=this.groupSizes[r];return n},e.prototype.insertRules=function(t,n){if(t>=this.groupSizes.length){for(var r=this.groupSizes,o=r.length,a=o;t>=a;)if((a<<=1)<0)throw Ie(16,"".concat(t));this.groupSizes=new Uint32Array(a),this.groupSizes.set(r),this.length=a;for(var i=o;i<a;i++)this.groupSizes[i]=0}for(var d=this.indexOfGroup(t+1),l=(i=0,n.length);i<l;i++)this.tag.insertRule(d,n[i])&&(this.groupSizes[t]++,d++)},e.prototype.clearGroup=function(t){if(t<this.length){var n=this.groupSizes[t],r=this.indexOfGroup(t),o=r+n;this.groupSizes[t]=0;for(var a=r;a<o;a++)this.tag.deleteRule(r)}},e.prototype.getGroup=function(t){var n="";if(t>=this.length||this.groupSizes[t]===0)return n;for(var r=this.groupSizes[t],o=this.indexOfGroup(t),a=o+r,i=o;i<a;i++)n+="".concat(this.tag.getRule(i)).concat(qt);return n},e}(),ut=new Map,bt=new Map,pt=1,at=function(e){if(ut.has(e))return ut.get(e);for(;bt.has(pt);)pt++;var t=pt++;return ut.set(e,t),bt.set(t,e),t},Uo=function(e,t){pt=t+1,ut.set(e,t),bt.set(t,e)},qo="style[".concat(Le,"][").concat(tr,'="').concat(Rt,'"]'),Ko=new RegExp("^".concat(Le,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Zo=function(e,t,n){for(var r,o=n.split(","),a=0,i=o.length;a<i;a++)(r=o[a])&&e.registerName(t,r)},Xo=function(e,t){for(var n,r=((n=t.textContent)!==null&&n!==void 0?n:"").split(qt),o=[],a=0,i=r.length;a<i;a++){var d=r[a].trim();if(d){var l=d.match(Ko);if(l){var h=0|parseInt(l[1],10),u=l[2];h!==0&&(Uo(u,h),Zo(e,u,l[3]),e.getTag().insertRules(h,o)),o.length=0}else o.push(d)}}},In=function(e){for(var t=document.querySelectorAll(qo),n=0,r=t.length;n<r;n++){var o=t[n];o&&o.getAttribute(Le)!==er&&(Xo(e,o),o.parentNode&&o.parentNode.removeChild(o))}};function Qo(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null}var cr=function(e){var t=document.head,n=e||t,r=document.createElement("style"),o=function(d){var l=Array.from(d.querySelectorAll("style[".concat(Le,"]")));return l[l.length-1]}(n),a=o!==void 0?o.nextSibling:null;r.setAttribute(Le,er),r.setAttribute(tr,Rt);var i=Qo();return i&&r.setAttribute("nonce",i),n.insertBefore(r,a),r},Jo=function(){function e(t){this.element=cr(t),this.element.appendChild(document.createTextNode("")),this.sheet=function(n){if(n.sheet)return n.sheet;for(var r=document.styleSheets,o=0,a=r.length;o<a;o++){var i=r[o];if(i.ownerNode===n)return i}throw Ie(17)}(this.element),this.length=0}return e.prototype.insertRule=function(t,n){try{return this.sheet.insertRule(n,t),this.length++,!0}catch{return!1}},e.prototype.deleteRule=function(t){this.sheet.deleteRule(t),this.length--},e.prototype.getRule=function(t){var n=this.sheet.cssRules[t];return n&&n.cssText?n.cssText:""},e}(),ea=function(){function e(t){this.element=cr(t),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(t,n){if(t<=this.length&&t>=0){var r=document.createTextNode(n);return this.element.insertBefore(r,this.nodes[t]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(t){this.element.removeChild(this.nodes[t]),this.length--},e.prototype.getRule=function(t){return t<this.length?this.nodes[t].textContent:""},e}(),ta=function(){function e(t){this.rules=[],this.length=0}return e.prototype.insertRule=function(t,n){return t<=this.length&&(this.rules.splice(t,0,n),this.length++,!0)},e.prototype.deleteRule=function(t){this.rules.splice(t,1),this.length--},e.prototype.getRule=function(t){return t<this.length?this.rules[t]:""},e}(),jn=mt,na={isServer:!mt,useCSSOMInjection:!Io},dr=function(){function e(t,n,r){t===void 0&&(t=ze),n===void 0&&(n={});var o=this;this.options=Y(Y({},na),t),this.gs=n,this.names=new Map(r),this.server=!!t.isServer,!this.server&&mt&&jn&&(jn=!1,In(this)),Zt(this,function(){return function(a){for(var i=a.getTag(),d=i.length,l="",h=function(g){var y=function($){return bt.get($)}(g);if(y===void 0)return"continue";var f=a.names.get(y),x=i.getGroup(g);if(f===void 0||!f.size||x.length===0)return"continue";var R="".concat(Le,".g").concat(g,'[id="').concat(y,'"]'),O="";f!==void 0&&f.forEach(function($){$.length>0&&(O+="".concat($,","))}),l+="".concat(x).concat(R,'{content:"').concat(O,'"}').concat(qt)},u=0;u<d;u++)h(u);return l}(o)})}return e.registerId=function(t){return at(t)},e.prototype.rehydrate=function(){!this.server&&mt&&In(this)},e.prototype.reconstructWithOptions=function(t,n){return n===void 0&&(n=!0),new e(Y(Y({},this.options),t),this.gs,n&&this.names||void 0)},e.prototype.allocateGSInstance=function(t){return this.gs[t]=(this.gs[t]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(t=function(n){var r=n.useCSSOMInjection,o=n.target;return n.isServer?new ta(o):r?new Jo(o):new ea(o)}(this.options),new Vo(t)));var t},e.prototype.hasNameForId=function(t,n){return this.names.has(t)&&this.names.get(t).has(n)},e.prototype.registerName=function(t,n){if(at(t),this.names.has(t))this.names.get(t).add(n);else{var r=new Set;r.add(n),this.names.set(t,r)}},e.prototype.insertRules=function(t,n,r){this.registerName(t,n),this.getTag().insertRules(at(t),r)},e.prototype.clearNames=function(t){this.names.has(t)&&this.names.get(t).clear()},e.prototype.clearRules=function(t){this.getTag().clearGroup(at(t)),this.clearNames(t)},e.prototype.clearTag=function(){this.tag=void 0},e}(),ra=/&/g,oa=/^\s*\/\/.*$/gm;function ur(e,t){return e.map(function(n){return n.type==="rule"&&(n.value="".concat(t," ").concat(n.value),n.value=n.value.replaceAll(",",",".concat(t," ")),n.props=n.props.map(function(r){return"".concat(t," ").concat(r)})),Array.isArray(n.children)&&n.type!=="@keyframes"&&(n.children=ur(n.children,t)),n})}function aa(e){var t,n,r,o=ze,a=o.options,i=a===void 0?ze:a,d=o.plugins,l=d===void 0?$t:d,h=function(y,f,x){return x.startsWith(n)&&x.endsWith(n)&&x.replaceAll(n,"").length>0?".".concat(t):y},u=l.slice();u.push(function(y){y.type===xt&&y.value.includes("&")&&(y.props[0]=y.props[0].replace(ra,n).replace(r,h))}),i.prefix&&u.push(ko),u.push(Eo);var g=function(y,f,x,R){f===void 0&&(f=""),x===void 0&&(x=""),R===void 0&&(R="&"),t=R,n=f,r=new RegExp("\\".concat(n,"\\b"),"g");var O=y.replace(oa,""),$=Ro(x||f?"".concat(x," ").concat(f," { ").concat(O," }"):O);i.namespace&&($=ur($,i.namespace));var C=[];return ht($,Oo(u.concat(Po(function(m){return C.push(m)})))),C};return g.hash=l.length?l.reduce(function(y,f){return f.name||Ie(15),Fe(y,f.name)},rr).toString():"",g}var sa=new dr,Bt=aa(),pr=P.createContext({shouldForwardProp:void 0,styleSheet:sa,stylis:Bt});pr.Consumer;P.createContext(void 0);function An(){return s.useContext(pr)}var ia=function(){function e(t,n){var r=this;this.inject=function(o,a){a===void 0&&(a=Bt);var i=r.name+a.hash;o.hasNameForId(r.id,i)||o.insertRules(r.id,i,a(r.rules,i,"@keyframes"))},this.name=t,this.id="sc-keyframes-".concat(t),this.rules=n,Zt(this,function(){throw Ie(12,String(r.name))})}return e.prototype.getName=function(t){return t===void 0&&(t=Bt),this.name+t.hash},e}(),la=function(e){return e>="A"&&e<="Z"};function _n(e){for(var t="",n=0;n<e.length;n++){var r=e[n];if(n===1&&r==="-"&&e[0]==="-")return e;la(r)?t+="-"+r.toLowerCase():t+=r}return t.startsWith("ms-")?"-"+t:t}var gr=function(e){return e==null||e===!1||e===""},fr=function(e){var t,n,r=[];for(var o in e){var a=e[o];e.hasOwnProperty(o)&&!gr(a)&&(Array.isArray(a)&&a.isCss||De(a)?r.push("".concat(_n(o),":"),a,";"):Qe(a)?r.push.apply(r,ft(ft(["".concat(o," {")],fr(a),!1),["}"],!1)):r.push("".concat(_n(o),": ").concat((t=o,(n=a)==null||typeof n=="boolean"||n===""?"":typeof n!="number"||n===0||t in Do||t.startsWith("--")?String(n).trim():"".concat(n,"px")),";")))}return r};function ke(e,t,n,r){if(gr(e))return[];if(Kt(e))return[".".concat(e.styledComponentId)];if(De(e)){if(!De(a=e)||a.prototype&&a.prototype.isReactComponent||!t)return[e];var o=e(t);return ke(o,t,n,r)}var a;return e instanceof ia?n?(e.inject(n,r),[e.getName(r)]):[e]:Qe(e)?fr(e):Array.isArray(e)?Array.prototype.concat.apply($t,e.map(function(i){return ke(i,t,n,r)})):[e.toString()]}function ca(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(De(n)&&!Kt(n))return!1}return!0}var da=or(Rt),ua=function(){function e(t,n,r){this.rules=t,this.staticRulesId="",this.isStatic=(r===void 0||r.isStatic)&&ca(t),this.componentId=n,this.baseHash=Fe(da,n),this.baseStyle=r,dr.registerId(n)}return e.prototype.generateAndInjectStyles=function(t,n,r){var o=this.baseStyle?this.baseStyle.generateAndInjectStyles(t,n,r):"";if(this.isStatic&&!r.hash)if(this.staticRulesId&&n.hasNameForId(this.componentId,this.staticRulesId))o=Oe(o,this.staticRulesId);else{var a=Dn(ke(this.rules,t,n,r)),i=zt(Fe(this.baseHash,a)>>>0);if(!n.hasNameForId(this.componentId,i)){var d=r(a,".".concat(i),void 0,this.componentId);n.insertRules(this.componentId,i,d)}o=Oe(o,i),this.staticRulesId=i}else{for(var l=Fe(this.baseHash,r.hash),h="",u=0;u<this.rules.length;u++){var g=this.rules[u];if(typeof g=="string")h+=g;else if(g){var y=Dn(ke(g,t,n,r));l=Fe(l,y+u),h+=y}}if(h){var f=zt(l>>>0);n.hasNameForId(this.componentId,f)||n.insertRules(this.componentId,f,r(h,".".concat(f),void 0,this.componentId)),o=Oe(o,f)}}return o},e}(),wt=P.createContext(void 0);wt.Consumer;function pa(e){var t=P.useContext(wt),n=s.useMemo(function(){return function(r,o){if(!r)throw Ie(14);if(De(r)){var a=r(o);return a}if(Array.isArray(r)||typeof r!="object")throw Ie(8);return o?Y(Y({},o),r):r}(e.theme,t)},[e.theme,t]);return e.children?P.createElement(wt.Provider,{value:n},e.children):null}var Ht={};function ga(e,t,n){var r=Kt(e),o=e,a=!_t(e),i=t.attrs,d=i===void 0?$t:i,l=t.componentId,h=l===void 0?function(v,D){var S=typeof v!="string"?"sc":$n(v);Ht[S]=(Ht[S]||0)+1;var p="".concat(S,"-").concat(To(Rt+S+Ht[S]));return D?"".concat(D,"-").concat(p):p}(t.displayName,t.parentComponentId):l,u=t.displayName,g=u===void 0?function(v){return _t(v)?"styled.".concat(v):"Styled(".concat(Fo(v),")")}(e):u,y=t.displayName&&t.componentId?"".concat($n(t.displayName),"-").concat(t.componentId):t.componentId||h,f=r&&o.attrs?o.attrs.concat(d).filter(Boolean):d,x=t.shouldForwardProp;if(r&&o.shouldForwardProp){var R=o.shouldForwardProp;if(t.shouldForwardProp){var O=t.shouldForwardProp;x=function(v,D){return R(v,D)&&O(v,D)}}else x=R}var $=new ua(n,y,r?o.componentStyle:void 0);function C(v,D){return function(S,p,j){var q=S.attrs,V=S.componentStyle,ee=S.defaultProps,se=S.foldedComponentIds,H=S.styledComponentId,fe=S.target,Ce=P.useContext(wt),he=An(),ie=S.shouldForwardProp||he.shouldForwardProp,je=jo(p,Ce,ee)||ze,K=function(ue,X,be){for(var pe,te=Y(Y({},X),{className:void 0,theme:be}),Re=0;Re<ue.length;Re+=1){var Q=De(pe=ue[Re])?pe(te):pe;for(var B in Q)te[B]=B==="className"?Oe(te[B],Q[B]):B==="style"?Y(Y({},te[B]),Q[B]):Q[B]}return X.className&&(te.className=Oe(te.className,X.className)),te}(q,p,je),me=K.as||fe,de={};for(var z in K)K[z]===void 0||z[0]==="$"||z==="as"||z==="theme"&&K.theme===je||(z==="forwardedAs"?de.as=K.forwardedAs:ie&&!ie(z,me)||(de[z]=K[z]));var Se=function(ue,X){var be=An(),pe=ue.generateAndInjectStyles(X,be.styleSheet,be.stylis);return pe}(V,K),Z=Oe(se,H);return Se&&(Z+=" "+Se),K.className&&(Z+=" "+K.className),de[_t(me)&&!nr.has(me)?"class":"className"]=Z,j&&(de.ref=j),s.createElement(me,de)}(m,v,D)}C.displayName=g;var m=P.forwardRef(C);return m.attrs=f,m.componentStyle=$,m.displayName=g,m.shouldForwardProp=x,m.foldedComponentIds=r?Oe(o.foldedComponentIds,o.styledComponentId):"",m.styledComponentId=y,m.target=r?o.target:e,Object.defineProperty(m,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(v){this._foldedDefaultProps=r?function(D){for(var S=[],p=1;p<arguments.length;p++)S[p-1]=arguments[p];for(var j=0,q=S;j<q.length;j++)Wt(D,q[j],!0);return D}({},o.defaultProps,v):v}}),Zt(m,function(){return".".concat(m.styledComponentId)}),a&&lr(m,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),m}function Hn(e,t){for(var n=[e[0]],r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n}var Tn=function(e){return Object.assign(e,{isCss:!0})};function L(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(De(e)||Qe(e))return Tn(ke(Hn($t,ft([e],t,!0))));var r=e;return t.length===0&&r.length===1&&typeof r[0]=="string"?ke(r):Tn(ke(Hn(r,t)))}function Gt(e,t,n){if(n===void 0&&(n=ze),!t)throw Ie(1,t);var r=function(o){for(var a=[],i=1;i<arguments.length;i++)a[i-1]=arguments[i];return e(t,n,L.apply(void 0,ft([o],a,!1)))};return r.attrs=function(o){return Gt(e,t,Y(Y({},n),{attrs:Array.prototype.concat(n.attrs,o).filter(Boolean)}))},r.withConfig=function(o){return Gt(e,t,Y(Y({},n),o))},r}var hr=function(e){return Gt(ga,e)},k=hr;nr.forEach(function(e){k[e]=hr(e)});var ve;function We(e,t){return e[t]}function fa(e=[],t,n=0){return[...e.slice(0,n),t,...e.slice(n)]}function ha(e=[],t,n="id"){const r=e.slice(),o=We(t,n);return o?r.splice(r.findIndex(a=>We(a,n)===o),1):r.splice(r.findIndex(a=>a===t),1),r}function Fn(e){return e.map((t,n)=>{const r=Object.assign(Object.assign({},t),{sortable:t.sortable||!!t.sortFunction||void 0});return t.id||(r.id=n+1),r})}function Ze(e,t){return Math.ceil(e/t)}function Tt(e,t){return Math.min(e,t)}(function(e){e.ASC="asc",e.DESC="desc"})(ve||(ve={}));const M=()=>null;function mr(e,t=[],n=[]){let r={},o=[...n];return t.length&&t.forEach(a=>{if(!a.when||typeof a.when!="function")throw new Error('"when" must be defined in the conditional style object and must be function');a.when(e)&&(r=a.style||{},a.classNames&&(o=[...o,...a.classNames]),typeof a.style=="function"&&(r=a.style(e)||{}))}),{conditionalStyle:r,classNames:o.join(" ")}}function gt(e,t=[],n="id"){const r=We(e,n);return r?t.some(o=>We(o,n)===r):t.some(o=>o===e)}function st(e,t){return t?e.findIndex(n=>Xe(n.id,t)):-1}function Xe(e,t){return e==t}function ma(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case"SELECT_ALL_ROWS":{const{keyField:r,rows:o,rowCount:a,mergeSelections:i}=t,d=!e.allSelected,l=!e.toggleOnSelectedRowsChange;if(i){const h=d?[...e.selectedRows,...o.filter(u=>!gt(u,e.selectedRows,r))]:e.selectedRows.filter(u=>!gt(u,o,r));return Object.assign(Object.assign({},e),{allSelected:d,selectedCount:h.length,selectedRows:h,toggleOnSelectedRowsChange:l})}return Object.assign(Object.assign({},e),{allSelected:d,selectedCount:d?a:0,selectedRows:d?o:[],toggleOnSelectedRowsChange:l})}case"SELECT_SINGLE_ROW":{const{keyField:r,row:o,isSelected:a,rowCount:i,singleSelect:d}=t;return d?a?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:!1,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:!1,selectedRows:[o],toggleOnSelectedRowsChange:n}):a?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:!1,selectedRows:ha(e.selectedRows,o,r),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===i,selectedRows:fa(e.selectedRows,o),toggleOnSelectedRowsChange:n})}case"SELECT_MULTIPLE_ROWS":{const{keyField:r,selectedRows:o,totalRows:a,mergeSelections:i}=t;if(i){const d=[...e.selectedRows,...o.filter(l=>!gt(l,e.selectedRows,r))];return Object.assign(Object.assign({},e),{selectedCount:d.length,allSelected:!1,selectedRows:d,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:o.length,allSelected:o.length===a,selectedRows:o,toggleOnSelectedRowsChange:n})}case"CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:r}=t;return Object.assign(Object.assign({},e),{allSelected:!1,selectedCount:0,selectedRows:[],selectedRowsFlag:r})}case"SORT_CHANGE":{const{sortDirection:r,selectedColumn:o,clearSelectedOnSort:a}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:o,sortDirection:r,currentPage:1}),a&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_PAGE":{const{page:r,paginationServer:o,visibleOnly:a,persistSelectedOnPageChange:i}=t,d=o&&i,l=o&&!i||a;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:r}),d&&{allSelected:!1}),l&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:r,page:o}=t;return Object.assign(Object.assign({},e),{currentPage:o,rowsPerPage:r})}}}const ba=L`
	pointer-events: none;
	opacity: 0.4;
`,wa=k.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&ba};
	${({theme:e})=>e.table.style};
`,ya=L`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,xa=k.div`
	display: flex;
	width: 100%;
	${({$fixedHeader:e})=>e&&ya};
	${({theme:e})=>e.head.style};
`,va=k.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({$dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,br=(e,...t)=>L`
		@media screen and (max-width: ${599}px) {
			${L(e,...t)}
		}
	`,Ca=(e,...t)=>L`
		@media screen and (max-width: ${959}px) {
			${L(e,...t)}
		}
	`,Sa=(e,...t)=>L`
		@media screen and (max-width: ${1280}px) {
			${L(e,...t)}
		}
	`,Ra=e=>(t,...n)=>L`
			@media screen and (max-width: ${e}px) {
				${L(t,...n)}
			}
		`,Ye=k.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,$headCell:t})=>e[t?"headCells":"cells"].style};
	${({$noPadding:e})=>e&&"padding: 0"};
`,wr=k(Ye)`
	flex-grow: ${({button:e,grow:t})=>t===0||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&L`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&e==="sm"&&br`
    display: none;
  `};
	${({hide:e})=>e&&e==="md"&&Ca`
    display: none;
  `};
	${({hide:e})=>e&&e==="lg"&&Sa`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&Ra(e)`
    display: none;
  `};
`,$a=L`
	div:first-child {
		white-space: ${({$wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({$allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,Ea=k(wr).attrs(e=>({style:e.style}))`
	${({$renderAsCell:e})=>!e&&$a};
	${({theme:e,$isDragging:t})=>t&&e.cells.draggingStyle};
	${({$cellStyle:e})=>e};
`;var Oa=s.memo(function({id:e,column:t,row:n,rowIndex:r,dataTag:o,isDragging:a,onDragStart:i,onDragOver:d,onDragEnd:l,onDragEnter:h,onDragLeave:u}){const{conditionalStyle:g,classNames:y}=mr(n,t.conditionalCellStyles,["rdt_TableCell"]);return s.createElement(Ea,{id:e,"data-column-id":t.id,role:"cell",className:y,"data-tag":o,$cellStyle:t.style,$renderAsCell:!!t.cell,$allowOverflow:t.allowOverflow,button:t.button,center:t.center,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,width:t.width,$wrapCell:t.wrap,style:g,$isDragging:a,onDragStart:i,onDragOver:d,onDragEnd:l,onDragEnter:h,onDragLeave:u},!t.cell&&s.createElement("div",{"data-tag":o},function(f,x,R,O){return x?R&&typeof R=="function"?R(f,O):x(f,O):null}(n,t.selector,t.format,r)),t.cell&&t.cell(n,r,t,e))});const Nn="input";var yr=s.memo(function({name:e,component:t=Nn,componentOptions:n={style:{}},indeterminate:r=!1,checked:o=!1,disabled:a=!1,onClick:i=M}){const d=t,l=d!==Nn?n.style:(u=>Object.assign(Object.assign({fontSize:"18px"},!u&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(a),h=s.useMemo(()=>function(u,...g){let y;return Object.keys(u).map(f=>u[f]).forEach((f,x)=>{typeof f=="function"&&(y=Object.assign(Object.assign({},u),{[Object.keys(u)[x]]:f(...g)}))}),y||u}(n,r),[n,r]);return s.createElement(d,Object.assign({type:"checkbox",ref:u=>{u&&(u.indeterminate=r)},style:l,onClick:a?M:i,name:e,"aria-label":e,checked:o,disabled:a},h,{onChange:M}))});const Pa=k(Ye)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function ka({name:e,keyField:t,row:n,rowCount:r,selected:o,selectableRowsComponent:a,selectableRowsComponentProps:i,selectableRowsSingle:d,selectableRowDisabled:l,onSelectedRow:h}){const u=!(!l||!l(n));return s.createElement(Pa,{onClick:g=>g.stopPropagation(),className:"rdt_TableCell",$noPadding:!0},s.createElement(yr,{name:e,component:a,componentOptions:i,checked:o,"aria-checked":o,onClick:()=>{h({type:"SELECT_SINGLE_ROW",row:n,isSelected:o,keyField:t,rowCount:r,singleSelect:d})},disabled:u}))}const Da=k.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function Ia({disabled:e=!1,expanded:t=!1,expandableIcon:n,id:r,row:o,onToggled:a}){const i=t?n.expanded:n.collapsed;return s.createElement(Da,{"aria-disabled":e,onClick:()=>a&&a(o),"data-testid":`expander-button-${r}`,disabled:e,"aria-label":t?"Collapse Row":"Expand Row",role:"button",type:"button"},i)}const ja=k(Ye)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function Aa({row:e,expanded:t=!1,expandableIcon:n,id:r,onToggled:o,disabled:a=!1}){return s.createElement(ja,{onClick:i=>i.stopPropagation(),$noPadding:!0},s.createElement(Ia,{id:r,row:e,expanded:t,expandableIcon:n,disabled:a,onToggled:o}))}const _a=k.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({$extendedRowStyle:e})=>e};
`;var Ha=s.memo(function({data:e,ExpanderComponent:t,expanderComponentProps:n,extendedRowStyle:r,extendedClassNames:o}){const a=["rdt_ExpanderRow",...o.split(" ").filter(i=>i!=="rdt_TableRow")].join(" ");return s.createElement(_a,{className:a,$extendedRowStyle:r},s.createElement(t,Object.assign({data:e},n)))});const Ft="allowRowEvents";var yt,Yt,Mn;(function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto"})(yt||(yt={})),function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center"}(Yt||(Yt={})),function(e){e.SM="sm",e.MD="md",e.LG="lg"}(Mn||(Mn={}));const Ta=L`
	&:hover {
		${({$highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,Fa=L`
	&:hover {
		cursor: pointer;
	}
`,Na=k.div.attrs(e=>({style:e.style}))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({$dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({$striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({$highlightOnHover:e})=>e&&Ta};
	${({$pointerOnHover:e})=>e&&Fa};
	${({$selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
	${({$conditionalStyle:e})=>e};
`;function Ma({columns:e=[],conditionalRowStyles:t=[],defaultExpanded:n=!1,defaultExpanderDisabled:r=!1,dense:o=!1,expandableIcon:a,expandableRows:i=!1,expandableRowsComponent:d,expandableRowsComponentProps:l,expandableRowsHideExpander:h,expandOnRowClicked:u=!1,expandOnRowDoubleClicked:g=!1,highlightOnHover:y=!1,id:f,expandableInheritConditionalStyles:x,keyField:R,onRowClicked:O=M,onRowDoubleClicked:$=M,onRowMouseEnter:C=M,onRowMouseLeave:m=M,onRowExpandToggled:v=M,onSelectedRow:D=M,pointerOnHover:S=!1,row:p,rowCount:j,rowIndex:q,selectableRowDisabled:V=null,selectableRows:ee=!1,selectableRowsComponent:se,selectableRowsComponentProps:H,selectableRowsHighlight:fe=!1,selectableRowsSingle:Ce=!1,selected:he,striped:ie=!1,draggingColumnId:je,onDragStart:K,onDragOver:me,onDragEnd:de,onDragEnter:z,onDragLeave:Se}){const[Z,ue]=s.useState(n);s.useEffect(()=>{ue(n)},[n]);const X=s.useCallback(()=>{ue(!Z),v(!Z,p)},[Z,v,p]),be=S||i&&(u||g),pe=s.useCallback(F=>{F.target.getAttribute("data-tag")===Ft&&(O(p,F),!r&&i&&u&&X())},[r,u,i,X,O,p]),te=s.useCallback(F=>{F.target.getAttribute("data-tag")===Ft&&($(p,F),!r&&i&&g&&X())},[r,g,i,X,$,p]),Re=s.useCallback(F=>{C(p,F)},[C,p]),Q=s.useCallback(F=>{m(p,F)},[m,p]),B=We(p,R),{conditionalStyle:et,classNames:tt}=mr(p,t,["rdt_TableRow"]),Et=fe&&he,Ot=x?et:{},Pt=ie&&q%2==0;return s.createElement(s.Fragment,null,s.createElement(Na,{id:`row-${f}`,role:"row",$striped:Pt,$highlightOnHover:y,$pointerOnHover:!r&&be,$dense:o,onClick:pe,onDoubleClick:te,onMouseEnter:Re,onMouseLeave:Q,className:tt,$selected:Et,$conditionalStyle:et},ee&&s.createElement(ka,{name:`select-row-${B}`,keyField:R,row:p,rowCount:j,selected:he,selectableRowsComponent:se,selectableRowsComponentProps:H,selectableRowDisabled:V,selectableRowsSingle:Ce,onSelectedRow:D}),i&&!h&&s.createElement(Aa,{id:B,expandableIcon:a,expanded:Z,row:p,onToggled:X,disabled:r}),e.map(F=>F.omit?null:s.createElement(Oa,{id:`cell-${F.id}-${B}`,key:`cell-${F.id}-${B}`,dataTag:F.ignoreRowClick||F.button?null:Ft,column:F,row:p,rowIndex:q,isDragging:Xe(je,F.id),onDragStart:K,onDragOver:me,onDragEnd:de,onDragEnter:z,onDragLeave:Se}))),i&&Z&&s.createElement(Ha,{key:`expander-${B}`,data:p,extendedRowStyle:Ot,extendedClassNames:tt,ExpanderComponent:d,expanderComponentProps:l}))}const La=k.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({$sortDirection:e})=>e==="desc"&&"transform: rotate(180deg)"};
`,za=({sortActive:e,sortDirection:t})=>P.createElement(La,{$sortActive:e,$sortDirection:t},"▲"),Wa=k(wr)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,$isDragging:t})=>t&&e.headCells.draggingStyle};
`,Ba=L`
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({$sortActive:e})=>!e&&L`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,Ga=k.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&Ba};
`,Ya=k.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var Va=s.memo(function({column:e,disabled:t,draggingColumnId:n,selectedColumn:r={},sortDirection:o,sortIcon:a,sortServer:i,pagination:d,paginationServer:l,persistSelectedOnSort:h,selectableRowsVisibleOnly:u,onSort:g,onDragStart:y,onDragOver:f,onDragEnd:x,onDragEnter:R,onDragLeave:O}){s.useEffect(()=>{typeof e.selector=="string"&&console.error(`Warning: ${e.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)},[]);const[$,C]=s.useState(!1),m=s.useRef(null);if(s.useEffect(()=>{m.current&&C(m.current.scrollWidth>m.current.clientWidth)},[$]),e.omit)return null;const v=()=>{if(!e.sortable&&!e.selector)return;let H=o;Xe(r.id,e.id)&&(H=o===ve.ASC?ve.DESC:ve.ASC),g({type:"SORT_CHANGE",sortDirection:H,selectedColumn:e,clearSelectedOnSort:d&&l&&!h||i||u})},D=H=>s.createElement(za,{sortActive:H,sortDirection:o}),S=()=>s.createElement("span",{className:[o,"__rdt_custom_sort_icon__"].join(" ")},a),p=!(!e.sortable||!Xe(r.id,e.id)),j=!e.sortable||t,q=e.sortable&&!a&&!e.right,V=e.sortable&&!a&&e.right,ee=e.sortable&&a&&!e.right,se=e.sortable&&a&&e.right;return s.createElement(Wa,{"data-column-id":e.id,className:"rdt_TableCol",$headCell:!0,allowOverflow:e.allowOverflow,button:e.button,compact:e.compact,grow:e.grow,hide:e.hide,maxWidth:e.maxWidth,minWidth:e.minWidth,right:e.right,center:e.center,width:e.width,draggable:e.reorder,$isDragging:Xe(e.id,n),onDragStart:y,onDragOver:f,onDragEnd:x,onDragEnter:R,onDragLeave:O},e.name&&s.createElement(Ga,{"data-column-id":e.id,"data-sort-id":e.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:j?void 0:v,onKeyPress:j?void 0:H=>{H.key==="Enter"&&v()},$sortActive:!j&&p,disabled:j},!j&&se&&S(),!j&&V&&D(p),typeof e.name=="string"?s.createElement(Ya,{title:$?e.name:void 0,ref:m,"data-column-id":e.id},e.name):e.name,!j&&ee&&S(),!j&&q&&D(p)))});const Ua=k(Ye)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function qa({headCell:e=!0,rowData:t,keyField:n,allSelected:r,mergeSelections:o,selectedRows:a,selectableRowsComponent:i,selectableRowsComponentProps:d,selectableRowDisabled:l,onSelectAllRows:h}){const u=a.length>0&&!r,g=l?t.filter(x=>!l(x)):t,y=g.length===0,f=Math.min(t.length,g.length);return s.createElement(Ua,{className:"rdt_TableCol",$headCell:e,$noPadding:!0},s.createElement(yr,{name:"select-all-rows",component:i,componentOptions:d,onClick:()=>{h({type:"SELECT_ALL_ROWS",rows:g,rowCount:f,mergeSelections:o,keyField:n})},checked:r,indeterminate:u,disabled:y}))}function xr(e=yt.AUTO){const t=typeof window=="object",[n,r]=s.useState(!1);return s.useEffect(()=>{if(t)if(e!=="auto")r(e==="rtl");else{const o=!(!window.document||!window.document.createElement),a=document.getElementsByTagName("BODY")[0],i=document.getElementsByTagName("HTML")[0],d=a.dir==="rtl"||i.dir==="rtl";r(o&&d)}},[e,t]),n}const Ka=k.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,Za=k.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,Ln=k.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: inherit;
	z-index: 1;
	align-items: center;
	justify-content: space-between;
	display: flex;
	${({$rtl:e})=>e&&"direction: rtl"};
	${({theme:e})=>e.contextMenu.style};
	${({theme:e,$visible:t})=>t&&e.contextMenu.activeStyle};
`;function Xa({contextMessage:e,contextActions:t,contextComponent:n,selectedCount:r,direction:o}){const a=xr(o),i=r>0;return n?s.createElement(Ln,{$visible:i},s.cloneElement(n,{selectedCount:r})):s.createElement(Ln,{$visible:i,$rtl:a},s.createElement(Ka,null,((d,l,h)=>{if(l===0)return null;const u=l===1?d.singular:d.plural;return h?`${l} ${d.message||""} ${u}`:`${l} ${u} ${d.message||""}`})(e,r,a)),s.createElement(Za,null,t))}const Qa=k.div`
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({theme:e})=>e.header.style}
`,Ja=k.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,es=k.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,ts=({title:e,actions:t=null,contextMessage:n,contextActions:r,contextComponent:o,selectedCount:a,direction:i,showMenu:d=!0})=>s.createElement(Qa,{className:"rdt_TableHeader",role:"heading","aria-level":1},s.createElement(Ja,null,e),t&&s.createElement(es,null,t),d&&s.createElement(Xa,{contextMessage:n,contextActions:r,contextComponent:o,direction:i,selectedCount:a}));function vr(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function"){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}const ns={left:"flex-start",right:"flex-end",center:"center"},rs=k.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>ns[e]};
	flex-wrap: ${({$wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,os=e=>{var{align:t="right",wrapContent:n=!0}=e,r=vr(e,["align","wrapContent"]);return s.createElement(rs,Object.assign({align:t,$wrapContent:n},r))},as=k.div`
	display: flex;
	flex-direction: column;
`,ss=k.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({$responsive:e,$fixedHeader:t})=>e&&L`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${t?"auto":"hidden"};
			min-height: 0;
		`};

	${({$fixedHeader:e=!1,$fixedHeaderScrollHeight:t="100vh"})=>e&&L`
			max-height: ${t};
			-webkit-overflow-scrolling: touch;
		`};

	${({theme:e})=>e.responsiveWrapper.style};
`,zn=k.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,is=k.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,ls=k(Ye)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,cs=k.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,ds=()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},P.createElement("path",{d:"M7 10l5 5 5-5z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),us=k.select`
	cursor: pointer;
	height: 24px;
	max-width: 100%;
	user-select: none;
	padding-left: 8px;
	padding-right: 24px;
	box-sizing: content-box;
	font-size: inherit;
	color: inherit;
	border: none;
	background-color: transparent;
	appearance: none;
	direction: ltr;
	flex-shrink: 0;

	&::-ms-expand {
		display: none;
	}

	&:disabled::-ms-expand {
		background: #f60;
	}

	option {
		color: initial;
	}
`,ps=k.div`
	position: relative;
	flex-shrink: 0;
	font-size: inherit;
	color: inherit;
	margin-top: 1px;

	svg {
		top: 0;
		right: 0;
		color: inherit;
		position: absolute;
		fill: currentColor;
		width: 24px;
		height: 24px;
		display: inline-block;
		user-select: none;
		pointer-events: none;
	}
`,gs=e=>{var{defaultValue:t,onChange:n}=e,r=vr(e,["defaultValue","onChange"]);return s.createElement(ps,null,s.createElement(us,Object.assign({onChange:n,defaultValue:t},r)),s.createElement(ds,null))},c={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return P.createElement("div",null,"To add an expander pass in a component instance via ",P.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:P.createElement(()=>P.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},P.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),P.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"})),null),expanded:P.createElement(()=>P.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},P.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),P.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"})),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:P.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:P.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:Yt.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),P.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"})),null),paginationIconLastPage:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),P.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"})),null),paginationIconNext:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),null),paginationIconPrevious:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:yt.AUTO,onChangePage:M,onChangeRowsPerPage:M,onRowClicked:M,onRowDoubleClicked:M,onRowMouseEnter:M,onRowMouseLeave:M,onRowExpandToggled:M,onSelectedRowsChange:M,onSort:M,onColumnOrderChange:M},fs={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},hs=k.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,it=k.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({$isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,ms=k.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${br`
    width: 100%;
    justify-content: space-around;
  `};
`,Cr=k.span`
	flex-shrink: 1;
	user-select: none;
`,bs=k(Cr)`
	margin: 0 24px;
`,ws=k(Cr)`
	margin: 0 4px;
`;var ys=s.memo(function({rowsPerPage:e,rowCount:t,currentPage:n,direction:r=c.direction,paginationRowsPerPageOptions:o=c.paginationRowsPerPageOptions,paginationIconLastPage:a=c.paginationIconLastPage,paginationIconFirstPage:i=c.paginationIconFirstPage,paginationIconNext:d=c.paginationIconNext,paginationIconPrevious:l=c.paginationIconPrevious,paginationComponentOptions:h=c.paginationComponentOptions,onChangeRowsPerPage:u=c.onChangeRowsPerPage,onChangePage:g=c.onChangePage}){const y=(()=>{const H=typeof window=="object";function fe(){return{width:H?window.innerWidth:void 0,height:H?window.innerHeight:void 0}}const[Ce,he]=s.useState(fe);return s.useEffect(()=>{if(!H)return()=>null;function ie(){he(fe())}return window.addEventListener("resize",ie),()=>window.removeEventListener("resize",ie)},[]),Ce})(),f=xr(r),x=y.width&&y.width>599,R=Ze(t,e),O=n*e,$=O-e+1,C=n===1,m=n===R,v=Object.assign(Object.assign({},fs),h),D=n===R?`${$}-${t} ${v.rangeSeparatorText} ${t}`:`${$}-${O} ${v.rangeSeparatorText} ${t}`,S=s.useCallback(()=>g(n-1),[n,g]),p=s.useCallback(()=>g(n+1),[n,g]),j=s.useCallback(()=>g(1),[g]),q=s.useCallback(()=>g(Ze(t,e)),[g,t,e]),V=s.useCallback(H=>u(Number(H.target.value),n),[n,u]),ee=o.map(H=>s.createElement("option",{key:H,value:H},H));v.selectAllRowsItem&&ee.push(s.createElement("option",{key:-1,value:t},v.selectAllRowsItemText));const se=s.createElement(gs,{onChange:V,defaultValue:e,"aria-label":v.rowsPerPageText},ee);return s.createElement(hs,{className:"rdt_Pagination"},!v.noRowsPerPage&&x&&s.createElement(s.Fragment,null,s.createElement(ws,null,v.rowsPerPageText),se),x&&s.createElement(bs,null,D),s.createElement(ms,null,s.createElement(it,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:j,disabled:C,$isRTL:f},i),s.createElement(it,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,$isRTL:f},l),!v.noRowsPerPage&&!x&&se,s.createElement(it,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":m,onClick:p,disabled:m,$isRTL:f},d),s.createElement(it,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":m,onClick:q,disabled:m,$isRTL:f},a)))});const Ee=(e,t)=>{const n=s.useRef(!0);s.useEffect(()=>{n.current?n.current=!1:e()},t)};function xs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var vs=function(e){return function(t){return!!t&&typeof t=="object"}(e)&&!function(t){var n=Object.prototype.toString.call(t);return n==="[object RegExp]"||n==="[object Date]"||function(r){return r.$$typeof===Cs}(t)}(e)},Cs=typeof Symbol=="function"&&Symbol.for?Symbol.for("react.element"):60103;function Je(e,t){return t.clone!==!1&&t.isMergeableObject(e)?Be((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function Ss(e,t,n){return e.concat(t).map(function(r){return Je(r,n)})}function Wn(e){return Object.keys(e).concat(function(t){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter(function(n){return Object.propertyIsEnumerable.call(t,n)}):[]}(e))}function Bn(e,t){try{return t in e}catch{return!1}}function Rs(e,t,n){var r={};return n.isMergeableObject(e)&&Wn(e).forEach(function(o){r[o]=Je(e[o],n)}),Wn(t).forEach(function(o){(function(a,i){return Bn(a,i)&&!(Object.hasOwnProperty.call(a,i)&&Object.propertyIsEnumerable.call(a,i))})(e,o)||(Bn(e,o)&&n.isMergeableObject(t[o])?r[o]=function(a,i){if(!i.customMerge)return Be;var d=i.customMerge(a);return typeof d=="function"?d:Be}(o,n)(e[o],t[o],n):r[o]=Je(t[o],n))}),r}function Be(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||Ss,n.isMergeableObject=n.isMergeableObject||vs,n.cloneUnlessOtherwiseSpecified=Je;var r=Array.isArray(t);return r===Array.isArray(e)?r?n.arrayMerge(e,t,n):Rs(e,t,n):Je(t,n)}Be.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce(function(n,r){return Be(n,r,t)},{})};var $s=xs(Be);const Gn={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},Yn={default:Gn,light:Gn,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Es(e,t,n,r){const[o,a]=s.useState(()=>Fn(e)),[i,d]=s.useState(""),l=s.useRef("");Ee(()=>{a(Fn(e))},[e]);const h=s.useCallback(O=>{var $,C,m;const{attributes:v}=O.target,D=($=v.getNamedItem("data-column-id"))===null||$===void 0?void 0:$.value;D&&(l.current=((m=(C=o[st(o,D)])===null||C===void 0?void 0:C.id)===null||m===void 0?void 0:m.toString())||"",d(l.current))},[o]),u=s.useCallback(O=>{var $;const{attributes:C}=O.target,m=($=C.getNamedItem("data-column-id"))===null||$===void 0?void 0:$.value;if(m&&l.current&&m!==l.current){const v=st(o,l.current),D=st(o,m),S=[...o];S[v]=o[D],S[D]=o[v],a(S),t(S)}},[t,o]),g=s.useCallback(O=>{O.preventDefault()},[]),y=s.useCallback(O=>{O.preventDefault()},[]),f=s.useCallback(O=>{O.preventDefault(),l.current="",d("")},[]),x=function(O=!1){return O?ve.ASC:ve.DESC}(r),R=s.useMemo(()=>o[st(o,n==null?void 0:n.toString())]||{},[n,o]);return{tableColumns:o,draggingColumnId:i,handleDragStart:h,handleDragEnter:u,handleDragOver:g,handleDragLeave:y,handleDragEnd:f,defaultSortDirection:x,defaultSortColumn:R}}var Os=s.memo(function(e){const{data:t=c.data,columns:n=c.columns,title:r=c.title,actions:o=c.actions,keyField:a=c.keyField,striped:i=c.striped,highlightOnHover:d=c.highlightOnHover,pointerOnHover:l=c.pointerOnHover,dense:h=c.dense,selectableRows:u=c.selectableRows,selectableRowsSingle:g=c.selectableRowsSingle,selectableRowsHighlight:y=c.selectableRowsHighlight,selectableRowsNoSelectAll:f=c.selectableRowsNoSelectAll,selectableRowsVisibleOnly:x=c.selectableRowsVisibleOnly,selectableRowSelected:R=c.selectableRowSelected,selectableRowDisabled:O=c.selectableRowDisabled,selectableRowsComponent:$=c.selectableRowsComponent,selectableRowsComponentProps:C=c.selectableRowsComponentProps,onRowExpandToggled:m=c.onRowExpandToggled,onSelectedRowsChange:v=c.onSelectedRowsChange,expandableIcon:D=c.expandableIcon,onChangeRowsPerPage:S=c.onChangeRowsPerPage,onChangePage:p=c.onChangePage,paginationServer:j=c.paginationServer,paginationServerOptions:q=c.paginationServerOptions,paginationTotalRows:V=c.paginationTotalRows,paginationDefaultPage:ee=c.paginationDefaultPage,paginationResetDefaultPage:se=c.paginationResetDefaultPage,paginationPerPage:H=c.paginationPerPage,paginationRowsPerPageOptions:fe=c.paginationRowsPerPageOptions,paginationIconLastPage:Ce=c.paginationIconLastPage,paginationIconFirstPage:he=c.paginationIconFirstPage,paginationIconNext:ie=c.paginationIconNext,paginationIconPrevious:je=c.paginationIconPrevious,paginationComponent:K=c.paginationComponent,paginationComponentOptions:me=c.paginationComponentOptions,responsive:de=c.responsive,progressPending:z=c.progressPending,progressComponent:Se=c.progressComponent,persistTableHead:Z=c.persistTableHead,noDataComponent:ue=c.noDataComponent,disabled:X=c.disabled,noTableHead:be=c.noTableHead,noHeader:pe=c.noHeader,fixedHeader:te=c.fixedHeader,fixedHeaderScrollHeight:Re=c.fixedHeaderScrollHeight,pagination:Q=c.pagination,subHeader:B=c.subHeader,subHeaderAlign:et=c.subHeaderAlign,subHeaderWrap:tt=c.subHeaderWrap,subHeaderComponent:Et=c.subHeaderComponent,noContextMenu:Ot=c.noContextMenu,contextMessage:Pt=c.contextMessage,contextActions:F=c.contextActions,contextComponent:Sr=c.contextComponent,expandableRows:nt=c.expandableRows,onRowClicked:Xt=c.onRowClicked,onRowDoubleClicked:Qt=c.onRowDoubleClicked,onRowMouseEnter:Jt=c.onRowMouseEnter,onRowMouseLeave:en=c.onRowMouseLeave,sortIcon:Rr=c.sortIcon,onSort:$r=c.onSort,sortFunction:tn=c.sortFunction,sortServer:kt=c.sortServer,expandableRowsComponent:Er=c.expandableRowsComponent,expandableRowsComponentProps:Or=c.expandableRowsComponentProps,expandableRowDisabled:nn=c.expandableRowDisabled,expandableRowsHideExpander:rn=c.expandableRowsHideExpander,expandOnRowClicked:Pr=c.expandOnRowClicked,expandOnRowDoubleClicked:kr=c.expandOnRowDoubleClicked,expandableRowExpanded:on=c.expandableRowExpanded,expandableInheritConditionalStyles:Dr=c.expandableInheritConditionalStyles,defaultSortFieldId:Ir=c.defaultSortFieldId,defaultSortAsc:jr=c.defaultSortAsc,clearSelectedRows:an=c.clearSelectedRows,conditionalRowStyles:Ar=c.conditionalRowStyles,theme:sn=c.theme,customStyles:ln=c.customStyles,direction:Ve=c.direction,onColumnOrderChange:_r=c.onColumnOrderChange,className:Hr,ariaLabel:cn}=e,{tableColumns:dn,draggingColumnId:un,handleDragStart:pn,handleDragEnter:gn,handleDragOver:fn,handleDragLeave:hn,handleDragEnd:mn,defaultSortDirection:Tr,defaultSortColumn:Fr}=Es(n,_r,Ir,jr),[{rowsPerPage:we,currentPage:re,selectedRows:Dt,allSelected:bn,selectedCount:wn,selectedColumn:le,sortDirection:Ae,toggleOnSelectedRowsChange:Nr},$e]=s.useReducer(ma,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:Fr,toggleOnSelectedRowsChange:!1,sortDirection:Tr,currentPage:ee,rowsPerPage:H,selectedRowsFlag:!1,contextMessage:c.contextMessage}),{persistSelectedOnSort:yn=!1,persistSelectedOnPageChange:rt=!1}=q,xn=!(!j||!rt&&!yn),Mr=Q&&!z&&t.length>0,Lr=K||ys,zr=s.useMemo(()=>((b={},I="default",U="default")=>{const oe=Yn[I]?I:U;return $s({table:{style:{color:(w=Yn[oe]).text.primary,backgroundColor:w.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:w.text.primary,backgroundColor:w.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:w.background.default,minHeight:"52px"}},head:{style:{color:w.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:w.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:w.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:w.context.background,fontSize:"18px",fontWeight:400,color:w.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:w.text.primary,backgroundColor:w.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:w.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:w.selected.text,backgroundColor:w.selected.default,borderBottomColor:w.background.default}},highlightOnHoverStyle:{color:w.highlightOnHover.text,backgroundColor:w.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:w.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:w.background.default},stripedStyle:{color:w.striped.text,backgroundColor:w.striped.default}},expanderRow:{style:{color:w.text.primary,backgroundColor:w.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:w.button.default,fill:w.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:w.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:w.button.hover},"&:focus":{outline:"none",backgroundColor:w.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:w.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:w.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:w.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:w.button.default,fill:w.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:w.button.disabled,fill:w.button.disabled},"&:hover:not(:disabled)":{backgroundColor:w.button.hover},"&:focus":{outline:"none",backgroundColor:w.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:w.text.primary,backgroundColor:w.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:w.text.primary,backgroundColor:w.background.default}}},b);var w})(ln,sn),[ln,sn]),Wr=s.useMemo(()=>Object.assign({},Ve!=="auto"&&{dir:Ve}),[Ve]),G=s.useMemo(()=>{if(kt)return t;if(le!=null&&le.sortFunction&&typeof le.sortFunction=="function"){const b=le.sortFunction,I=Ae===ve.ASC?b:(U,oe)=>-1*b(U,oe);return[...t].sort(I)}return function(b,I,U,oe){return I?oe&&typeof oe=="function"?oe(b.slice(0),I,U):b.slice(0).sort((w,It)=>{const He=I(w),ye=I(It);if(U==="asc"){if(He<ye)return-1;if(He>ye)return 1}if(U==="desc"){if(He>ye)return-1;if(He<ye)return 1}return 0}):b}(t,le==null?void 0:le.selector,Ae,tn)},[kt,le,Ae,t,tn]),Ue=s.useMemo(()=>{if(Q&&!j){const b=re*we,I=b-we;return G.slice(I,b)}return G},[re,Q,j,we,G]),Br=s.useCallback(b=>{$e(b)},[]),Gr=s.useCallback(b=>{$e(b)},[]),Yr=s.useCallback(b=>{$e(b)},[]),Vr=s.useCallback((b,I)=>Xt(b,I),[Xt]),Ur=s.useCallback((b,I)=>Qt(b,I),[Qt]),qr=s.useCallback((b,I)=>Jt(b,I),[Jt]),Kr=s.useCallback((b,I)=>en(b,I),[en]),_e=s.useCallback(b=>$e({type:"CHANGE_PAGE",page:b,paginationServer:j,visibleOnly:x,persistSelectedOnPageChange:rt}),[j,rt,x]),Zr=s.useCallback(b=>{const I=Ze(V||Ue.length,b),U=Tt(re,I);j||_e(U),$e({type:"CHANGE_ROWS_PER_PAGE",page:U,rowsPerPage:b})},[re,_e,j,V,Ue.length]);if(Q&&!j&&G.length>0&&Ue.length===0){const b=Ze(G.length,we),I=Tt(re,b);_e(I)}Ee(()=>{v({allSelected:bn,selectedCount:wn,selectedRows:Dt.slice(0)})},[Nr]),Ee(()=>{$r(le,Ae,G.slice(0))},[le,Ae]),Ee(()=>{p(re,V||G.length)},[re]),Ee(()=>{S(we,re)},[we]),Ee(()=>{_e(ee)},[ee,se]),Ee(()=>{if(Q&&j&&V>0){const b=Ze(V,we),I=Tt(re,b);re!==I&&_e(I)}},[V]),s.useEffect(()=>{$e({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:an})},[g,an]),s.useEffect(()=>{if(!R)return;const b=G.filter(U=>R(U)),I=g?b.slice(0,1):b;$e({type:"SELECT_MULTIPLE_ROWS",keyField:a,selectedRows:I,totalRows:G.length,mergeSelections:xn})},[t,R]);const Xr=x?Ue:G,Qr=rt||g||f;return s.createElement(pa,{theme:zr},!pe&&(!!r||!!o)&&s.createElement(ts,{title:r,actions:o,showMenu:!Ot,selectedCount:wn,direction:Ve,contextActions:F,contextComponent:Sr,contextMessage:Pt}),B&&s.createElement(os,{align:et,wrapContent:tt},Et),s.createElement(ss,Object.assign({$responsive:de,$fixedHeader:te,$fixedHeaderScrollHeight:Re,className:Hr},Wr),s.createElement(is,null,z&&!Z&&s.createElement(zn,null,Se),s.createElement(wa,Object.assign({disabled:X,className:"rdt_Table",role:"table"},cn&&{"aria-label":cn}),!be&&(!!Z||G.length>0&&!z)&&s.createElement(xa,{className:"rdt_TableHead",role:"rowgroup",$fixedHeader:te},s.createElement(va,{className:"rdt_TableHeadRow",role:"row",$dense:h},u&&(Qr?s.createElement(Ye,{style:{flex:"0 0 48px"}}):s.createElement(qa,{allSelected:bn,selectedRows:Dt,selectableRowsComponent:$,selectableRowsComponentProps:C,selectableRowDisabled:O,rowData:Xr,keyField:a,mergeSelections:xn,onSelectAllRows:Gr})),nt&&!rn&&s.createElement(ls,null),dn.map(b=>s.createElement(Va,{key:b.id,column:b,selectedColumn:le,disabled:z||G.length===0,pagination:Q,paginationServer:j,persistSelectedOnSort:yn,selectableRowsVisibleOnly:x,sortDirection:Ae,sortIcon:Rr,sortServer:kt,onSort:Br,onDragStart:pn,onDragOver:fn,onDragEnd:mn,onDragEnter:gn,onDragLeave:hn,draggingColumnId:un})))),!G.length&&!z&&s.createElement(cs,null,ue),z&&Z&&s.createElement(zn,null,Se),!z&&G.length>0&&s.createElement(as,{className:"rdt_TableBody",role:"rowgroup"},Ue.map((b,I)=>{const U=We(b,a),oe=function(ye=""){return typeof ye!="number"&&(!ye||ye.length===0)}(U)?I:U,w=gt(b,Dt,a),It=!!(nt&&on&&on(b)),He=!!(nt&&nn&&nn(b));return s.createElement(Ma,{id:oe,key:oe,keyField:a,"data-row-id":oe,columns:dn,row:b,rowCount:G.length,rowIndex:I,selectableRows:u,expandableRows:nt,expandableIcon:D,highlightOnHover:d,pointerOnHover:l,dense:h,expandOnRowClicked:Pr,expandOnRowDoubleClicked:kr,expandableRowsComponent:Er,expandableRowsComponentProps:Or,expandableRowsHideExpander:rn,defaultExpanderDisabled:He,defaultExpanded:It,expandableInheritConditionalStyles:Dr,conditionalRowStyles:Ar,selected:w,selectableRowsHighlight:y,selectableRowsComponent:$,selectableRowsComponentProps:C,selectableRowDisabled:O,selectableRowsSingle:g,striped:i,onRowExpandToggled:m,onRowClicked:Vr,onRowDoubleClicked:Ur,onRowMouseEnter:qr,onRowMouseLeave:Kr,onSelectedRow:Yr,draggingColumnId:un,onDragStart:pn,onDragOver:fn,onDragEnd:mn,onDragEnter:gn,onDragLeave:hn})}))))),Mr&&s.createElement("div",null,s.createElement(Lr,{onChangePage:_e,onChangeRowsPerPage:Zr,rowCount:V||G.length,currentPage:re,rowsPerPage:we,direction:Ve,paginationRowsPerPageOptions:fe,paginationIconLastPage:Ce,paginationIconFirstPage:he,paginationIconNext:ie,paginationIconPrevious:je,paginationComponentOptions:me})))});function Ps({links:e}){return N.jsx("div",{className:"flex ml-2 space-x-2",children:e.map((t,n)=>N.jsx(eo,{variant:t.active?"default":"outline",size:"sm",disabled:!t.url||t.active,onClick:()=>{t.url&&Vn.get(t.url)},children:t.label.includes("Previous")?N.jsx(oo,{className:"h-4 w-4"}):t.label.includes("Next")?N.jsx(ao,{className:"h-4 w-4"}):t.label},n))})}function yi({messages:e}){const[t,n]=s.useState(e.data),{auth:r}=vn().props;s.useEffect(()=>{Vn.reload({only:["messages"]})},[r]),s.useEffect(()=>{e&&(n(e.data),console.log(t,`length: ${t.length}`))},[e]);const[o,a]=s.useState(!1),i=[{name:"User",selector:l=>`${l.user.firstname} ${l.user.lastname}`,sortable:!0},{name:"Email",selector:l=>l.user.email,sortable:!0},{name:"Subject",selector:l=>l.subject,sortable:!0},{name:"Message",selector:l=>l.message,sortable:!0},{name:"Date Created",selector:l=>ro(l.created_at).format("MMM DD YYYY, h:mm a"),sortable:!0},{name:"Actions",cell:l=>N.jsxs(N.Fragment,{children:[N.jsx(to,{children:N.jsx(uo,{})}),N.jsx(no,{children:N.jsx(lo,{})})]}),ignoreRowClick:!0,button:!0}],{links:d}=vn().props.messages;return N.jsx(Jr,{header:"Mail",children:N.jsxs(so.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[N.jsxs("div",{className:"mb-8",children:[N.jsx("h2",{className:"text-3xl font-bold mb-2 text-primary",children:"Mail Messages"}),N.jsx("p",{className:"text-muted-foreground",children:"See all messages here."})]}),N.jsxs("div",{className:"px-4 md:px-6 py-6 space-y-6",children:[N.jsx("div",{className:"flex justify-between items-center mb-6",children:N.jsx(Os,{columns:i,data:t,noTableHead:!1,responsive:!1})}),N.jsx(Ps,{links:d})]})]})})}export{yi as default};
