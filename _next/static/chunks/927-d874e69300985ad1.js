(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[927],{16891:(e,t,a)=>{"use strict";a.d(t,{F:()=>o});var r=a(95155),s=a(12115),n=a(89051),l=a(53999);let o=s.forwardRef((e,t)=>{let{className:a,children:s,...o}=e;return(0,r.jsxs)(n.bL,{ref:t,className:(0,l.cn)("relative overflow-hidden",a),...o,children:[(0,r.jsx)(n.LM,{className:"h-full w-full rounded-[inherit]",children:s}),(0,r.jsx)(i,{}),(0,r.jsx)(n.OK,{})]})});o.displayName=n.bL.displayName;let i=s.forwardRef((e,t)=>{let{className:a,orientation:s="vertical",...o}=e;return(0,r.jsx)(n.VM,{ref:t,orientation:s,className:(0,l.cn)("flex touch-none select-none transition-colors","vertical"===s&&"h-full w-2.5 border-l border-l-transparent p-[1px]","horizontal"===s&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",a),...o,children:(0,r.jsx)(n.lr,{className:"relative flex-1 rounded-full bg-border"})})});i.displayName=n.VM.displayName},53999:(e,t,a)=>{"use strict";a.d(t,{cn:()=>n});var r=a(52596),s=a(39688);function n(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,s.QP)((0,r.A)(t))}},54147:(e,t,a)=>{"use strict";a.d(t,{A:()=>i});var r=a(95155),s=a(6874),n=a.n(s),l=a(35695),o=a(53999);function i(e){let{absolute:t,className:a="",activeClassName:s="",disabled:i,children:c,...d}=e,u=(0,l.usePathname)(),f=t?d.href.toString().split("/")[1]==u.split("/")[1]:u===d.href;return(d.href.toString().includes("http")&&(f=!1),i)?(0,r.jsx)("div",{className:(0,o.cn)(a,"cursor-not-allowed"),children:c}):(0,r.jsx)(n(),{className:(0,o.cn)(a,f&&s),...d,children:c})}},62594:(e,t,a)=>{"use strict";function r(e,t){let a=e.toLowerCase().trim().split(/\s+/).filter(e=>e.length>=3);return 0===a.length?[]:(function(e,t){let a=[];for(let r=0;r<e.length;r+=100)a.push(e.slice(r,r+t));return a})(t,100).flatMap(e=>e.map(e=>{let t=e.title||"",r=function(e,t){let a=e.toLowerCase().trim(),r=t.toLowerCase(),s=a.split(/\s+/),n=0;r===a?n+=50:r.includes(a)&&(n+=30),s.forEach((e,t)=>{-1!==r.indexOf(e)&&(n+=20)});for(let e=0;e<s.length-1;e++){let t="".concat(s[e]," ").concat(s[e+1]);r.includes(t)&&(n+=15)}let l=Math.log(r.length+1);return l>0&&(n/=l),Math.max(0,n)}(a.join(" "),t);return{title:e.title||"Untitled",href:"".concat(e.slug),description:e.description||"",relevance:r}}).filter(e=>e.relevance>0).sort((e,t)=>t.relevance-e.relevance))}async function s(e,t,a){let r=await t.searchArticles(e,10,10*a);return{results:r.map(e=>({title:e,href:"?name=".concat(e)})),hasMore:10===r.length}}function n(e,t){let a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=null,s=null,n=null,l=null,o=a=>{t-(a-(l||0))<=0?(r&&(clearTimeout(r),r=null),n&&(cancelAnimationFrame(n),n=null),e(...s),s=null,l=null):n=requestAnimationFrame(o)};return function(){for(var i=arguments.length,c=Array(i),d=0;d<i;d++)c[d]=arguments[d];s=c,l=performance.now();let u=a&&!r;r&&clearTimeout(r),r=setTimeout(()=>{n=requestAnimationFrame(o)},t),u&&e(...c)}}a.d(t,{M_:()=>s,sg:()=>n,v0:()=>r})},67028:(e,t,a)=>{"use strict";a.d(t,{A:()=>A});var r=a(95155),s=a(72706),n=a(12115),l=a(45706),o=a(14549),i=a(53999);let c=l.bL,d=l.l9;l.YJ,l.ZL,l.Pb,l.z6,n.forwardRef((e,t)=>{let{className:a,inset:s,children:n,...c}=e;return(0,r.jsxs)(l.ZP,{ref:t,className:(0,i.cn)("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",s&&"pl-8",a),...c,children:[n,(0,r.jsx)(o.xCi,{className:"ml-auto h-4 w-4"})]})}).displayName=l.ZP.displayName,n.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.G5,{ref:t,className:(0,i.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...s})}).displayName=l.G5.displayName;let u=n.forwardRef((e,t)=>{let{className:a,sideOffset:s=4,...n}=e;return(0,r.jsx)(l.ZL,{children:(0,r.jsx)(l.UC,{ref:t,sideOffset:s,className:(0,i.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...n})})});u.displayName=l.UC.displayName;let f=n.forwardRef((e,t)=>{let{className:a,inset:s,...n}=e;return(0,r.jsx)(l.q7,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",s&&"pl-8",a),...n})});f.displayName=l.q7.displayName,n.forwardRef((e,t)=>{let{className:a,children:s,checked:n,...c}=e;return(0,r.jsxs)(l.H_,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),checked:n,...c,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.VF,{children:(0,r.jsx)(o.sk9,{className:"h-4 w-4"})})}),s]})}).displayName=l.H_.displayName,n.forwardRef((e,t)=>{let{className:a,children:s,...n}=e;return(0,r.jsxs)(l.hN,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),...n,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.VF,{children:(0,r.jsx)(o.c2m,{className:"h-2 w-2 fill-current"})})}),s]})}).displayName=l.hN.displayName,n.forwardRef((e,t)=>{let{className:a,inset:s,...n}=e;return(0,r.jsx)(l.JU,{ref:t,className:(0,i.cn)("px-2 py-1.5 text-sm font-semibold",s&&"pl-8",a),...n})}).displayName=l.JU.displayName,n.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.wv,{ref:t,className:(0,i.cn)("-mx-1 my-1 h-px bg-muted",a),...s})}).displayName=l.wv.displayName;var m=a(79932),p=a(30539),h=a(27744);class x{static async create(){let e={blockstore:new p.x("data/ipfs/blocks"),datastore:new h.Q("data/ipfs/datastore")};return new x(await (0,m.Y)(e))}async getArticle(e,t){return(await this.node.getArticle(e,t)).content}async createArticle(e,t){return await this.node.newArticle(e,t)}async editArticle(e,t){await this.node.editArticle(e,t)}async getArticleVersions(e){return(await this.node.getArticle(e)).versionsInfo}async getArticleList(){return await this.node.getArticleList()}searchArticles(e,t,a){throw Error("Method not supported.")}isSearchOptimized(){return!1}constructor(e){this.node=e}}var g=a(68716);class y{static async create(){return new y(await (0,g.y)())}async getArticle(e,t){return(await this.node.getArticle(e,t)).content}async createArticle(e,t){return await this.node.newArticle(e,t)}async editArticle(e,t){await this.node.editArticle(e,t)}async getArticleVersions(e){return(await this.node.getArticle(e)).versionsInfo}async getArticleList(){return await this.node.getArticleList()}searchArticles(e,t,a){throw Error("Method not supported.")}isSearchOptimized(){return!1}constructor(e){this.node=e}}var w=a(97967),b=a.n(w),v=a(42406),N=a(49509);b().config();class j{static async create(){let e=N.env.NEXT_PUBLIC_EXAMPLE_SERVER_PORT?N.env.NEXT_PUBLIC_EXAMPLE_SERVER_PORT:3001,t="prod"===N.env.NEXT_PUBLIC_RUN_ENV?N.env.NEXT_PUBLIC_EXAMPLE_SERVER_URL:"http://localhost:".concat(e);return new j(await (0,v.S)(t))}async getArticle(e,t){return(await this.node.getArticle(e,t)).content}async createArticle(e,t){return await this.node.newArticle(e,t)}async editArticle(e,t){await this.node.editArticle(e,t)}async getArticleVersions(e){return(await this.node.getArticle(e)).versionsInfo}async getArticleList(){return await this.node.getArticleList()}searchArticles(e,t,a){throw Error("Method not supported.")}isSearchOptimized(){return!1}constructor(e){this.node=e}}function A(){let{setIsESLoading:e,esName:t,setESName:a}=(0,n.useContext)(s.o),{setStorage:l}=(0,n.useContext)(s.h);(0,n.useEffect)(()=>{let e=localStorage.getItem("ecosystem"),a=async()=>{switch(e){case"Example Server":o();break;case"Blockchain":i()}};e!=t&&a()},[]);let o=async()=>{e(!0),a("Loading..."),l(await j.create()),a("Example Server"),localStorage.setItem("ecosystem","Example Server"),e(!1)},i=async()=>{e(!0),a("Loading..."),l(await y.create()),a("Blockchain"),localStorage.setItem("ecosystem","Blockchain"),e(!1)},m=async()=>{e(!0),a("Loading..."),l(await x.create()),a("IPFS"),localStorage.setItem("ecosystem","IPFS"),e(!1)};return(0,r.jsxs)(c,{children:[(0,r.jsx)(d,{className:"button",children:(0,r.jsx)("div",{className:"flex w-full items-center gap-2.5 rounded-sm border px-3 py-2 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900",children:t})}),(0,r.jsxs)(u,{children:[(0,r.jsx)(f,{onClick:o,children:"Example Server"}),(0,r.jsx)(f,{onClick:m,children:"IPFS"}),(0,r.jsx)(f,{onClick:i,children:"Blockchain"})]})]})}},69004:(e,t,a)=>{"use strict";a.d(t,{A:()=>m});var r=a(95155),s=a(12115),n=a(14549),l=a(89852),o=a(99840),i=a(16891),c=a(54147),d=a(62594),u=a(53999),f=a(72706);function m(){let[e,t]=(0,s.useState)(""),[a,m]=(0,s.useState)(!1),[p,h]=(0,s.useState)([]),[x,g]=(0,s.useState)(!1),[y,w]=(0,s.useState)(!1),[b,v]=(0,s.useState)([]),{isESLoading:N}=(0,s.useContext)(f.o),{storage:j}=(0,s.useContext)(f.h);(0,s.useEffect)(()=>{(async()=>{v([]),j&&(w(!0),v((await j.getArticleList()).map(e=>({title:e,href:"?name=".concat(e)}))),w(!1))})()},[j]);let A=(0,s.useMemo)(()=>(0,d.sg)(async e=>{g(!0),h((0,d.v0)(e.trim(),b)),g(!1)},300),[b]);return(0,s.useEffect)(()=>{let e=e=>{if(e.ctrlKey&&"k"===e.key&&!N&&(e.preventDefault(),m(!0)),a&&"Enter"===e.key&&p.length>2){let e=p[0];"href"in e&&(window.location.href="/articles".concat(e.href),m(!1))}};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}},[a,p,N]),(0,s.useEffect)(()=>{(async()=>{e.length>=3?A(e):h([])})()},[e,A]),(0,r.jsx)("div",{children:(0,r.jsxs)(o.lG,{open:a,onOpenChange:e=>{m(e),e||setTimeout(()=>t(""),200)},children:[(0,r.jsx)(o.zM,{asChild:!0,children:(0,r.jsxs)("div",{className:"relative max-w-md flex-1 cursor-pointer",children:[(0,r.jsx)(n.qbB,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"}),(0,r.jsx)(l.p,{className:"h-9 w-full rounded-md border bg-muted pl-10 pr-4 shadow-sm md:w-full",placeholder:"Search articles...",type:"search"}),(0,r.jsxs)("div",{className:"absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium dark:bg-neutral-700 sm:flex",children:[(0,r.jsx)(n.fA1,{className:"h-3 w-3"}),(0,r.jsx)("span",{children:"k"})]})]})}),(0,r.jsxs)(o.Cf,{className:"top-[45%] max-w-[650px] p-0 sm:top-[38%]",children:[(0,r.jsx)(o.L3,{className:"sr-only",children:"Search"}),(0,r.jsx)(o.c7,{children:(0,r.jsx)("input",{value:e,onChange:e=>t(e.target.value),placeholder:"Search documents...",autoFocus:!0,className:"h-14 border-b bg-transparent px-4 text-[15px] outline-none"})}),e.length>0&&e.length<3&&(0,r.jsx)("p",{className:"text-warning mx-auto mt-2 text-sm",children:"Please enter at least 3 characters."}),x&&(0,r.jsx)("p",{className:"mx-auto mt-2 text-sm text-muted-foreground",children:"Searching..."}),y&&(0,r.jsx)("p",{className:"mx-auto mt-2 text-sm text-muted-foreground",children:"Fetching articles..."}),!y&&!x&&0===p.length&&e.length>=3&&(0,r.jsxs)("p",{className:"mx-auto mt-2 text-sm text-muted-foreground",children:["No results found for"," ",(0,r.jsx)("span",{className:"text-primary",children:'"'.concat(e,'"')})]}),(0,r.jsx)(i.F,{className:"max-h-[350px]",children:(0,r.jsx)("div",{className:"flex flex-col items-start overflow-y-auto px-1 pb-4 pt-1 sm:px-3",children:e?p.map(e=>"href"in e?(0,r.jsx)(o.HM,{asChild:!0,children:(0,r.jsx)(c.A,{className:(0,u.cn)("flex w-full flex-col gap-0.5 rounded-sm p-3 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900"),href:"/articles".concat(e.href),children:(0,r.jsxs)("div",{className:"flex h-full w-fit items-center gap-x-2",children:[(0,r.jsx)(n.hVg,{className:"h-[1.1rem] w-[1.1rem]"})," ",e.title]})})},e.href):null):function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"/articles";return e&&Array.isArray(e)?e.flatMap(e=>{if("spacer"in e&&e.spacer)return[];let a="".concat(t).concat(e.href);return[(0,r.jsx)(o.HM,{asChild:!0,children:(0,r.jsx)(c.A,{className:(0,u.cn)("flex w-full items-center gap-2.5 rounded-sm px-3 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900"),href:a,children:(0,r.jsxs)("div",{className:"flex h-full w-fit items-center gap-1.5 whitespace-nowrap py-3",children:[(0,r.jsx)(n.hVg,{className:"h-[1.1rem] w-[1.1rem]"})," ",e.title]})})},a)]}):[]}(b)})})]})]})})}},72016:()=>{},72706:(e,t,a)=>{"use strict";a.d(t,{h:()=>n,o:()=>s});var r=a(12115);let s=(0,r.createContext)({isESLoading:!1,setIsESLoading:()=>{},esName:"",setESName:()=>{}}),n=(0,r.createContext)({storage:null,setStorage:()=>{}})},89852:(e,t,a)=>{"use strict";a.d(t,{p:()=>l});var r=a(95155),s=a(12115),n=a(53999);let l=s.forwardRef((e,t)=>{let{className:a,type:s,...l}=e;return(0,r.jsx)("input",{type:s,className:(0,n.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:t,...l})});l.displayName="Input"},97168:(e,t,a)=>{"use strict";a.d(t,{$:()=>c,r:()=>i});var r=a(95155),s=a(12115),n=a(99708),l=a(74466),o=a(53999);let i=(0,l.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-9 w-9",xs:"h-7 rounded-md px-2"}},defaultVariants:{variant:"default",size:"default"}}),c=s.forwardRef((e,t)=>{let{className:a,variant:s,size:l,asChild:c=!1,...d}=e,u=c?n.DX:"button";return(0,r.jsx)(u,{className:(0,o.cn)(i({variant:s,size:l,className:a})),ref:t,...d})});c.displayName="Button"},99840:(e,t,a)=>{"use strict";a.d(t,{Cf:()=>f,HM:()=>d,L3:()=>p,c7:()=>m,lG:()=>o,zM:()=>i});var r=a(95155),s=a(12115),n=a(15452),l=a(53999);let o=n.bL,i=n.l9,c=n.ZL,d=n.bm,u=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.hJ,{ref:t,className:(0,l.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...s})});u.displayName=n.hJ.displayName;let f=s.forwardRef((e,t)=>{let{className:a,children:s,...o}=e;return(0,r.jsxs)(c,{children:[(0,r.jsx)(u,{}),(0,r.jsxs)(n.UC,{ref:t,className:(0,l.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...o,children:[s,(0,r.jsxs)(n.bm,{className:"absolute right-4 top-3.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,r.jsx)("div",{className:"rounded-sm border px-2 py-1 text-xs hover:bg-muted",children:"Esc"}),(0,r.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});f.displayName=n.UC.displayName;let m=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,l.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...a})};m.displayName="DialogHeader";let p=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.hE,{ref:t,className:(0,l.cn)("text-lg font-semibold leading-none tracking-tight",a),...s})});p.displayName=n.hE.displayName,s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.VY,{ref:t,className:(0,l.cn)("text-sm text-muted-foreground",a),...s})}).displayName=n.VY.displayName}}]);