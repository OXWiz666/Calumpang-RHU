import{R as P,r as i,q as Xr,b as Qr,j as U}from"./app-CVKZc3Lh.js";import{A as Jr}from"./AdminLayout-DkESbG0u.js";import"./button-D0ZPwi4Z.js";import"./input-CEBjPZZ3.js";import"./avatar-B1uTSiFB.js";import"./table-BK9h3Kua.js";import"./select-G6MbiLIM.js";import"./dialog-DysLFeVC.js";import{P as eo}from"./PrimaryButton-C3qdzjJx.js";import{D as to}from"./DangerButton-pg5VyMtr.js";import{h as no}from"./moment-C5S46NFB.js";import{m as ro}from"./pusher-a5XulTKs.js";import{c as oo}from"./createLucideIcon-BkbKWtyU.js";import{T as ao}from"./trash-2-oZsxgLP1.js";import"./card-D0Eo7xJS.js";import"./separator-qK_Cf7ZO.js";import"./index-CyNvAjsg.js";import"./index-CIbx_s-t.js";import"./index-CBsIHGOy.js";import"./index-iFLzfirO.js";import"./label-DNt_SCqr.js";import"./popover-bycWR1jd.js";import"./react-icons.esm-B3MeircJ.js";import"./format-BtYX0kVO.js";import"./isBefore-CNJkrGzj.js";import"./isSameMonth-CLqEvLGB.js";import"./Combination-ZWnQirPp.js";import"./index-DP9U89Ce.js";import"./TextInput-ebYU9qs-.js";import"./x-BcL3wiDE.js";import"./settings-CGTdI85N.js";import"./calendar-B3Xin36y.js";import"./users-ritLaefa.js";import"./badge-CveJvP0t.js";import"./bell-CMofJhH-.js";import"./search-Bo0WDUmr.js";import"./layers-wwEU4HqH.js";import"./chart-column-D7y_oCqz.js";import"./index-BhxoNvdH.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],so=oo("Pencil",io);var G=function(){return G=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},G.apply(this,arguments)};function ft(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,a;r<o;r++)(a||!(r in t))&&(a||(a=Array.prototype.slice.call(t,0,r)),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}var _="-ms-",Ke="-moz-",j="-webkit-",Yn="comm",xt="rule",Vt="decl",lo="@import",Vn="@keyframes",co="@layer",Un=Math.abs,Ut=String.fromCharCode,Mt=Object.assign;function uo(e,t){return z(e,0)^45?(((t<<2^z(e,0))<<2^z(e,1))<<2^z(e,2))<<2^z(e,3):0}function qn(e){return e.trim()}function ge(e,t){return(e=t.exec(e))?e[0]:e}function E(e,t,n){return e.replace(t,n)}function lt(e,t,n){return e.indexOf(t,n)}function z(e,t){return e.charCodeAt(t)|0}function Me(e,t,n){return e.slice(t,n)}function ce(e){return e.length}function Kn(e){return e.length}function qe(e,t){return t.push(e),e}function po(e,t){return e.map(t).join("")}function vn(e,t){return e.filter(function(n){return!ge(n,t)})}var vt=1,Ne=1,Zn=0,ne=0,T=0,Ge="";function Ct(e,t,n,r,o,a,s,l){return{value:e,root:t,parent:n,type:r,props:o,children:a,line:vt,column:Ne,length:s,return:"",siblings:l}}function xe(e,t){return Mt(Ct("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function Te(e){for(;e.root;)e=xe(e.root,{children:[e]});qe(e,e.siblings)}function go(){return T}function fo(){return T=ne>0?z(Ge,--ne):0,Ne--,T===10&&(Ne=1,vt--),T}function ae(){return T=ne<Zn?z(Ge,ne++):0,Ne++,T===10&&(Ne=1,vt++),T}function Pe(){return z(Ge,ne)}function ct(){return ne}function St(e,t){return Me(Ge,e,t)}function Nt(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function ho(e){return vt=Ne=1,Zn=ce(Ge=e),ne=0,[]}function mo(e){return Ge="",e}function At(e){return qn(St(ne-1,Lt(e===91?e+2:e===40?e+1:e)))}function bo(e){for(;(T=Pe())&&T<33;)ae();return Nt(e)>2||Nt(T)>3?"":" "}function wo(e,t){for(;--t&&ae()&&!(T<48||T>102||T>57&&T<65||T>70&&T<97););return St(e,ct()+(t<6&&Pe()==32&&ae()==32))}function Lt(e){for(;ae();)switch(T){case e:return ne;case 34:case 39:e!==34&&e!==39&&Lt(T);break;case 40:e===41&&Lt(e);break;case 92:ae();break}return ne}function yo(e,t){for(;ae()&&e+T!==57;)if(e+T===84&&Pe()===47)break;return"/*"+St(t,ne-1)+"*"+Ut(e===47?e:ae())}function xo(e){for(;!Nt(Pe());)ae();return St(e,ne)}function vo(e){return mo(dt("",null,null,null,[""],e=ho(e),0,[0],e))}function dt(e,t,n,r,o,a,s,l,d){for(var h=0,u=0,g=s,y=0,f=0,x=0,R=1,O=1,$=1,C=0,m="",v=o,D=a,S=r,p=m;O;)switch(x=C,C=ae()){case 40:if(x!=108&&z(p,g-1)==58){lt(p+=E(At(C),"&","&\f"),"&\f",Un(h?l[h-1]:0))!=-1&&($=-1);break}case 34:case 39:case 91:p+=At(C);break;case 9:case 10:case 13:case 32:p+=bo(x);break;case 92:p+=wo(ct()-1,7);continue;case 47:switch(Pe()){case 42:case 47:qe(Co(yo(ae(),ct()),t,n,d),d);break;default:p+="/"}break;case 123*R:l[h++]=ce(p)*$;case 125*R:case 59:case 0:switch(C){case 0:case 125:O=0;case 59+u:$==-1&&(p=E(p,/\f/g,"")),f>0&&ce(p)-g&&qe(f>32?Sn(p+";",r,n,g-1,d):Sn(E(p," ","")+";",r,n,g-2,d),d);break;case 59:p+=";";default:if(qe(S=Cn(p,t,n,h,u,o,l,m,v=[],D=[],g,a),a),C===123)if(u===0)dt(p,t,S,S,v,a,g,l,D);else switch(y===99&&z(p,3)===110?100:y){case 100:case 108:case 109:case 115:dt(e,S,S,r&&qe(Cn(e,S,S,0,0,o,l,m,o,v=[],g,D),D),o,D,g,l,r?v:D);break;default:dt(p,S,S,S,[""],D,0,l,D)}}h=u=f=0,R=$=1,m=p="",g=s;break;case 58:g=1+ce(p),f=x;default:if(R<1){if(C==123)--R;else if(C==125&&R++==0&&fo()==125)continue}switch(p+=Ut(C),C*R){case 38:$=u>0?1:(p+="\f",-1);break;case 44:l[h++]=(ce(p)-1)*$,$=1;break;case 64:Pe()===45&&(p+=At(ae())),y=Pe(),u=g=ce(m=p+=xo(ct())),C++;break;case 45:x===45&&ce(p)==2&&(R=0)}}return a}function Cn(e,t,n,r,o,a,s,l,d,h,u,g){for(var y=o-1,f=o===0?a:[""],x=Kn(f),R=0,O=0,$=0;R<r;++R)for(var C=0,m=Me(e,y+1,y=Un(O=s[R])),v=e;C<x;++C)(v=qn(O>0?f[C]+" "+m:E(m,/&\f/g,f[C])))&&(d[$++]=v);return Ct(e,t,n,o===0?xt:l,d,h,u,g)}function Co(e,t,n,r){return Ct(e,t,n,Yn,Ut(go()),Me(e,2,-2),0,r)}function Sn(e,t,n,r,o){return Ct(e,t,n,Vt,Me(e,0,r),Me(e,r+1,-1),r,o)}function Xn(e,t,n){switch(uo(e,t)){case 5103:return j+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return j+e+e;case 4789:return Ke+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return j+e+Ke+e+_+e+e;case 5936:switch(z(e,t+11)){case 114:return j+e+_+E(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return j+e+_+E(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return j+e+_+E(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return j+e+_+e+e;case 6165:return j+e+_+"flex-"+e+e;case 5187:return j+e+E(e,/(\w+).+(:[^]+)/,j+"box-$1$2"+_+"flex-$1$2")+e;case 5443:return j+e+_+"flex-item-"+E(e,/flex-|-self/g,"")+(ge(e,/flex-|baseline/)?"":_+"grid-row-"+E(e,/flex-|-self/g,""))+e;case 4675:return j+e+_+"flex-line-pack"+E(e,/align-content|flex-|-self/g,"")+e;case 5548:return j+e+_+E(e,"shrink","negative")+e;case 5292:return j+e+_+E(e,"basis","preferred-size")+e;case 6060:return j+"box-"+E(e,"-grow","")+j+e+_+E(e,"grow","positive")+e;case 4554:return j+E(e,/([^-])(transform)/g,"$1"+j+"$2")+e;case 6187:return E(E(E(e,/(zoom-|grab)/,j+"$1"),/(image-set)/,j+"$1"),e,"")+e;case 5495:case 3959:return E(e,/(image-set\([^]*)/,j+"$1$`$1");case 4968:return E(E(e,/(.+:)(flex-)?(.*)/,j+"box-pack:$3"+_+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+j+e+e;case 4200:if(!ge(e,/flex-|baseline/))return _+"grid-column-align"+Me(e,t)+e;break;case 2592:case 3360:return _+E(e,"template-","")+e;case 4384:case 3616:return n&&n.some(function(r,o){return t=o,ge(r.props,/grid-\w+-end/)})?~lt(e+(n=n[t].value),"span",0)?e:_+E(e,"-start","")+e+_+"grid-row-span:"+(~lt(n,"span",0)?ge(n,/\d+/):+ge(n,/\d+/)-+ge(e,/\d+/))+";":_+E(e,"-start","")+e;case 4896:case 4128:return n&&n.some(function(r){return ge(r.props,/grid-\w+-start/)})?e:_+E(E(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return E(e,/(.+)-inline(.+)/,j+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(ce(e)-1-t>6)switch(z(e,t+1)){case 109:if(z(e,t+4)!==45)break;case 102:return E(e,/(.+:)(.+)-([^]+)/,"$1"+j+"$2-$3$1"+Ke+(z(e,t+3)==108?"$3":"$2-$3"))+e;case 115:return~lt(e,"stretch",0)?Xn(E(e,"stretch","fill-available"),t,n)+e:e}break;case 5152:case 5920:return E(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(r,o,a,s,l,d,h){return _+o+":"+a+h+(s?_+o+"-span:"+(l?d:+d-+a)+h:"")+e});case 4949:if(z(e,t+6)===121)return E(e,":",":"+j)+e;break;case 6444:switch(z(e,z(e,14)===45?18:11)){case 120:return E(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+j+(z(e,14)===45?"inline-":"")+"box$3$1"+j+"$2$3$1"+_+"$2box$3")+e;case 100:return E(e,":",":"+_)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return E(e,"scroll-","scroll-snap-")+e}return e}function ht(e,t){for(var n="",r=0;r<e.length;r++)n+=t(e[r],r,e,t)||"";return n}function So(e,t,n,r){switch(e.type){case co:if(e.children.length)break;case lo:case Vt:return e.return=e.return||e.value;case Yn:return"";case Vn:return e.return=e.value+"{"+ht(e.children,r)+"}";case xt:if(!ce(e.value=e.props.join(",")))return""}return ce(n=ht(e.children,r))?e.return=e.value+"{"+n+"}":""}function Ro(e){var t=Kn(e);return function(n,r,o,a){for(var s="",l=0;l<t;l++)s+=e[l](n,r,o,a)||"";return s}}function $o(e){return function(t){t.root||(t=t.return)&&e(t)}}function Eo(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case Vt:e.return=Xn(e.value,e.length,n);return;case Vn:return ht([xe(e,{value:E(e.value,"@","@"+j)})],r);case xt:if(e.length)return po(n=e.props,function(o){switch(ge(o,r=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":Te(xe(e,{props:[E(o,/:(read-\w+)/,":"+Ke+"$1")]})),Te(xe(e,{props:[o]})),Mt(e,{props:vn(n,r)});break;case"::placeholder":Te(xe(e,{props:[E(o,/:(plac\w+)/,":"+j+"input-$1")]})),Te(xe(e,{props:[E(o,/:(plac\w+)/,":"+Ke+"$1")]})),Te(xe(e,{props:[E(o,/:(plac\w+)/,_+"input-$1")]})),Te(xe(e,{props:[o]})),Mt(e,{props:vn(n,r)});break}return""})}}var Oo={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},J={},Le=typeof process<"u"&&J!==void 0&&(J.REACT_APP_SC_ATTR||J.SC_ATTR)||"data-styled",Qn="active",Jn="data-styled-version",Rt="6.1.18",qt=`/*!sc*/
`,mt=typeof window<"u"&&typeof document<"u",Po=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&J!==void 0&&J.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&J.REACT_APP_SC_DISABLE_SPEEDY!==""?J.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&J.REACT_APP_SC_DISABLE_SPEEDY:typeof process<"u"&&J!==void 0&&J.SC_DISABLE_SPEEDY!==void 0&&J.SC_DISABLE_SPEEDY!==""&&J.SC_DISABLE_SPEEDY!=="false"&&J.SC_DISABLE_SPEEDY),$t=Object.freeze([]),ze=Object.freeze({});function ko(e,t,n){return n===void 0&&(n=ze),e.theme!==n.theme&&e.theme||t||n.theme}var er=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),Do=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,Io=/(^-|-$)/g;function Rn(e){return e.replace(Do,"-").replace(Io,"")}var Ao=/(a)(d)/gi,ot=52,$n=function(e){return String.fromCharCode(e+(e>25?39:97))};function zt(e){var t,n="";for(t=Math.abs(e);t>ot;t=t/ot|0)n=$n(t%ot)+n;return($n(t%ot)+n).replace(Ao,"$1-$2")}var jt,tr=5381,Fe=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},nr=function(e){return Fe(tr,e)};function jo(e){return zt(nr(e)>>>0)}function _o(e){return e.displayName||e.name||"Component"}function _t(e){return typeof e=="string"&&!0}var rr=typeof Symbol=="function"&&Symbol.for,or=rr?Symbol.for("react.memo"):60115,Ho=rr?Symbol.for("react.forward_ref"):60112,To={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Fo={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},ar={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Mo=((jt={})[Ho]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},jt[or]=ar,jt);function En(e){return("type"in(t=e)&&t.type.$$typeof)===or?ar:"$$typeof"in e?Mo[e.$$typeof]:To;var t}var No=Object.defineProperty,Lo=Object.getOwnPropertyNames,On=Object.getOwnPropertySymbols,zo=Object.getOwnPropertyDescriptor,Wo=Object.getPrototypeOf,Pn=Object.prototype;function ir(e,t,n){if(typeof t!="string"){if(Pn){var r=Wo(t);r&&r!==Pn&&ir(e,r,n)}var o=Lo(t);On&&(o=o.concat(On(t)));for(var a=En(e),s=En(t),l=0;l<o.length;++l){var d=o[l];if(!(d in Fo||n&&n[d]||s&&d in s||a&&d in a)){var h=zo(t,d);try{No(e,d,h)}catch{}}}}return e}function De(e){return typeof e=="function"}function Kt(e){return typeof e=="object"&&"styledComponentId"in e}function Oe(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function kn(e,t){if(e.length===0)return"";for(var n=e[0],r=1;r<e.length;r++)n+=e[r];return n}function Qe(e){return e!==null&&typeof e=="object"&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function Wt(e,t,n){if(n===void 0&&(n=!1),!n&&!Qe(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var r=0;r<t.length;r++)e[r]=Wt(e[r],t[r]);else if(Qe(t))for(var r in t)e[r]=Wt(e[r],t[r]);return e}function Zt(e,t){Object.defineProperty(e,"toString",{value:t})}function Ie(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(t.length>0?" Args: ".concat(t.join(", ")):""))}var Bo=function(){function e(t){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=t}return e.prototype.indexOfGroup=function(t){for(var n=0,r=0;r<t;r++)n+=this.groupSizes[r];return n},e.prototype.insertRules=function(t,n){if(t>=this.groupSizes.length){for(var r=this.groupSizes,o=r.length,a=o;t>=a;)if((a<<=1)<0)throw Ie(16,"".concat(t));this.groupSizes=new Uint32Array(a),this.groupSizes.set(r),this.length=a;for(var s=o;s<a;s++)this.groupSizes[s]=0}for(var l=this.indexOfGroup(t+1),d=(s=0,n.length);s<d;s++)this.tag.insertRule(l,n[s])&&(this.groupSizes[t]++,l++)},e.prototype.clearGroup=function(t){if(t<this.length){var n=this.groupSizes[t],r=this.indexOfGroup(t),o=r+n;this.groupSizes[t]=0;for(var a=r;a<o;a++)this.tag.deleteRule(r)}},e.prototype.getGroup=function(t){var n="";if(t>=this.length||this.groupSizes[t]===0)return n;for(var r=this.groupSizes[t],o=this.indexOfGroup(t),a=o+r,s=o;s<a;s++)n+="".concat(this.tag.getRule(s)).concat(qt);return n},e}(),ut=new Map,bt=new Map,pt=1,at=function(e){if(ut.has(e))return ut.get(e);for(;bt.has(pt);)pt++;var t=pt++;return ut.set(e,t),bt.set(t,e),t},Go=function(e,t){pt=t+1,ut.set(e,t),bt.set(t,e)},Yo="style[".concat(Le,"][").concat(Jn,'="').concat(Rt,'"]'),Vo=new RegExp("^".concat(Le,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Uo=function(e,t,n){for(var r,o=n.split(","),a=0,s=o.length;a<s;a++)(r=o[a])&&e.registerName(t,r)},qo=function(e,t){for(var n,r=((n=t.textContent)!==null&&n!==void 0?n:"").split(qt),o=[],a=0,s=r.length;a<s;a++){var l=r[a].trim();if(l){var d=l.match(Vo);if(d){var h=0|parseInt(d[1],10),u=d[2];h!==0&&(Go(u,h),Uo(e,u,d[3]),e.getTag().insertRules(h,o)),o.length=0}else o.push(l)}}},Dn=function(e){for(var t=document.querySelectorAll(Yo),n=0,r=t.length;n<r;n++){var o=t[n];o&&o.getAttribute(Le)!==Qn&&(qo(e,o),o.parentNode&&o.parentNode.removeChild(o))}};function Ko(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null}var sr=function(e){var t=document.head,n=e||t,r=document.createElement("style"),o=function(l){var d=Array.from(l.querySelectorAll("style[".concat(Le,"]")));return d[d.length-1]}(n),a=o!==void 0?o.nextSibling:null;r.setAttribute(Le,Qn),r.setAttribute(Jn,Rt);var s=Ko();return s&&r.setAttribute("nonce",s),n.insertBefore(r,a),r},Zo=function(){function e(t){this.element=sr(t),this.element.appendChild(document.createTextNode("")),this.sheet=function(n){if(n.sheet)return n.sheet;for(var r=document.styleSheets,o=0,a=r.length;o<a;o++){var s=r[o];if(s.ownerNode===n)return s}throw Ie(17)}(this.element),this.length=0}return e.prototype.insertRule=function(t,n){try{return this.sheet.insertRule(n,t),this.length++,!0}catch{return!1}},e.prototype.deleteRule=function(t){this.sheet.deleteRule(t),this.length--},e.prototype.getRule=function(t){var n=this.sheet.cssRules[t];return n&&n.cssText?n.cssText:""},e}(),Xo=function(){function e(t){this.element=sr(t),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(t,n){if(t<=this.length&&t>=0){var r=document.createTextNode(n);return this.element.insertBefore(r,this.nodes[t]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(t){this.element.removeChild(this.nodes[t]),this.length--},e.prototype.getRule=function(t){return t<this.length?this.nodes[t].textContent:""},e}(),Qo=function(){function e(t){this.rules=[],this.length=0}return e.prototype.insertRule=function(t,n){return t<=this.length&&(this.rules.splice(t,0,n),this.length++,!0)},e.prototype.deleteRule=function(t){this.rules.splice(t,1),this.length--},e.prototype.getRule=function(t){return t<this.length?this.rules[t]:""},e}(),In=mt,Jo={isServer:!mt,useCSSOMInjection:!Po},lr=function(){function e(t,n,r){t===void 0&&(t=ze),n===void 0&&(n={});var o=this;this.options=G(G({},Jo),t),this.gs=n,this.names=new Map(r),this.server=!!t.isServer,!this.server&&mt&&In&&(In=!1,Dn(this)),Zt(this,function(){return function(a){for(var s=a.getTag(),l=s.length,d="",h=function(g){var y=function($){return bt.get($)}(g);if(y===void 0)return"continue";var f=a.names.get(y),x=s.getGroup(g);if(f===void 0||!f.size||x.length===0)return"continue";var R="".concat(Le,".g").concat(g,'[id="').concat(y,'"]'),O="";f!==void 0&&f.forEach(function($){$.length>0&&(O+="".concat($,","))}),d+="".concat(x).concat(R,'{content:"').concat(O,'"}').concat(qt)},u=0;u<l;u++)h(u);return d}(o)})}return e.registerId=function(t){return at(t)},e.prototype.rehydrate=function(){!this.server&&mt&&Dn(this)},e.prototype.reconstructWithOptions=function(t,n){return n===void 0&&(n=!0),new e(G(G({},this.options),t),this.gs,n&&this.names||void 0)},e.prototype.allocateGSInstance=function(t){return this.gs[t]=(this.gs[t]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(t=function(n){var r=n.useCSSOMInjection,o=n.target;return n.isServer?new Qo(o):r?new Zo(o):new Xo(o)}(this.options),new Bo(t)));var t},e.prototype.hasNameForId=function(t,n){return this.names.has(t)&&this.names.get(t).has(n)},e.prototype.registerName=function(t,n){if(at(t),this.names.has(t))this.names.get(t).add(n);else{var r=new Set;r.add(n),this.names.set(t,r)}},e.prototype.insertRules=function(t,n,r){this.registerName(t,n),this.getTag().insertRules(at(t),r)},e.prototype.clearNames=function(t){this.names.has(t)&&this.names.get(t).clear()},e.prototype.clearRules=function(t){this.getTag().clearGroup(at(t)),this.clearNames(t)},e.prototype.clearTag=function(){this.tag=void 0},e}(),ea=/&/g,ta=/^\s*\/\/.*$/gm;function cr(e,t){return e.map(function(n){return n.type==="rule"&&(n.value="".concat(t," ").concat(n.value),n.value=n.value.replaceAll(",",",".concat(t," ")),n.props=n.props.map(function(r){return"".concat(t," ").concat(r)})),Array.isArray(n.children)&&n.type!=="@keyframes"&&(n.children=cr(n.children,t)),n})}function na(e){var t,n,r,o=ze,a=o.options,s=a===void 0?ze:a,l=o.plugins,d=l===void 0?$t:l,h=function(y,f,x){return x.startsWith(n)&&x.endsWith(n)&&x.replaceAll(n,"").length>0?".".concat(t):y},u=d.slice();u.push(function(y){y.type===xt&&y.value.includes("&")&&(y.props[0]=y.props[0].replace(ea,n).replace(r,h))}),s.prefix&&u.push(Eo),u.push(So);var g=function(y,f,x,R){f===void 0&&(f=""),x===void 0&&(x=""),R===void 0&&(R="&"),t=R,n=f,r=new RegExp("\\".concat(n,"\\b"),"g");var O=y.replace(ta,""),$=vo(x||f?"".concat(x," ").concat(f," { ").concat(O," }"):O);s.namespace&&($=cr($,s.namespace));var C=[];return ht($,Ro(u.concat($o(function(m){return C.push(m)})))),C};return g.hash=d.length?d.reduce(function(y,f){return f.name||Ie(15),Fe(y,f.name)},tr).toString():"",g}var ra=new lr,Bt=na(),dr=P.createContext({shouldForwardProp:void 0,styleSheet:ra,stylis:Bt});dr.Consumer;P.createContext(void 0);function An(){return i.useContext(dr)}var oa=function(){function e(t,n){var r=this;this.inject=function(o,a){a===void 0&&(a=Bt);var s=r.name+a.hash;o.hasNameForId(r.id,s)||o.insertRules(r.id,s,a(r.rules,s,"@keyframes"))},this.name=t,this.id="sc-keyframes-".concat(t),this.rules=n,Zt(this,function(){throw Ie(12,String(r.name))})}return e.prototype.getName=function(t){return t===void 0&&(t=Bt),this.name+t.hash},e}(),aa=function(e){return e>="A"&&e<="Z"};function jn(e){for(var t="",n=0;n<e.length;n++){var r=e[n];if(n===1&&r==="-"&&e[0]==="-")return e;aa(r)?t+="-"+r.toLowerCase():t+=r}return t.startsWith("ms-")?"-"+t:t}var ur=function(e){return e==null||e===!1||e===""},pr=function(e){var t,n,r=[];for(var o in e){var a=e[o];e.hasOwnProperty(o)&&!ur(a)&&(Array.isArray(a)&&a.isCss||De(a)?r.push("".concat(jn(o),":"),a,";"):Qe(a)?r.push.apply(r,ft(ft(["".concat(o," {")],pr(a),!1),["}"],!1)):r.push("".concat(jn(o),": ").concat((t=o,(n=a)==null||typeof n=="boolean"||n===""?"":typeof n!="number"||n===0||t in Oo||t.startsWith("--")?String(n).trim():"".concat(n,"px")),";")))}return r};function ke(e,t,n,r){if(ur(e))return[];if(Kt(e))return[".".concat(e.styledComponentId)];if(De(e)){if(!De(a=e)||a.prototype&&a.prototype.isReactComponent||!t)return[e];var o=e(t);return ke(o,t,n,r)}var a;return e instanceof oa?n?(e.inject(n,r),[e.getName(r)]):[e]:Qe(e)?pr(e):Array.isArray(e)?Array.prototype.concat.apply($t,e.map(function(s){return ke(s,t,n,r)})):[e.toString()]}function ia(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(De(n)&&!Kt(n))return!1}return!0}var sa=nr(Rt),la=function(){function e(t,n,r){this.rules=t,this.staticRulesId="",this.isStatic=(r===void 0||r.isStatic)&&ia(t),this.componentId=n,this.baseHash=Fe(sa,n),this.baseStyle=r,lr.registerId(n)}return e.prototype.generateAndInjectStyles=function(t,n,r){var o=this.baseStyle?this.baseStyle.generateAndInjectStyles(t,n,r):"";if(this.isStatic&&!r.hash)if(this.staticRulesId&&n.hasNameForId(this.componentId,this.staticRulesId))o=Oe(o,this.staticRulesId);else{var a=kn(ke(this.rules,t,n,r)),s=zt(Fe(this.baseHash,a)>>>0);if(!n.hasNameForId(this.componentId,s)){var l=r(a,".".concat(s),void 0,this.componentId);n.insertRules(this.componentId,s,l)}o=Oe(o,s),this.staticRulesId=s}else{for(var d=Fe(this.baseHash,r.hash),h="",u=0;u<this.rules.length;u++){var g=this.rules[u];if(typeof g=="string")h+=g;else if(g){var y=kn(ke(g,t,n,r));d=Fe(d,y+u),h+=y}}if(h){var f=zt(d>>>0);n.hasNameForId(this.componentId,f)||n.insertRules(this.componentId,f,r(h,".".concat(f),void 0,this.componentId)),o=Oe(o,f)}}return o},e}(),wt=P.createContext(void 0);wt.Consumer;function ca(e){var t=P.useContext(wt),n=i.useMemo(function(){return function(r,o){if(!r)throw Ie(14);if(De(r)){var a=r(o);return a}if(Array.isArray(r)||typeof r!="object")throw Ie(8);return o?G(G({},o),r):r}(e.theme,t)},[e.theme,t]);return e.children?P.createElement(wt.Provider,{value:n},e.children):null}var Ht={};function da(e,t,n){var r=Kt(e),o=e,a=!_t(e),s=t.attrs,l=s===void 0?$t:s,d=t.componentId,h=d===void 0?function(v,D){var S=typeof v!="string"?"sc":Rn(v);Ht[S]=(Ht[S]||0)+1;var p="".concat(S,"-").concat(jo(Rt+S+Ht[S]));return D?"".concat(D,"-").concat(p):p}(t.displayName,t.parentComponentId):d,u=t.displayName,g=u===void 0?function(v){return _t(v)?"styled.".concat(v):"Styled(".concat(_o(v),")")}(e):u,y=t.displayName&&t.componentId?"".concat(Rn(t.displayName),"-").concat(t.componentId):t.componentId||h,f=r&&o.attrs?o.attrs.concat(l).filter(Boolean):l,x=t.shouldForwardProp;if(r&&o.shouldForwardProp){var R=o.shouldForwardProp;if(t.shouldForwardProp){var O=t.shouldForwardProp;x=function(v,D){return R(v,D)&&O(v,D)}}else x=R}var $=new la(n,y,r?o.componentStyle:void 0);function C(v,D){return function(S,p,A){var q=S.attrs,Y=S.componentStyle,ee=S.defaultProps,ie=S.foldedComponentIds,H=S.styledComponentId,fe=S.target,Ce=P.useContext(wt),he=An(),se=S.shouldForwardProp||he.shouldForwardProp,Ae=ko(p,Ce,ee)||ze,K=function(ue,X,be){for(var pe,te=G(G({},X),{className:void 0,theme:be}),Re=0;Re<ue.length;Re+=1){var Q=De(pe=ue[Re])?pe(te):pe;for(var W in Q)te[W]=W==="className"?Oe(te[W],Q[W]):W==="style"?G(G({},te[W]),Q[W]):Q[W]}return X.className&&(te.className=Oe(te.className,X.className)),te}(q,p,Ae),me=K.as||fe,de={};for(var L in K)K[L]===void 0||L[0]==="$"||L==="as"||L==="theme"&&K.theme===Ae||(L==="forwardedAs"?de.as=K.forwardedAs:se&&!se(L,me)||(de[L]=K[L]));var Se=function(ue,X){var be=An(),pe=ue.generateAndInjectStyles(X,be.styleSheet,be.stylis);return pe}(Y,K),Z=Oe(ie,H);return Se&&(Z+=" "+Se),K.className&&(Z+=" "+K.className),de[_t(me)&&!er.has(me)?"class":"className"]=Z,A&&(de.ref=A),i.createElement(me,de)}(m,v,D)}C.displayName=g;var m=P.forwardRef(C);return m.attrs=f,m.componentStyle=$,m.displayName=g,m.shouldForwardProp=x,m.foldedComponentIds=r?Oe(o.foldedComponentIds,o.styledComponentId):"",m.styledComponentId=y,m.target=r?o.target:e,Object.defineProperty(m,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(v){this._foldedDefaultProps=r?function(D){for(var S=[],p=1;p<arguments.length;p++)S[p-1]=arguments[p];for(var A=0,q=S;A<q.length;A++)Wt(D,q[A],!0);return D}({},o.defaultProps,v):v}}),Zt(m,function(){return".".concat(m.styledComponentId)}),a&&ir(m,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),m}function _n(e,t){for(var n=[e[0]],r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n}var Hn=function(e){return Object.assign(e,{isCss:!0})};function N(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(De(e)||Qe(e))return Hn(ke(_n($t,ft([e],t,!0))));var r=e;return t.length===0&&r.length===1&&typeof r[0]=="string"?ke(r):Hn(ke(_n(r,t)))}function Gt(e,t,n){if(n===void 0&&(n=ze),!t)throw Ie(1,t);var r=function(o){for(var a=[],s=1;s<arguments.length;s++)a[s-1]=arguments[s];return e(t,n,N.apply(void 0,ft([o],a,!1)))};return r.attrs=function(o){return Gt(e,t,G(G({},n),{attrs:Array.prototype.concat(n.attrs,o).filter(Boolean)}))},r.withConfig=function(o){return Gt(e,t,G(G({},n),o))},r}var gr=function(e){return Gt(da,e)},k=gr;er.forEach(function(e){k[e]=gr(e)});var ve;function We(e,t){return e[t]}function ua(e=[],t,n=0){return[...e.slice(0,n),t,...e.slice(n)]}function pa(e=[],t,n="id"){const r=e.slice(),o=We(t,n);return o?r.splice(r.findIndex(a=>We(a,n)===o),1):r.splice(r.findIndex(a=>a===t),1),r}function Tn(e){return e.map((t,n)=>{const r=Object.assign(Object.assign({},t),{sortable:t.sortable||!!t.sortFunction||void 0});return t.id||(r.id=n+1),r})}function Ze(e,t){return Math.ceil(e/t)}function Tt(e,t){return Math.min(e,t)}(function(e){e.ASC="asc",e.DESC="desc"})(ve||(ve={}));const M=()=>null;function fr(e,t=[],n=[]){let r={},o=[...n];return t.length&&t.forEach(a=>{if(!a.when||typeof a.when!="function")throw new Error('"when" must be defined in the conditional style object and must be function');a.when(e)&&(r=a.style||{},a.classNames&&(o=[...o,...a.classNames]),typeof a.style=="function"&&(r=a.style(e)||{}))}),{conditionalStyle:r,classNames:o.join(" ")}}function gt(e,t=[],n="id"){const r=We(e,n);return r?t.some(o=>We(o,n)===r):t.some(o=>o===e)}function it(e,t){return t?e.findIndex(n=>Xe(n.id,t)):-1}function Xe(e,t){return e==t}function ga(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case"SELECT_ALL_ROWS":{const{keyField:r,rows:o,rowCount:a,mergeSelections:s}=t,l=!e.allSelected,d=!e.toggleOnSelectedRowsChange;if(s){const h=l?[...e.selectedRows,...o.filter(u=>!gt(u,e.selectedRows,r))]:e.selectedRows.filter(u=>!gt(u,o,r));return Object.assign(Object.assign({},e),{allSelected:l,selectedCount:h.length,selectedRows:h,toggleOnSelectedRowsChange:d})}return Object.assign(Object.assign({},e),{allSelected:l,selectedCount:l?a:0,selectedRows:l?o:[],toggleOnSelectedRowsChange:d})}case"SELECT_SINGLE_ROW":{const{keyField:r,row:o,isSelected:a,rowCount:s,singleSelect:l}=t;return l?a?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:!1,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:!1,selectedRows:[o],toggleOnSelectedRowsChange:n}):a?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:!1,selectedRows:pa(e.selectedRows,o,r),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===s,selectedRows:ua(e.selectedRows,o),toggleOnSelectedRowsChange:n})}case"SELECT_MULTIPLE_ROWS":{const{keyField:r,selectedRows:o,totalRows:a,mergeSelections:s}=t;if(s){const l=[...e.selectedRows,...o.filter(d=>!gt(d,e.selectedRows,r))];return Object.assign(Object.assign({},e),{selectedCount:l.length,allSelected:!1,selectedRows:l,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:o.length,allSelected:o.length===a,selectedRows:o,toggleOnSelectedRowsChange:n})}case"CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:r}=t;return Object.assign(Object.assign({},e),{allSelected:!1,selectedCount:0,selectedRows:[],selectedRowsFlag:r})}case"SORT_CHANGE":{const{sortDirection:r,selectedColumn:o,clearSelectedOnSort:a}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:o,sortDirection:r,currentPage:1}),a&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_PAGE":{const{page:r,paginationServer:o,visibleOnly:a,persistSelectedOnPageChange:s}=t,l=o&&s,d=o&&!s||a;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:r}),l&&{allSelected:!1}),d&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:r,page:o}=t;return Object.assign(Object.assign({},e),{currentPage:o,rowsPerPage:r})}}}const fa=N`
	pointer-events: none;
	opacity: 0.4;
`,ha=k.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&fa};
	${({theme:e})=>e.table.style};
`,ma=N`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,ba=k.div`
	display: flex;
	width: 100%;
	${({$fixedHeader:e})=>e&&ma};
	${({theme:e})=>e.head.style};
`,wa=k.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({$dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,hr=(e,...t)=>N`
		@media screen and (max-width: ${599}px) {
			${N(e,...t)}
		}
	`,ya=(e,...t)=>N`
		@media screen and (max-width: ${959}px) {
			${N(e,...t)}
		}
	`,xa=(e,...t)=>N`
		@media screen and (max-width: ${1280}px) {
			${N(e,...t)}
		}
	`,va=e=>(t,...n)=>N`
			@media screen and (max-width: ${e}px) {
				${N(t,...n)}
			}
		`,Ye=k.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,$headCell:t})=>e[t?"headCells":"cells"].style};
	${({$noPadding:e})=>e&&"padding: 0"};
`,mr=k(Ye)`
	flex-grow: ${({button:e,grow:t})=>t===0||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&N`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&e==="sm"&&hr`
    display: none;
  `};
	${({hide:e})=>e&&e==="md"&&ya`
    display: none;
  `};
	${({hide:e})=>e&&e==="lg"&&xa`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&va(e)`
    display: none;
  `};
`,Ca=N`
	div:first-child {
		white-space: ${({$wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({$allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,Sa=k(mr).attrs(e=>({style:e.style}))`
	${({$renderAsCell:e})=>!e&&Ca};
	${({theme:e,$isDragging:t})=>t&&e.cells.draggingStyle};
	${({$cellStyle:e})=>e};
`;var Ra=i.memo(function({id:e,column:t,row:n,rowIndex:r,dataTag:o,isDragging:a,onDragStart:s,onDragOver:l,onDragEnd:d,onDragEnter:h,onDragLeave:u}){const{conditionalStyle:g,classNames:y}=fr(n,t.conditionalCellStyles,["rdt_TableCell"]);return i.createElement(Sa,{id:e,"data-column-id":t.id,role:"cell",className:y,"data-tag":o,$cellStyle:t.style,$renderAsCell:!!t.cell,$allowOverflow:t.allowOverflow,button:t.button,center:t.center,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,width:t.width,$wrapCell:t.wrap,style:g,$isDragging:a,onDragStart:s,onDragOver:l,onDragEnd:d,onDragEnter:h,onDragLeave:u},!t.cell&&i.createElement("div",{"data-tag":o},function(f,x,R,O){return x?R&&typeof R=="function"?R(f,O):x(f,O):null}(n,t.selector,t.format,r)),t.cell&&t.cell(n,r,t,e))});const Fn="input";var br=i.memo(function({name:e,component:t=Fn,componentOptions:n={style:{}},indeterminate:r=!1,checked:o=!1,disabled:a=!1,onClick:s=M}){const l=t,d=l!==Fn?n.style:(u=>Object.assign(Object.assign({fontSize:"18px"},!u&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(a),h=i.useMemo(()=>function(u,...g){let y;return Object.keys(u).map(f=>u[f]).forEach((f,x)=>{typeof f=="function"&&(y=Object.assign(Object.assign({},u),{[Object.keys(u)[x]]:f(...g)}))}),y||u}(n,r),[n,r]);return i.createElement(l,Object.assign({type:"checkbox",ref:u=>{u&&(u.indeterminate=r)},style:d,onClick:a?M:s,name:e,"aria-label":e,checked:o,disabled:a},h,{onChange:M}))});const $a=k(Ye)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function Ea({name:e,keyField:t,row:n,rowCount:r,selected:o,selectableRowsComponent:a,selectableRowsComponentProps:s,selectableRowsSingle:l,selectableRowDisabled:d,onSelectedRow:h}){const u=!(!d||!d(n));return i.createElement($a,{onClick:g=>g.stopPropagation(),className:"rdt_TableCell",$noPadding:!0},i.createElement(br,{name:e,component:a,componentOptions:s,checked:o,"aria-checked":o,onClick:()=>{h({type:"SELECT_SINGLE_ROW",row:n,isSelected:o,keyField:t,rowCount:r,singleSelect:l})},disabled:u}))}const Oa=k.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function Pa({disabled:e=!1,expanded:t=!1,expandableIcon:n,id:r,row:o,onToggled:a}){const s=t?n.expanded:n.collapsed;return i.createElement(Oa,{"aria-disabled":e,onClick:()=>a&&a(o),"data-testid":`expander-button-${r}`,disabled:e,"aria-label":t?"Collapse Row":"Expand Row",role:"button",type:"button"},s)}const ka=k(Ye)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function Da({row:e,expanded:t=!1,expandableIcon:n,id:r,onToggled:o,disabled:a=!1}){return i.createElement(ka,{onClick:s=>s.stopPropagation(),$noPadding:!0},i.createElement(Pa,{id:r,row:e,expanded:t,expandableIcon:n,disabled:a,onToggled:o}))}const Ia=k.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({$extendedRowStyle:e})=>e};
`;var Aa=i.memo(function({data:e,ExpanderComponent:t,expanderComponentProps:n,extendedRowStyle:r,extendedClassNames:o}){const a=["rdt_ExpanderRow",...o.split(" ").filter(s=>s!=="rdt_TableRow")].join(" ");return i.createElement(Ia,{className:a,$extendedRowStyle:r},i.createElement(t,Object.assign({data:e},n)))});const Ft="allowRowEvents";var yt,Yt,Mn;(function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto"})(yt||(yt={})),function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center"}(Yt||(Yt={})),function(e){e.SM="sm",e.MD="md",e.LG="lg"}(Mn||(Mn={}));const ja=N`
	&:hover {
		${({$highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,_a=N`
	&:hover {
		cursor: pointer;
	}
`,Ha=k.div.attrs(e=>({style:e.style}))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({$dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({$striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({$highlightOnHover:e})=>e&&ja};
	${({$pointerOnHover:e})=>e&&_a};
	${({$selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
	${({$conditionalStyle:e})=>e};
`;function Ta({columns:e=[],conditionalRowStyles:t=[],defaultExpanded:n=!1,defaultExpanderDisabled:r=!1,dense:o=!1,expandableIcon:a,expandableRows:s=!1,expandableRowsComponent:l,expandableRowsComponentProps:d,expandableRowsHideExpander:h,expandOnRowClicked:u=!1,expandOnRowDoubleClicked:g=!1,highlightOnHover:y=!1,id:f,expandableInheritConditionalStyles:x,keyField:R,onRowClicked:O=M,onRowDoubleClicked:$=M,onRowMouseEnter:C=M,onRowMouseLeave:m=M,onRowExpandToggled:v=M,onSelectedRow:D=M,pointerOnHover:S=!1,row:p,rowCount:A,rowIndex:q,selectableRowDisabled:Y=null,selectableRows:ee=!1,selectableRowsComponent:ie,selectableRowsComponentProps:H,selectableRowsHighlight:fe=!1,selectableRowsSingle:Ce=!1,selected:he,striped:se=!1,draggingColumnId:Ae,onDragStart:K,onDragOver:me,onDragEnd:de,onDragEnter:L,onDragLeave:Se}){const[Z,ue]=i.useState(n);i.useEffect(()=>{ue(n)},[n]);const X=i.useCallback(()=>{ue(!Z),v(!Z,p)},[Z,v,p]),be=S||s&&(u||g),pe=i.useCallback(F=>{F.target.getAttribute("data-tag")===Ft&&(O(p,F),!r&&s&&u&&X())},[r,u,s,X,O,p]),te=i.useCallback(F=>{F.target.getAttribute("data-tag")===Ft&&($(p,F),!r&&s&&g&&X())},[r,g,s,X,$,p]),Re=i.useCallback(F=>{C(p,F)},[C,p]),Q=i.useCallback(F=>{m(p,F)},[m,p]),W=We(p,R),{conditionalStyle:et,classNames:tt}=fr(p,t,["rdt_TableRow"]),Et=fe&&he,Ot=x?et:{},Pt=se&&q%2==0;return i.createElement(i.Fragment,null,i.createElement(Ha,{id:`row-${f}`,role:"row",$striped:Pt,$highlightOnHover:y,$pointerOnHover:!r&&be,$dense:o,onClick:pe,onDoubleClick:te,onMouseEnter:Re,onMouseLeave:Q,className:tt,$selected:Et,$conditionalStyle:et},ee&&i.createElement(Ea,{name:`select-row-${W}`,keyField:R,row:p,rowCount:A,selected:he,selectableRowsComponent:ie,selectableRowsComponentProps:H,selectableRowDisabled:Y,selectableRowsSingle:Ce,onSelectedRow:D}),s&&!h&&i.createElement(Da,{id:W,expandableIcon:a,expanded:Z,row:p,onToggled:X,disabled:r}),e.map(F=>F.omit?null:i.createElement(Ra,{id:`cell-${F.id}-${W}`,key:`cell-${F.id}-${W}`,dataTag:F.ignoreRowClick||F.button?null:Ft,column:F,row:p,rowIndex:q,isDragging:Xe(Ae,F.id),onDragStart:K,onDragOver:me,onDragEnd:de,onDragEnter:L,onDragLeave:Se}))),s&&Z&&i.createElement(Aa,{key:`expander-${W}`,data:p,extendedRowStyle:Ot,extendedClassNames:tt,ExpanderComponent:l,expanderComponentProps:d}))}const Fa=k.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({$sortDirection:e})=>e==="desc"&&"transform: rotate(180deg)"};
`,Ma=({sortActive:e,sortDirection:t})=>P.createElement(Fa,{$sortActive:e,$sortDirection:t},"▲"),Na=k(mr)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,$isDragging:t})=>t&&e.headCells.draggingStyle};
`,La=N`
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

	${({$sortActive:e})=>!e&&N`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,za=k.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&La};
`,Wa=k.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var Ba=i.memo(function({column:e,disabled:t,draggingColumnId:n,selectedColumn:r={},sortDirection:o,sortIcon:a,sortServer:s,pagination:l,paginationServer:d,persistSelectedOnSort:h,selectableRowsVisibleOnly:u,onSort:g,onDragStart:y,onDragOver:f,onDragEnd:x,onDragEnter:R,onDragLeave:O}){i.useEffect(()=>{typeof e.selector=="string"&&console.error(`Warning: ${e.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)},[]);const[$,C]=i.useState(!1),m=i.useRef(null);if(i.useEffect(()=>{m.current&&C(m.current.scrollWidth>m.current.clientWidth)},[$]),e.omit)return null;const v=()=>{if(!e.sortable&&!e.selector)return;let H=o;Xe(r.id,e.id)&&(H=o===ve.ASC?ve.DESC:ve.ASC),g({type:"SORT_CHANGE",sortDirection:H,selectedColumn:e,clearSelectedOnSort:l&&d&&!h||s||u})},D=H=>i.createElement(Ma,{sortActive:H,sortDirection:o}),S=()=>i.createElement("span",{className:[o,"__rdt_custom_sort_icon__"].join(" ")},a),p=!(!e.sortable||!Xe(r.id,e.id)),A=!e.sortable||t,q=e.sortable&&!a&&!e.right,Y=e.sortable&&!a&&e.right,ee=e.sortable&&a&&!e.right,ie=e.sortable&&a&&e.right;return i.createElement(Na,{"data-column-id":e.id,className:"rdt_TableCol",$headCell:!0,allowOverflow:e.allowOverflow,button:e.button,compact:e.compact,grow:e.grow,hide:e.hide,maxWidth:e.maxWidth,minWidth:e.minWidth,right:e.right,center:e.center,width:e.width,draggable:e.reorder,$isDragging:Xe(e.id,n),onDragStart:y,onDragOver:f,onDragEnd:x,onDragEnter:R,onDragLeave:O},e.name&&i.createElement(za,{"data-column-id":e.id,"data-sort-id":e.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:A?void 0:v,onKeyPress:A?void 0:H=>{H.key==="Enter"&&v()},$sortActive:!A&&p,disabled:A},!A&&ie&&S(),!A&&Y&&D(p),typeof e.name=="string"?i.createElement(Wa,{title:$?e.name:void 0,ref:m,"data-column-id":e.id},e.name):e.name,!A&&ee&&S(),!A&&q&&D(p)))});const Ga=k(Ye)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function Ya({headCell:e=!0,rowData:t,keyField:n,allSelected:r,mergeSelections:o,selectedRows:a,selectableRowsComponent:s,selectableRowsComponentProps:l,selectableRowDisabled:d,onSelectAllRows:h}){const u=a.length>0&&!r,g=d?t.filter(x=>!d(x)):t,y=g.length===0,f=Math.min(t.length,g.length);return i.createElement(Ga,{className:"rdt_TableCol",$headCell:e,$noPadding:!0},i.createElement(br,{name:"select-all-rows",component:s,componentOptions:l,onClick:()=>{h({type:"SELECT_ALL_ROWS",rows:g,rowCount:f,mergeSelections:o,keyField:n})},checked:r,indeterminate:u,disabled:y}))}function wr(e=yt.AUTO){const t=typeof window=="object",[n,r]=i.useState(!1);return i.useEffect(()=>{if(t)if(e!=="auto")r(e==="rtl");else{const o=!(!window.document||!window.document.createElement),a=document.getElementsByTagName("BODY")[0],s=document.getElementsByTagName("HTML")[0],l=a.dir==="rtl"||s.dir==="rtl";r(o&&l)}},[e,t]),n}const Va=k.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,Ua=k.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,Nn=k.div`
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
`;function qa({contextMessage:e,contextActions:t,contextComponent:n,selectedCount:r,direction:o}){const a=wr(o),s=r>0;return n?i.createElement(Nn,{$visible:s},i.cloneElement(n,{selectedCount:r})):i.createElement(Nn,{$visible:s,$rtl:a},i.createElement(Va,null,((l,d,h)=>{if(d===0)return null;const u=d===1?l.singular:l.plural;return h?`${d} ${l.message||""} ${u}`:`${d} ${u} ${l.message||""}`})(e,r,a)),i.createElement(Ua,null,t))}const Ka=k.div`
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
`,Za=k.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,Xa=k.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,Qa=({title:e,actions:t=null,contextMessage:n,contextActions:r,contextComponent:o,selectedCount:a,direction:s,showMenu:l=!0})=>i.createElement(Ka,{className:"rdt_TableHeader",role:"heading","aria-level":1},i.createElement(Za,null,e),t&&i.createElement(Xa,null,t),l&&i.createElement(qa,{contextMessage:n,contextActions:r,contextComponent:o,direction:s,selectedCount:a}));function yr(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function"){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}const Ja={left:"flex-start",right:"flex-end",center:"center"},ei=k.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>Ja[e]};
	flex-wrap: ${({$wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,ti=e=>{var{align:t="right",wrapContent:n=!0}=e,r=yr(e,["align","wrapContent"]);return i.createElement(ei,Object.assign({align:t,$wrapContent:n},r))},ni=k.div`
	display: flex;
	flex-direction: column;
`,ri=k.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({$responsive:e,$fixedHeader:t})=>e&&N`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${t?"auto":"hidden"};
			min-height: 0;
		`};

	${({$fixedHeader:e=!1,$fixedHeaderScrollHeight:t="100vh"})=>e&&N`
			max-height: ${t};
			-webkit-overflow-scrolling: touch;
		`};

	${({theme:e})=>e.responsiveWrapper.style};
`,Ln=k.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,oi=k.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,ai=k(Ye)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,ii=k.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,si=()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},P.createElement("path",{d:"M7 10l5 5 5-5z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),li=k.select`
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
`,ci=k.div`
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
`,di=e=>{var{defaultValue:t,onChange:n}=e,r=yr(e,["defaultValue","onChange"]);return i.createElement(ci,null,i.createElement(li,Object.assign({onChange:n,defaultValue:t},r)),i.createElement(si,null))},c={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return P.createElement("div",null,"To add an expander pass in a component instance via ",P.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:P.createElement(()=>P.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},P.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),P.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"})),null),expanded:P.createElement(()=>P.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},P.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),P.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"})),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:P.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:P.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:Yt.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),P.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"})),null),paginationIconLastPage:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),P.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"})),null),paginationIconNext:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),null),paginationIconPrevious:P.createElement(()=>P.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},P.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),P.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:yt.AUTO,onChangePage:M,onChangeRowsPerPage:M,onRowClicked:M,onRowDoubleClicked:M,onRowMouseEnter:M,onRowMouseLeave:M,onRowExpandToggled:M,onSelectedRowsChange:M,onSort:M,onColumnOrderChange:M},ui={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},pi=k.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,st=k.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({$isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,gi=k.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${hr`
    width: 100%;
    justify-content: space-around;
  `};
`,xr=k.span`
	flex-shrink: 1;
	user-select: none;
`,fi=k(xr)`
	margin: 0 24px;
`,hi=k(xr)`
	margin: 0 4px;
`;var mi=i.memo(function({rowsPerPage:e,rowCount:t,currentPage:n,direction:r=c.direction,paginationRowsPerPageOptions:o=c.paginationRowsPerPageOptions,paginationIconLastPage:a=c.paginationIconLastPage,paginationIconFirstPage:s=c.paginationIconFirstPage,paginationIconNext:l=c.paginationIconNext,paginationIconPrevious:d=c.paginationIconPrevious,paginationComponentOptions:h=c.paginationComponentOptions,onChangeRowsPerPage:u=c.onChangeRowsPerPage,onChangePage:g=c.onChangePage}){const y=(()=>{const H=typeof window=="object";function fe(){return{width:H?window.innerWidth:void 0,height:H?window.innerHeight:void 0}}const[Ce,he]=i.useState(fe);return i.useEffect(()=>{if(!H)return()=>null;function se(){he(fe())}return window.addEventListener("resize",se),()=>window.removeEventListener("resize",se)},[]),Ce})(),f=wr(r),x=y.width&&y.width>599,R=Ze(t,e),O=n*e,$=O-e+1,C=n===1,m=n===R,v=Object.assign(Object.assign({},ui),h),D=n===R?`${$}-${t} ${v.rangeSeparatorText} ${t}`:`${$}-${O} ${v.rangeSeparatorText} ${t}`,S=i.useCallback(()=>g(n-1),[n,g]),p=i.useCallback(()=>g(n+1),[n,g]),A=i.useCallback(()=>g(1),[g]),q=i.useCallback(()=>g(Ze(t,e)),[g,t,e]),Y=i.useCallback(H=>u(Number(H.target.value),n),[n,u]),ee=o.map(H=>i.createElement("option",{key:H,value:H},H));v.selectAllRowsItem&&ee.push(i.createElement("option",{key:-1,value:t},v.selectAllRowsItemText));const ie=i.createElement(di,{onChange:Y,defaultValue:e,"aria-label":v.rowsPerPageText},ee);return i.createElement(pi,{className:"rdt_Pagination"},!v.noRowsPerPage&&x&&i.createElement(i.Fragment,null,i.createElement(hi,null,v.rowsPerPageText),ie),x&&i.createElement(fi,null,D),i.createElement(gi,null,i.createElement(st,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:A,disabled:C,$isRTL:f},s),i.createElement(st,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,$isRTL:f},d),!v.noRowsPerPage&&!x&&ie,i.createElement(st,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":m,onClick:p,disabled:m,$isRTL:f},l),i.createElement(st,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":m,onClick:q,disabled:m,$isRTL:f},a)))});const Ee=(e,t)=>{const n=i.useRef(!0);i.useEffect(()=>{n.current?n.current=!1:e()},t)};function bi(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var wi=function(e){return function(t){return!!t&&typeof t=="object"}(e)&&!function(t){var n=Object.prototype.toString.call(t);return n==="[object RegExp]"||n==="[object Date]"||function(r){return r.$$typeof===yi}(t)}(e)},yi=typeof Symbol=="function"&&Symbol.for?Symbol.for("react.element"):60103;function Je(e,t){return t.clone!==!1&&t.isMergeableObject(e)?Be((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function xi(e,t,n){return e.concat(t).map(function(r){return Je(r,n)})}function zn(e){return Object.keys(e).concat(function(t){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter(function(n){return Object.propertyIsEnumerable.call(t,n)}):[]}(e))}function Wn(e,t){try{return t in e}catch{return!1}}function vi(e,t,n){var r={};return n.isMergeableObject(e)&&zn(e).forEach(function(o){r[o]=Je(e[o],n)}),zn(t).forEach(function(o){(function(a,s){return Wn(a,s)&&!(Object.hasOwnProperty.call(a,s)&&Object.propertyIsEnumerable.call(a,s))})(e,o)||(Wn(e,o)&&n.isMergeableObject(t[o])?r[o]=function(a,s){if(!s.customMerge)return Be;var l=s.customMerge(a);return typeof l=="function"?l:Be}(o,n)(e[o],t[o],n):r[o]=Je(t[o],n))}),r}function Be(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||xi,n.isMergeableObject=n.isMergeableObject||wi,n.cloneUnlessOtherwiseSpecified=Je;var r=Array.isArray(t);return r===Array.isArray(e)?r?n.arrayMerge(e,t,n):vi(e,t,n):Je(t,n)}Be.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce(function(n,r){return Be(n,r,t)},{})};var Ci=bi(Be);const Bn={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},Gn={default:Bn,light:Bn,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Si(e,t,n,r){const[o,a]=i.useState(()=>Tn(e)),[s,l]=i.useState(""),d=i.useRef("");Ee(()=>{a(Tn(e))},[e]);const h=i.useCallback(O=>{var $,C,m;const{attributes:v}=O.target,D=($=v.getNamedItem("data-column-id"))===null||$===void 0?void 0:$.value;D&&(d.current=((m=(C=o[it(o,D)])===null||C===void 0?void 0:C.id)===null||m===void 0?void 0:m.toString())||"",l(d.current))},[o]),u=i.useCallback(O=>{var $;const{attributes:C}=O.target,m=($=C.getNamedItem("data-column-id"))===null||$===void 0?void 0:$.value;if(m&&d.current&&m!==d.current){const v=it(o,d.current),D=it(o,m),S=[...o];S[v]=o[D],S[D]=o[v],a(S),t(S)}},[t,o]),g=i.useCallback(O=>{O.preventDefault()},[]),y=i.useCallback(O=>{O.preventDefault()},[]),f=i.useCallback(O=>{O.preventDefault(),d.current="",l("")},[]),x=function(O=!1){return O?ve.ASC:ve.DESC}(r),R=i.useMemo(()=>o[it(o,n==null?void 0:n.toString())]||{},[n,o]);return{tableColumns:o,draggingColumnId:s,handleDragStart:h,handleDragEnter:u,handleDragOver:g,handleDragLeave:y,handleDragEnd:f,defaultSortDirection:x,defaultSortColumn:R}}var Ri=i.memo(function(e){const{data:t=c.data,columns:n=c.columns,title:r=c.title,actions:o=c.actions,keyField:a=c.keyField,striped:s=c.striped,highlightOnHover:l=c.highlightOnHover,pointerOnHover:d=c.pointerOnHover,dense:h=c.dense,selectableRows:u=c.selectableRows,selectableRowsSingle:g=c.selectableRowsSingle,selectableRowsHighlight:y=c.selectableRowsHighlight,selectableRowsNoSelectAll:f=c.selectableRowsNoSelectAll,selectableRowsVisibleOnly:x=c.selectableRowsVisibleOnly,selectableRowSelected:R=c.selectableRowSelected,selectableRowDisabled:O=c.selectableRowDisabled,selectableRowsComponent:$=c.selectableRowsComponent,selectableRowsComponentProps:C=c.selectableRowsComponentProps,onRowExpandToggled:m=c.onRowExpandToggled,onSelectedRowsChange:v=c.onSelectedRowsChange,expandableIcon:D=c.expandableIcon,onChangeRowsPerPage:S=c.onChangeRowsPerPage,onChangePage:p=c.onChangePage,paginationServer:A=c.paginationServer,paginationServerOptions:q=c.paginationServerOptions,paginationTotalRows:Y=c.paginationTotalRows,paginationDefaultPage:ee=c.paginationDefaultPage,paginationResetDefaultPage:ie=c.paginationResetDefaultPage,paginationPerPage:H=c.paginationPerPage,paginationRowsPerPageOptions:fe=c.paginationRowsPerPageOptions,paginationIconLastPage:Ce=c.paginationIconLastPage,paginationIconFirstPage:he=c.paginationIconFirstPage,paginationIconNext:se=c.paginationIconNext,paginationIconPrevious:Ae=c.paginationIconPrevious,paginationComponent:K=c.paginationComponent,paginationComponentOptions:me=c.paginationComponentOptions,responsive:de=c.responsive,progressPending:L=c.progressPending,progressComponent:Se=c.progressComponent,persistTableHead:Z=c.persistTableHead,noDataComponent:ue=c.noDataComponent,disabled:X=c.disabled,noTableHead:be=c.noTableHead,noHeader:pe=c.noHeader,fixedHeader:te=c.fixedHeader,fixedHeaderScrollHeight:Re=c.fixedHeaderScrollHeight,pagination:Q=c.pagination,subHeader:W=c.subHeader,subHeaderAlign:et=c.subHeaderAlign,subHeaderWrap:tt=c.subHeaderWrap,subHeaderComponent:Et=c.subHeaderComponent,noContextMenu:Ot=c.noContextMenu,contextMessage:Pt=c.contextMessage,contextActions:F=c.contextActions,contextComponent:vr=c.contextComponent,expandableRows:nt=c.expandableRows,onRowClicked:Xt=c.onRowClicked,onRowDoubleClicked:Qt=c.onRowDoubleClicked,onRowMouseEnter:Jt=c.onRowMouseEnter,onRowMouseLeave:en=c.onRowMouseLeave,sortIcon:Cr=c.sortIcon,onSort:Sr=c.onSort,sortFunction:tn=c.sortFunction,sortServer:kt=c.sortServer,expandableRowsComponent:Rr=c.expandableRowsComponent,expandableRowsComponentProps:$r=c.expandableRowsComponentProps,expandableRowDisabled:nn=c.expandableRowDisabled,expandableRowsHideExpander:rn=c.expandableRowsHideExpander,expandOnRowClicked:Er=c.expandOnRowClicked,expandOnRowDoubleClicked:Or=c.expandOnRowDoubleClicked,expandableRowExpanded:on=c.expandableRowExpanded,expandableInheritConditionalStyles:Pr=c.expandableInheritConditionalStyles,defaultSortFieldId:kr=c.defaultSortFieldId,defaultSortAsc:Dr=c.defaultSortAsc,clearSelectedRows:an=c.clearSelectedRows,conditionalRowStyles:Ir=c.conditionalRowStyles,theme:sn=c.theme,customStyles:ln=c.customStyles,direction:Ve=c.direction,onColumnOrderChange:Ar=c.onColumnOrderChange,className:jr,ariaLabel:cn}=e,{tableColumns:dn,draggingColumnId:un,handleDragStart:pn,handleDragEnter:gn,handleDragOver:fn,handleDragLeave:hn,handleDragEnd:mn,defaultSortDirection:_r,defaultSortColumn:Hr}=Si(n,Ar,kr,Dr),[{rowsPerPage:we,currentPage:re,selectedRows:Dt,allSelected:bn,selectedCount:wn,selectedColumn:le,sortDirection:je,toggleOnSelectedRowsChange:Tr},$e]=i.useReducer(ga,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:Hr,toggleOnSelectedRowsChange:!1,sortDirection:_r,currentPage:ee,rowsPerPage:H,selectedRowsFlag:!1,contextMessage:c.contextMessage}),{persistSelectedOnSort:yn=!1,persistSelectedOnPageChange:rt=!1}=q,xn=!(!A||!rt&&!yn),Fr=Q&&!L&&t.length>0,Mr=K||mi,Nr=i.useMemo(()=>((b={},I="default",V="default")=>{const oe=Gn[I]?I:V;return Ci({table:{style:{color:(w=Gn[oe]).text.primary,backgroundColor:w.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:w.text.primary,backgroundColor:w.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:w.background.default,minHeight:"52px"}},head:{style:{color:w.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:w.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:w.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:w.context.background,fontSize:"18px",fontWeight:400,color:w.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:w.text.primary,backgroundColor:w.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:w.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:w.selected.text,backgroundColor:w.selected.default,borderBottomColor:w.background.default}},highlightOnHoverStyle:{color:w.highlightOnHover.text,backgroundColor:w.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:w.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:w.background.default},stripedStyle:{color:w.striped.text,backgroundColor:w.striped.default}},expanderRow:{style:{color:w.text.primary,backgroundColor:w.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:w.button.default,fill:w.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:w.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:w.button.hover},"&:focus":{outline:"none",backgroundColor:w.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:w.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:w.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:w.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:w.button.default,fill:w.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:w.button.disabled,fill:w.button.disabled},"&:hover:not(:disabled)":{backgroundColor:w.button.hover},"&:focus":{outline:"none",backgroundColor:w.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:w.text.primary,backgroundColor:w.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:w.text.primary,backgroundColor:w.background.default}}},b);var w})(ln,sn),[ln,sn]),Lr=i.useMemo(()=>Object.assign({},Ve!=="auto"&&{dir:Ve}),[Ve]),B=i.useMemo(()=>{if(kt)return t;if(le!=null&&le.sortFunction&&typeof le.sortFunction=="function"){const b=le.sortFunction,I=je===ve.ASC?b:(V,oe)=>-1*b(V,oe);return[...t].sort(I)}return function(b,I,V,oe){return I?oe&&typeof oe=="function"?oe(b.slice(0),I,V):b.slice(0).sort((w,It)=>{const He=I(w),ye=I(It);if(V==="asc"){if(He<ye)return-1;if(He>ye)return 1}if(V==="desc"){if(He>ye)return-1;if(He<ye)return 1}return 0}):b}(t,le==null?void 0:le.selector,je,tn)},[kt,le,je,t,tn]),Ue=i.useMemo(()=>{if(Q&&!A){const b=re*we,I=b-we;return B.slice(I,b)}return B},[re,Q,A,we,B]),zr=i.useCallback(b=>{$e(b)},[]),Wr=i.useCallback(b=>{$e(b)},[]),Br=i.useCallback(b=>{$e(b)},[]),Gr=i.useCallback((b,I)=>Xt(b,I),[Xt]),Yr=i.useCallback((b,I)=>Qt(b,I),[Qt]),Vr=i.useCallback((b,I)=>Jt(b,I),[Jt]),Ur=i.useCallback((b,I)=>en(b,I),[en]),_e=i.useCallback(b=>$e({type:"CHANGE_PAGE",page:b,paginationServer:A,visibleOnly:x,persistSelectedOnPageChange:rt}),[A,rt,x]),qr=i.useCallback(b=>{const I=Ze(Y||Ue.length,b),V=Tt(re,I);A||_e(V),$e({type:"CHANGE_ROWS_PER_PAGE",page:V,rowsPerPage:b})},[re,_e,A,Y,Ue.length]);if(Q&&!A&&B.length>0&&Ue.length===0){const b=Ze(B.length,we),I=Tt(re,b);_e(I)}Ee(()=>{v({allSelected:bn,selectedCount:wn,selectedRows:Dt.slice(0)})},[Tr]),Ee(()=>{Sr(le,je,B.slice(0))},[le,je]),Ee(()=>{p(re,Y||B.length)},[re]),Ee(()=>{S(we,re)},[we]),Ee(()=>{_e(ee)},[ee,ie]),Ee(()=>{if(Q&&A&&Y>0){const b=Ze(Y,we),I=Tt(re,b);re!==I&&_e(I)}},[Y]),i.useEffect(()=>{$e({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:an})},[g,an]),i.useEffect(()=>{if(!R)return;const b=B.filter(V=>R(V)),I=g?b.slice(0,1):b;$e({type:"SELECT_MULTIPLE_ROWS",keyField:a,selectedRows:I,totalRows:B.length,mergeSelections:xn})},[t,R]);const Kr=x?Ue:B,Zr=rt||g||f;return i.createElement(ca,{theme:Nr},!pe&&(!!r||!!o)&&i.createElement(Qa,{title:r,actions:o,showMenu:!Ot,selectedCount:wn,direction:Ve,contextActions:F,contextComponent:vr,contextMessage:Pt}),W&&i.createElement(ti,{align:et,wrapContent:tt},Et),i.createElement(ri,Object.assign({$responsive:de,$fixedHeader:te,$fixedHeaderScrollHeight:Re,className:jr},Lr),i.createElement(oi,null,L&&!Z&&i.createElement(Ln,null,Se),i.createElement(ha,Object.assign({disabled:X,className:"rdt_Table",role:"table"},cn&&{"aria-label":cn}),!be&&(!!Z||B.length>0&&!L)&&i.createElement(ba,{className:"rdt_TableHead",role:"rowgroup",$fixedHeader:te},i.createElement(wa,{className:"rdt_TableHeadRow",role:"row",$dense:h},u&&(Zr?i.createElement(Ye,{style:{flex:"0 0 48px"}}):i.createElement(Ya,{allSelected:bn,selectedRows:Dt,selectableRowsComponent:$,selectableRowsComponentProps:C,selectableRowDisabled:O,rowData:Kr,keyField:a,mergeSelections:xn,onSelectAllRows:Wr})),nt&&!rn&&i.createElement(ai,null),dn.map(b=>i.createElement(Ba,{key:b.id,column:b,selectedColumn:le,disabled:L||B.length===0,pagination:Q,paginationServer:A,persistSelectedOnSort:yn,selectableRowsVisibleOnly:x,sortDirection:je,sortIcon:Cr,sortServer:kt,onSort:zr,onDragStart:pn,onDragOver:fn,onDragEnd:mn,onDragEnter:gn,onDragLeave:hn,draggingColumnId:un})))),!B.length&&!L&&i.createElement(ii,null,ue),L&&Z&&i.createElement(Ln,null,Se),!L&&B.length>0&&i.createElement(ni,{className:"rdt_TableBody",role:"rowgroup"},Ue.map((b,I)=>{const V=We(b,a),oe=function(ye=""){return typeof ye!="number"&&(!ye||ye.length===0)}(V)?I:V,w=gt(b,Dt,a),It=!!(nt&&on&&on(b)),He=!!(nt&&nn&&nn(b));return i.createElement(Ta,{id:oe,key:oe,keyField:a,"data-row-id":oe,columns:dn,row:b,rowCount:B.length,rowIndex:I,selectableRows:u,expandableRows:nt,expandableIcon:D,highlightOnHover:l,pointerOnHover:d,dense:h,expandOnRowClicked:Er,expandOnRowDoubleClicked:Or,expandableRowsComponent:Rr,expandableRowsComponentProps:$r,expandableRowsHideExpander:rn,defaultExpanderDisabled:He,defaultExpanded:It,expandableInheritConditionalStyles:Pr,conditionalRowStyles:Ir,selected:w,selectableRowsHighlight:y,selectableRowsComponent:$,selectableRowsComponentProps:C,selectableRowDisabled:O,selectableRowsSingle:g,striped:s,onRowExpandToggled:m,onRowClicked:Gr,onRowDoubleClicked:Yr,onRowMouseEnter:Vr,onRowMouseLeave:Ur,onSelectedRow:Br,draggingColumnId:un,onDragStart:pn,onDragOver:fn,onDragEnd:mn,onDragEnter:gn,onDragLeave:hn})}))))),Fr&&i.createElement("div",null,i.createElement(Mr,{onChangePage:_e,onChangeRowsPerPage:qr,rowCount:Y||B.length,currentPage:re,rowsPerPage:we,direction:Ve,paginationRowsPerPageOptions:fe,paginationIconLastPage:Ce,paginationIconFirstPage:he,paginationIconNext:se,paginationIconPrevious:Ae,paginationComponentOptions:me})))});function ds({messages:e}){const[t,n]=i.useState(e.data),{auth:r}=Xr().props;i.useEffect(()=>{Qr.reload({only:["messages"]})},[r]),i.useEffect(()=>{e&&(n(e.data),console.log(t,`length: ${t.length}`))},[e]);const[o,a]=i.useState(!1),s=[{name:"User",selector:l=>`${l.user.firstname} ${l.user.lastname}`,sortable:!0},{name:"Email",selector:l=>l.user.email,sortable:!0},{name:"Subject",selector:l=>l.subject,sortable:!0},{name:"Message",selector:l=>l.message,sortable:!0},{name:"Date Created",selector:l=>no(l.created_at).format("MMM DD YYYY, h:mm a"),sortable:!0},{name:"Actions",cell:l=>U.jsxs(U.Fragment,{children:[U.jsx(eo,{children:U.jsx(so,{})}),U.jsx(to,{children:U.jsx(ao,{})})]}),ignoreRowClick:!0,button:!0}];return U.jsx(Jr,{header:"Mail",children:U.jsxs(ro.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[U.jsxs("div",{className:"mb-8",children:[U.jsx("h2",{className:"text-3xl font-bold mb-2 text-primary",children:"Mail Messages"}),U.jsx("p",{className:"text-muted-foreground",children:"See all messages here."})]}),U.jsx("div",{className:"px-4 md:px-6 py-6 space-y-6",children:U.jsx("div",{className:"flex justify-between items-center mb-6",children:U.jsx(Ri,{columns:s,data:t,noTableHead:!1,responsive:!1})})})]})})}export{ds as default};
