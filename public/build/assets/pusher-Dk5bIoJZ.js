import{c}from"./createLucideIcon-DsPw26Nq.js";import{q as a,r as u}from"./app-9IFjvyjq.js";/**
 * @license lucide-react v0.477.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],h=c("Mail",d);function l({channelName:i="notification",eventName:r="notification-event",onEvent:s=t=>{}}){var e;const{auth:t}=a().props;return u.useEffect(()=>{var n;if(!((n=t.user)!=null&&n.id))return;const o=window.Echo.private(`${i}.${t.user.id}`);return o.listen(`.${r}`,s),()=>{window.Echo.leave(`${i}.${t.user.id}`),o.stopListening(`.${r}`)}},[(e=t.user)==null?void 0:e.id]),null}export{h as M,l as P};
