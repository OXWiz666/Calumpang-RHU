import{j as o}from"./app-BYek28t3.js";import{t as d}from"./Toaster-WULlhlN-.js";import{R as p}from"./refresh-cw-n5BNCQKk.js";import{S as y}from"./save-Dt_DrhAI.js";import{S as x}from"./square-pen-sR7dtdHg.js";import{c as r}from"./createLucideIcon-Iodx7ABU.js";import{D as f}from"./download-DOJsDjpU.js";import{T as u}from"./trash-2-DhHB7lAu.js";import{A as h,a as v}from"./archive-B0x7XRz2.js";import{I as b}from"./info-BIde0Eah.js";import{T as g}from"./triangle-alert-D-giMksT.js";import{C as k}from"./circle-x-CMX0f99D.js";import{C}from"./circle-check-BSVi-drZ.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]],w=r("Upload",N);/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],U=r("UserMinus",j);/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],I=r("UserPlus",_),a={success:{className:"bg-green-50 border-green-200 text-green-800",icon:C,iconColor:"text-green-600"},error:{className:"bg-red-50 border-red-200 text-red-800",icon:k,iconColor:"text-red-600"},warning:{className:"bg-yellow-50 border-yellow-200 text-yellow-800",icon:g,iconColor:"text-yellow-600"},info:{className:"bg-blue-50 border-blue-200 text-blue-800",icon:b,iconColor:"text-blue-600"}},M={archive:v,unarchive:h,delete:u,create:I,remove:U,export:f,import:w,edit:x,save:y,update:p},X=(n,i,s="info",t=null,c={})=>{const e=a[s]||a.info,l=t?M[t]:e.icon,m={duration:s==="error"?6e3:4e3,...c};d({title:o.jsxs("div",{className:"flex items-center gap-2",children:[o.jsx(l,{className:`h-4 w-4 ${e.iconColor}`}),o.jsx("span",{className:"font-semibold",children:n})]}),description:i,className:e.className,...m})};export{U,X as s};
