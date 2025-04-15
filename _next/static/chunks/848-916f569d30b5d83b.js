"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[848],{6101:(e,r,o)=>{o.d(r,{s:()=>l,t:()=>a});var t=o(12115);function n(e,r){if("function"==typeof e)return e(r);null!=e&&(e.current=r)}function a(...e){return r=>{let o=!1,t=e.map(e=>{let t=n(e,r);return o||"function"!=typeof t||(o=!0),t});if(o)return()=>{for(let r=0;r<t.length;r++){let o=t[r];"function"==typeof o?o():n(e[r],null)}}}}function l(...e){return t.useCallback(a(...e),e)}},39688:(e,r,o)=>{o.d(r,{QP:()=>ed});let t=e=>{let r=s(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:e=>{let o=e.split("-");return""===o[0]&&1!==o.length&&o.shift(),n(o,r)||l(e)},getConflictingClassGroupIds:(e,r)=>{let n=o[e]||[];return r&&t[e]?[...n,...t[e]]:n}}},n=(e,r)=>{if(0===e.length)return r.classGroupId;let o=e[0],t=r.nextPart.get(o),a=t?n(e.slice(1),t):void 0;if(a)return a;if(0===r.validators.length)return;let l=e.join("-");return r.validators.find(({validator:e})=>e(l))?.classGroupId},a=/^\[(.+)\]$/,l=e=>{if(a.test(e)){let r=a.exec(e)[1],o=r?.substring(0,r.indexOf(":"));if(o)return"arbitrary.."+o}},s=e=>{let{theme:r,classGroups:o}=e,t={nextPart:new Map,validators:[]};for(let e in o)i(o[e],t,e,r);return t},i=(e,r,o,t)=>{e.forEach(e=>{if("string"==typeof e){(""===e?r:d(r,e)).classGroupId=o;return}if("function"==typeof e){if(c(e)){i(e(t),r,o,t);return}r.validators.push({validator:e,classGroupId:o});return}Object.entries(e).forEach(([e,n])=>{i(n,d(r,e),o,t)})})},d=(e,r)=>{let o=e;return r.split("-").forEach(e=>{o.nextPart.has(e)||o.nextPart.set(e,{nextPart:new Map,validators:[]}),o=o.nextPart.get(e)}),o},c=e=>e.isThemeGetter,m=e=>{if(e<1)return{get:()=>void 0,set:()=>{}};let r=0,o=new Map,t=new Map,n=(n,a)=>{o.set(n,a),++r>e&&(r=0,t=o,o=new Map)};return{get(e){let r=o.get(e);return void 0!==r?r:void 0!==(r=t.get(e))?(n(e,r),r):void 0},set(e,r){o.has(e)?o.set(e,r):n(e,r)}}},p=e=>{let{prefix:r,experimentalParseClassName:o}=e,t=e=>{let r;let o=[],t=0,n=0,a=0;for(let l=0;l<e.length;l++){let s=e[l];if(0===t&&0===n){if(":"===s){o.push(e.slice(a,l)),a=l+1;continue}if("/"===s){r=l;continue}}"["===s?t++:"]"===s?t--:"("===s?n++:")"===s&&n--}let l=0===o.length?e:e.substring(a),s=u(l);return{modifiers:o,hasImportantModifier:s!==l,baseClassName:s,maybePostfixModifierPosition:r&&r>a?r-a:void 0}};if(r){let e=r+":",o=t;t=r=>r.startsWith(e)?o(r.substring(e.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:r,maybePostfixModifierPosition:void 0}}if(o){let e=t;t=r=>o({className:r,parseClassName:e})}return t},u=e=>e.endsWith("!")?e.substring(0,e.length-1):e.startsWith("!")?e.substring(1):e,f=e=>{let r=Object.fromEntries(e.orderSensitiveModifiers.map(e=>[e,!0]));return e=>{if(e.length<=1)return e;let o=[],t=[];return e.forEach(e=>{"["===e[0]||r[e]?(o.push(...t.sort(),e),t=[]):t.push(e)}),o.push(...t.sort()),o}},b=e=>({cache:m(e.cacheSize),parseClassName:p(e),sortModifiers:f(e),...t(e)}),g=/\s+/,h=(e,r)=>{let{parseClassName:o,getClassGroupId:t,getConflictingClassGroupIds:n,sortModifiers:a}=r,l=[],s=e.trim().split(g),i="";for(let e=s.length-1;e>=0;e-=1){let r=s[e],{isExternal:d,modifiers:c,hasImportantModifier:m,baseClassName:p,maybePostfixModifierPosition:u}=o(r);if(d){i=r+(i.length>0?" "+i:i);continue}let f=!!u,b=t(f?p.substring(0,u):p);if(!b){if(!f||!(b=t(p))){i=r+(i.length>0?" "+i:i);continue}f=!1}let g=a(c).join(":"),h=m?g+"!":g,k=h+b;if(l.includes(k))continue;l.push(k);let x=n(b,f);for(let e=0;e<x.length;++e){let r=x[e];l.push(h+r)}i=r+(i.length>0?" "+i:i)}return i};function k(){let e,r,o=0,t="";for(;o<arguments.length;)(e=arguments[o++])&&(r=x(e))&&(t&&(t+=" "),t+=r);return t}let x=e=>{let r;if("string"==typeof e)return e;let o="";for(let t=0;t<e.length;t++)e[t]&&(r=x(e[t]))&&(o&&(o+=" "),o+=r);return o},w=e=>{let r=r=>r[e]||[];return r.isThemeGetter=!0,r},y=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,v=/^\((?:(\w[\w-]*):)?(.+)\)$/i,z=/^\d+\/\d+$/,j=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,C=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,E=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,N=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,M=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,P=e=>z.test(e),$=e=>!!e&&!Number.isNaN(Number(e)),G=e=>!!e&&Number.isInteger(Number(e)),I=e=>e.endsWith("%")&&$(e.slice(0,-1)),S=e=>j.test(e),_=()=>!0,W=e=>C.test(e)&&!E.test(e),O=()=>!1,R=e=>N.test(e),A=e=>M.test(e),T=e=>!D(e)&&!X(e),V=e=>ee(e,en,O),D=e=>y.test(e),q=e=>ee(e,ea,W),B=e=>ee(e,el,$),F=e=>ee(e,eo,O),L=e=>ee(e,et,A),Q=e=>ee(e,ei,R),X=e=>v.test(e),Z=e=>er(e,ea),H=e=>er(e,es),J=e=>er(e,eo),K=e=>er(e,en),U=e=>er(e,et),Y=e=>er(e,ei,!0),ee=(e,r,o)=>{let t=y.exec(e);return!!t&&(t[1]?r(t[1]):o(t[2]))},er=(e,r,o=!1)=>{let t=v.exec(e);return!!t&&(t[1]?r(t[1]):o)},eo=e=>"position"===e||"percentage"===e,et=e=>"image"===e||"url"===e,en=e=>"length"===e||"size"===e||"bg-size"===e,ea=e=>"length"===e,el=e=>"number"===e,es=e=>"family-name"===e,ei=e=>"shadow"===e;Symbol.toStringTag;let ed=function(e,...r){let o,t,n;let a=function(s){return t=(o=b(r.reduce((e,r)=>r(e),e()))).cache.get,n=o.cache.set,a=l,l(s)};function l(e){let r=t(e);if(r)return r;let a=h(e,o);return n(e,a),a}return function(){return a(k.apply(null,arguments))}}(()=>{let e=w("color"),r=w("font"),o=w("text"),t=w("font-weight"),n=w("tracking"),a=w("leading"),l=w("breakpoint"),s=w("container"),i=w("spacing"),d=w("radius"),c=w("shadow"),m=w("inset-shadow"),p=w("text-shadow"),u=w("drop-shadow"),f=w("blur"),b=w("perspective"),g=w("aspect"),h=w("ease"),k=w("animate"),x=()=>["auto","avoid","all","avoid-page","page","left","right","column"],y=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],v=()=>[...y(),X,D],z=()=>["auto","hidden","clip","visible","scroll"],j=()=>["auto","contain","none"],C=()=>[X,D,i],E=()=>[P,"full","auto",...C()],N=()=>[G,"none","subgrid",X,D],M=()=>["auto",{span:["full",G,X,D]},G,X,D],W=()=>[G,"auto",X,D],O=()=>["auto","min","max","fr",X,D],R=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],A=()=>["start","end","center","stretch","center-safe","end-safe"],ee=()=>["auto",...C()],er=()=>[P,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...C()],eo=()=>[e,X,D],et=()=>[...y(),J,F,{position:[X,D]}],en=()=>["no-repeat",{repeat:["","x","y","space","round"]}],ea=()=>["auto","cover","contain",K,V,{size:[X,D]}],el=()=>[I,Z,q],es=()=>["","none","full",d,X,D],ei=()=>["",$,Z,q],ed=()=>["solid","dashed","dotted","double"],ec=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],em=()=>[$,I,J,F],ep=()=>["","none",f,X,D],eu=()=>["none",$,X,D],ef=()=>["none",$,X,D],eb=()=>[$,X,D],eg=()=>[P,"full",...C()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[S],breakpoint:[S],color:[_],container:[S],"drop-shadow":[S],ease:["in","out","in-out"],font:[T],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[S],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[S],shadow:[S],spacing:["px",$],text:[S],"text-shadow":[S],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",P,D,X,g]}],container:["container"],columns:[{columns:[$,D,X,s]}],"break-after":[{"break-after":x()}],"break-before":[{"break-before":x()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:v()}],overflow:[{overflow:z()}],"overflow-x":[{"overflow-x":z()}],"overflow-y":[{"overflow-y":z()}],overscroll:[{overscroll:j()}],"overscroll-x":[{"overscroll-x":j()}],"overscroll-y":[{"overscroll-y":j()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:E()}],"inset-x":[{"inset-x":E()}],"inset-y":[{"inset-y":E()}],start:[{start:E()}],end:[{end:E()}],top:[{top:E()}],right:[{right:E()}],bottom:[{bottom:E()}],left:[{left:E()}],visibility:["visible","invisible","collapse"],z:[{z:[G,"auto",X,D]}],basis:[{basis:[P,"full","auto",s,...C()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[$,P,"auto","initial","none",D]}],grow:[{grow:["",$,X,D]}],shrink:[{shrink:["",$,X,D]}],order:[{order:[G,"first","last","none",X,D]}],"grid-cols":[{"grid-cols":N()}],"col-start-end":[{col:M()}],"col-start":[{"col-start":W()}],"col-end":[{"col-end":W()}],"grid-rows":[{"grid-rows":N()}],"row-start-end":[{row:M()}],"row-start":[{"row-start":W()}],"row-end":[{"row-end":W()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":O()}],"auto-rows":[{"auto-rows":O()}],gap:[{gap:C()}],"gap-x":[{"gap-x":C()}],"gap-y":[{"gap-y":C()}],"justify-content":[{justify:[...R(),"normal"]}],"justify-items":[{"justify-items":[...A(),"normal"]}],"justify-self":[{"justify-self":["auto",...A()]}],"align-content":[{content:["normal",...R()]}],"align-items":[{items:[...A(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...A(),{baseline:["","last"]}]}],"place-content":[{"place-content":R()}],"place-items":[{"place-items":[...A(),"baseline"]}],"place-self":[{"place-self":["auto",...A()]}],p:[{p:C()}],px:[{px:C()}],py:[{py:C()}],ps:[{ps:C()}],pe:[{pe:C()}],pt:[{pt:C()}],pr:[{pr:C()}],pb:[{pb:C()}],pl:[{pl:C()}],m:[{m:ee()}],mx:[{mx:ee()}],my:[{my:ee()}],ms:[{ms:ee()}],me:[{me:ee()}],mt:[{mt:ee()}],mr:[{mr:ee()}],mb:[{mb:ee()}],ml:[{ml:ee()}],"space-x":[{"space-x":C()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":C()}],"space-y-reverse":["space-y-reverse"],size:[{size:er()}],w:[{w:[s,"screen",...er()]}],"min-w":[{"min-w":[s,"screen","none",...er()]}],"max-w":[{"max-w":[s,"screen","none","prose",{screen:[l]},...er()]}],h:[{h:["screen",...er()]}],"min-h":[{"min-h":["screen","none",...er()]}],"max-h":[{"max-h":["screen",...er()]}],"font-size":[{text:["base",o,Z,q]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[t,X,B]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",I,D]}],"font-family":[{font:[H,D,r]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[n,X,D]}],"line-clamp":[{"line-clamp":[$,"none",X,B]}],leading:[{leading:[a,...C()]}],"list-image":[{"list-image":["none",X,D]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",X,D]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:eo()}],"text-color":[{text:eo()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...ed(),"wavy"]}],"text-decoration-thickness":[{decoration:[$,"from-font","auto",X,q]}],"text-decoration-color":[{decoration:eo()}],"underline-offset":[{"underline-offset":[$,"auto",X,D]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:C()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",X,D]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",X,D]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:et()}],"bg-repeat":[{bg:en()}],"bg-size":[{bg:ea()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},G,X,D],radial:["",X,D],conic:[G,X,D]},U,L]}],"bg-color":[{bg:eo()}],"gradient-from-pos":[{from:el()}],"gradient-via-pos":[{via:el()}],"gradient-to-pos":[{to:el()}],"gradient-from":[{from:eo()}],"gradient-via":[{via:eo()}],"gradient-to":[{to:eo()}],rounded:[{rounded:es()}],"rounded-s":[{"rounded-s":es()}],"rounded-e":[{"rounded-e":es()}],"rounded-t":[{"rounded-t":es()}],"rounded-r":[{"rounded-r":es()}],"rounded-b":[{"rounded-b":es()}],"rounded-l":[{"rounded-l":es()}],"rounded-ss":[{"rounded-ss":es()}],"rounded-se":[{"rounded-se":es()}],"rounded-ee":[{"rounded-ee":es()}],"rounded-es":[{"rounded-es":es()}],"rounded-tl":[{"rounded-tl":es()}],"rounded-tr":[{"rounded-tr":es()}],"rounded-br":[{"rounded-br":es()}],"rounded-bl":[{"rounded-bl":es()}],"border-w":[{border:ei()}],"border-w-x":[{"border-x":ei()}],"border-w-y":[{"border-y":ei()}],"border-w-s":[{"border-s":ei()}],"border-w-e":[{"border-e":ei()}],"border-w-t":[{"border-t":ei()}],"border-w-r":[{"border-r":ei()}],"border-w-b":[{"border-b":ei()}],"border-w-l":[{"border-l":ei()}],"divide-x":[{"divide-x":ei()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":ei()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...ed(),"hidden","none"]}],"divide-style":[{divide:[...ed(),"hidden","none"]}],"border-color":[{border:eo()}],"border-color-x":[{"border-x":eo()}],"border-color-y":[{"border-y":eo()}],"border-color-s":[{"border-s":eo()}],"border-color-e":[{"border-e":eo()}],"border-color-t":[{"border-t":eo()}],"border-color-r":[{"border-r":eo()}],"border-color-b":[{"border-b":eo()}],"border-color-l":[{"border-l":eo()}],"divide-color":[{divide:eo()}],"outline-style":[{outline:[...ed(),"none","hidden"]}],"outline-offset":[{"outline-offset":[$,X,D]}],"outline-w":[{outline:["",$,Z,q]}],"outline-color":[{outline:eo()}],shadow:[{shadow:["","none",c,Y,Q]}],"shadow-color":[{shadow:eo()}],"inset-shadow":[{"inset-shadow":["none",m,Y,Q]}],"inset-shadow-color":[{"inset-shadow":eo()}],"ring-w":[{ring:ei()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:eo()}],"ring-offset-w":[{"ring-offset":[$,q]}],"ring-offset-color":[{"ring-offset":eo()}],"inset-ring-w":[{"inset-ring":ei()}],"inset-ring-color":[{"inset-ring":eo()}],"text-shadow":[{"text-shadow":["none",p,Y,Q]}],"text-shadow-color":[{"text-shadow":eo()}],opacity:[{opacity:[$,X,D]}],"mix-blend":[{"mix-blend":[...ec(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":ec()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[$]}],"mask-image-linear-from-pos":[{"mask-linear-from":em()}],"mask-image-linear-to-pos":[{"mask-linear-to":em()}],"mask-image-linear-from-color":[{"mask-linear-from":eo()}],"mask-image-linear-to-color":[{"mask-linear-to":eo()}],"mask-image-t-from-pos":[{"mask-t-from":em()}],"mask-image-t-to-pos":[{"mask-t-to":em()}],"mask-image-t-from-color":[{"mask-t-from":eo()}],"mask-image-t-to-color":[{"mask-t-to":eo()}],"mask-image-r-from-pos":[{"mask-r-from":em()}],"mask-image-r-to-pos":[{"mask-r-to":em()}],"mask-image-r-from-color":[{"mask-r-from":eo()}],"mask-image-r-to-color":[{"mask-r-to":eo()}],"mask-image-b-from-pos":[{"mask-b-from":em()}],"mask-image-b-to-pos":[{"mask-b-to":em()}],"mask-image-b-from-color":[{"mask-b-from":eo()}],"mask-image-b-to-color":[{"mask-b-to":eo()}],"mask-image-l-from-pos":[{"mask-l-from":em()}],"mask-image-l-to-pos":[{"mask-l-to":em()}],"mask-image-l-from-color":[{"mask-l-from":eo()}],"mask-image-l-to-color":[{"mask-l-to":eo()}],"mask-image-x-from-pos":[{"mask-x-from":em()}],"mask-image-x-to-pos":[{"mask-x-to":em()}],"mask-image-x-from-color":[{"mask-x-from":eo()}],"mask-image-x-to-color":[{"mask-x-to":eo()}],"mask-image-y-from-pos":[{"mask-y-from":em()}],"mask-image-y-to-pos":[{"mask-y-to":em()}],"mask-image-y-from-color":[{"mask-y-from":eo()}],"mask-image-y-to-color":[{"mask-y-to":eo()}],"mask-image-radial":[{"mask-radial":[X,D]}],"mask-image-radial-from-pos":[{"mask-radial-from":em()}],"mask-image-radial-to-pos":[{"mask-radial-to":em()}],"mask-image-radial-from-color":[{"mask-radial-from":eo()}],"mask-image-radial-to-color":[{"mask-radial-to":eo()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":y()}],"mask-image-conic-pos":[{"mask-conic":[$]}],"mask-image-conic-from-pos":[{"mask-conic-from":em()}],"mask-image-conic-to-pos":[{"mask-conic-to":em()}],"mask-image-conic-from-color":[{"mask-conic-from":eo()}],"mask-image-conic-to-color":[{"mask-conic-to":eo()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:et()}],"mask-repeat":[{mask:en()}],"mask-size":[{mask:ea()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",X,D]}],filter:[{filter:["","none",X,D]}],blur:[{blur:ep()}],brightness:[{brightness:[$,X,D]}],contrast:[{contrast:[$,X,D]}],"drop-shadow":[{"drop-shadow":["","none",u,Y,Q]}],"drop-shadow-color":[{"drop-shadow":eo()}],grayscale:[{grayscale:["",$,X,D]}],"hue-rotate":[{"hue-rotate":[$,X,D]}],invert:[{invert:["",$,X,D]}],saturate:[{saturate:[$,X,D]}],sepia:[{sepia:["",$,X,D]}],"backdrop-filter":[{"backdrop-filter":["","none",X,D]}],"backdrop-blur":[{"backdrop-blur":ep()}],"backdrop-brightness":[{"backdrop-brightness":[$,X,D]}],"backdrop-contrast":[{"backdrop-contrast":[$,X,D]}],"backdrop-grayscale":[{"backdrop-grayscale":["",$,X,D]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[$,X,D]}],"backdrop-invert":[{"backdrop-invert":["",$,X,D]}],"backdrop-opacity":[{"backdrop-opacity":[$,X,D]}],"backdrop-saturate":[{"backdrop-saturate":[$,X,D]}],"backdrop-sepia":[{"backdrop-sepia":["",$,X,D]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":C()}],"border-spacing-x":[{"border-spacing-x":C()}],"border-spacing-y":[{"border-spacing-y":C()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",X,D]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[$,"initial",X,D]}],ease:[{ease:["linear","initial",h,X,D]}],delay:[{delay:[$,X,D]}],animate:[{animate:["none",k,X,D]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[b,X,D]}],"perspective-origin":[{"perspective-origin":v()}],rotate:[{rotate:eu()}],"rotate-x":[{"rotate-x":eu()}],"rotate-y":[{"rotate-y":eu()}],"rotate-z":[{"rotate-z":eu()}],scale:[{scale:ef()}],"scale-x":[{"scale-x":ef()}],"scale-y":[{"scale-y":ef()}],"scale-z":[{"scale-z":ef()}],"scale-3d":["scale-3d"],skew:[{skew:eb()}],"skew-x":[{"skew-x":eb()}],"skew-y":[{"skew-y":eb()}],transform:[{transform:[X,D,"","none","gpu","cpu"]}],"transform-origin":[{origin:v()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:eg()}],"translate-x":[{"translate-x":eg()}],"translate-y":[{"translate-y":eg()}],"translate-z":[{"translate-z":eg()}],"translate-none":["translate-none"],accent:[{accent:eo()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:eo()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",X,D]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":C()}],"scroll-mx":[{"scroll-mx":C()}],"scroll-my":[{"scroll-my":C()}],"scroll-ms":[{"scroll-ms":C()}],"scroll-me":[{"scroll-me":C()}],"scroll-mt":[{"scroll-mt":C()}],"scroll-mr":[{"scroll-mr":C()}],"scroll-mb":[{"scroll-mb":C()}],"scroll-ml":[{"scroll-ml":C()}],"scroll-p":[{"scroll-p":C()}],"scroll-px":[{"scroll-px":C()}],"scroll-py":[{"scroll-py":C()}],"scroll-ps":[{"scroll-ps":C()}],"scroll-pe":[{"scroll-pe":C()}],"scroll-pt":[{"scroll-pt":C()}],"scroll-pr":[{"scroll-pr":C()}],"scroll-pb":[{"scroll-pb":C()}],"scroll-pl":[{"scroll-pl":C()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",X,D]}],fill:[{fill:["none",...eo()]}],"stroke-w":[{stroke:[$,Z,q,B]}],stroke:[{stroke:["none",...eo()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}})},52596:(e,r,o)=>{function t(){for(var e,r,o=0,t="",n=arguments.length;o<n;o++)(e=arguments[o])&&(r=function e(r){var o,t,n="";if("string"==typeof r||"number"==typeof r)n+=r;else if("object"==typeof r){if(Array.isArray(r)){var a=r.length;for(o=0;o<a;o++)r[o]&&(t=e(r[o]))&&(n&&(n+=" "),n+=t)}else for(t in r)r[t]&&(n&&(n+=" "),n+=t)}return n}(e))&&(t&&(t+=" "),t+=r);return t}o.d(r,{$:()=>t,A:()=>n});let n=t},99708:(e,r,o)=>{o.d(r,{DX:()=>s,TL:()=>l});var t=o(12115),n=o(6101),a=o(95155);function l(e){let r=function(e){let r=t.forwardRef((e,r)=>{let{children:o,...a}=e;if(t.isValidElement(o)){var l;let e,s;let i=(l=o,(s=(e=Object.getOwnPropertyDescriptor(l.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?l.ref:(s=(e=Object.getOwnPropertyDescriptor(l,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?l.props.ref:l.props.ref||l.ref),d=function(e,r){let o={...r};for(let t in r){let n=e[t],a=r[t];/^on[A-Z]/.test(t)?n&&a?o[t]=(...e)=>{a(...e),n(...e)}:n&&(o[t]=n):"style"===t?o[t]={...n,...a}:"className"===t&&(o[t]=[n,a].filter(Boolean).join(" "))}return{...e,...o}}(a,o.props);return o.type!==t.Fragment&&(d.ref=r?(0,n.t)(r,i):i),t.cloneElement(o,d)}return t.Children.count(o)>1?t.Children.only(null):null});return r.displayName=`${e}.SlotClone`,r}(e),o=t.forwardRef((e,o)=>{let{children:n,...l}=e,s=t.Children.toArray(n),i=s.find(d);if(i){let e=i.props.children,n=s.map(r=>r!==i?r:t.Children.count(e)>1?t.Children.only(null):t.isValidElement(e)?e.props.children:null);return(0,a.jsx)(r,{...l,ref:o,children:t.isValidElement(e)?t.cloneElement(e,void 0,n):null})}return(0,a.jsx)(r,{...l,ref:o,children:n})});return o.displayName=`${e}.Slot`,o}var s=l("Slot"),i=Symbol("radix.slottable");function d(e){return t.isValidElement(e)&&"function"==typeof e.type&&"__radixId"in e.type&&e.type.__radixId===i}}}]);