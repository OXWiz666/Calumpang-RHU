import{j as t}from"./app-BQNQ1hxz.js";import{t as p}from"./use-toast-Dm0PN6fH.js";import{R as y}from"./refresh-cw-D3hZ7e_O.js";import{S as x}from"./save-CAdd64LS.js";import{S as f}from"./square-pen-Bb1JtfBr.js";import{c as a}from"./createLucideIcon-BKWaAi2G.js";import{D as u}from"./download-BH8XyxCx.js";import{T as h}from"./trash-2-DJ5zXW8D.js";import{A as v,a as b}from"./archive-BwGVl8jP.js";import{I as g}from"./info-BVLwYIm5.js";import{T as k}from"./triangle-alert-BslwqqvL.js";import{C}from"./circle-x-Cf2XhiVO.js";import{C as N}from"./circle-check-F3PuHnLX.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]],j=a("Upload",w);/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],_=a("UserMinus",U);/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],M=a("UserPlus",I),c={success:{className:"bg-green-50 border-green-200 text-green-800",icon:N,iconColor:"text-green-600"},error:{className:"bg-red-50 border-red-200 text-red-800",icon:C,iconColor:"text-red-600"},warning:{className:"bg-yellow-50 border-yellow-200 text-yellow-800",icon:k,iconColor:"text-yellow-600"},info:{className:"bg-blue-50 border-blue-200 text-blue-800",icon:g,iconColor:"text-blue-600"}},S={archive:b,unarchive:v,delete:h,create:M,remove:_,export:u,import:j,edit:f,save:x,update:y},i=(o,r,e="info",n=null,l={})=>{const s=c[e]||c.info,m=n?S[n]:s.icon,d={duration:e==="error"?6e3:4e3,...l};p({title:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(m,{className:`h-4 w-4 ${s.iconColor}`}),t.jsx("span",{className:"font-semibold",children:o})]}),description:r,className:s.className,...d})},z=(o,r,e=null)=>i(o,r,"success",e),B=(o,r,e=null)=>i(o,r,"error",e);export{_ as U,z as a,i as s,B as t};
