"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6662],{1834:(e,t,i)=>{i.d(t,{R:()=>r,x:()=>o});var n=i(8318);const s={},c=n.createContext(s);function r(e){const t=n.useContext(c);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),n.createElement(c.Provider,{value:t},e.children)}},7218:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"api/@atomic-testing/core/interfaces/WaitUntilOption","title":"Interface: WaitUntilOption\\\\<T\\\\>","description":"Defined in14","source":"@site/docs/api/@atomic-testing/core/interfaces/WaitUntilOption.md","sourceDirName":"api/@atomic-testing/core/interfaces","slug":"/api/@atomic-testing/core/interfaces/WaitUntilOption","permalink":"/docs/api/@atomic-testing/core/interfaces/WaitUntilOption","draft":false,"unlisted":false,"editUrl":"https://github.com/atomic-testing/atomic-testing/tree/main/docs/docs/docs/api/@atomic-testing/core/interfaces/WaitUntilOption.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"Interface: WaitForOption","permalink":"/docs/api/@atomic-testing/core/interfaces/WaitForOption"},"next":{"title":"collectionUtil","permalink":"/docs/api/@atomic-testing/core/namespaces/collectionUtil/"}}');var s=i(9214),c=i(1834);const r={},o="Interface: WaitUntilOption<T>",a={},l=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"T",id:"t",level:3},{value:"Properties",id:"properties",level:2},{value:"debug?",id:"debug",level:3},{value:"probeFn()",id:"probefn",level:3},{value:"Returns",id:"returns",level:4},{value:"terminateCondition",id:"terminatecondition",level:3},{value:"timeoutMs",id:"timeoutms",level:3}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",strong:"strong",...(0,c.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"interface-waituntiloptiont",children:"Interface: WaitUntilOption<T>"})}),"\n",(0,s.jsxs)(t.p,{children:["Defined in: ",(0,s.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/026286ef91942b125905a5f840ea034c17544e2d/packages/core/src/utils/timingUtil.ts#L14",children:"packages/core/src/utils/timingUtil.ts:14"})]}),"\n",(0,s.jsx)(t.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,s.jsx)(t.h3,{id:"t",children:"T"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"T"})}),"\n",(0,s.jsx)(t.h2,{id:"properties",children:"Properties"}),"\n",(0,s.jsx)(t.h3,{id:"debug",children:"debug?"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"optional"})," ",(0,s.jsx)(t.strong,{children:"debug"}),": ",(0,s.jsx)(t.code,{children:"boolean"})]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Defined in: ",(0,s.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/026286ef91942b125905a5f840ea034c17544e2d/packages/core/src/utils/timingUtil.ts#L30",children:"packages/core/src/utils/timingUtil.ts:30"})]}),"\n",(0,s.jsx)(t.p,{children:"Whether it should log the conditional checks while waiting"}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"probefn",children:"probeFn()"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"probeFn"}),": () => ",(0,s.jsx)(t.code,{children:"T"})," | ",(0,s.jsx)(t.code,{children:"Promise"}),"<",(0,s.jsx)(t.code,{children:"T"}),">"]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Defined in: ",(0,s.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/026286ef91942b125905a5f840ea034c17544e2d/packages/core/src/utils/timingUtil.ts#L18",children:"packages/core/src/utils/timingUtil.ts:18"})]}),"\n",(0,s.jsx)(t.p,{children:"A function that returns a value or promised value to be checked against the terminate condition"}),"\n",(0,s.jsx)(t.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"T"})," | ",(0,s.jsx)(t.code,{children:"Promise"}),"<",(0,s.jsx)(t.code,{children:"T"}),">"]}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"terminatecondition",children:"terminateCondition"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"terminateCondition"}),": ",(0,s.jsx)(t.code,{children:"T"})," | (",(0,s.jsx)(t.code,{children:"currentValue"}),") => ",(0,s.jsx)(t.code,{children:"boolean"})]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Defined in: ",(0,s.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/026286ef91942b125905a5f840ea034c17544e2d/packages/core/src/utils/timingUtil.ts#L22",children:"packages/core/src/utils/timingUtil.ts:22"})]}),"\n",(0,s.jsx)(t.p,{children:"A value to check for equality or a function used for custom equality check"}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h3,{id:"timeoutms",children:"timeoutMs"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"timeoutMs"}),": ",(0,s.jsx)(t.code,{children:"number"})]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Defined in: ",(0,s.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/026286ef91942b125905a5f840ea034c17544e2d/packages/core/src/utils/timingUtil.ts#L26",children:"packages/core/src/utils/timingUtil.ts:26"})]}),"\n",(0,s.jsx)(t.p,{children:"A number of milliseconds to wait before returning the last value"})]})}function h(e={}){const{wrapper:t}={...(0,c.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);