"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6746],{4905:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>d,default:()=>a,frontMatter:()=>r,metadata:()=>i,toc:()=>o});const i=JSON.parse('{"id":"api/namespaces/atomic_testing_core.listHelper","title":"Namespace: listHelper","description":"@atomic-testing/core.listHelper","source":"@site/docs/api/namespaces/atomic_testing_core.listHelper.md","sourceDirName":"api/namespaces","slug":"/api/namespaces/atomic_testing_core.listHelper","permalink":"/docs/api/namespaces/atomic_testing_core.listHelper","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"current","frontMatter":{"id":"atomic_testing_core.listHelper","title":"Namespace: listHelper","sidebar_label":"listHelper","custom_edit_url":null},"sidebar":"tutorialSidebar","previous":{"title":"escapeUtil","permalink":"/docs/api/namespaces/atomic_testing_core.escapeUtil"},"next":{"title":"locatorUtil","permalink":"/docs/api/namespaces/atomic_testing_core.locatorUtil"}}');var l=s(9214),n=s(7705);const r={id:"atomic_testing_core.listHelper",title:"Namespace: listHelper",sidebar_label:"listHelper",custom_edit_url:null},d=void 0,c={},o=[{value:"Functions",id:"functions",level:2},{value:"getListItemByIndex",id:"getlistitembyindex",level:3},{value:"Type parameters",id:"type-parameters",level:4},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"getListItemIterator",id:"getlistitemiterator",level:3},{value:"Type parameters",id:"type-parameters-1",level:4},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Defined in",id:"defined-in-1",level:4}];function h(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",hr:"hr",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.a,{href:"/docs/api/modules/atomic_testing_core",children:"@atomic-testing/core"}),".listHelper"]}),"\n",(0,l.jsx)(t.h2,{id:"functions",children:"Functions"}),"\n",(0,l.jsx)(t.h3,{id:"getlistitembyindex",children:"getListItemByIndex"}),"\n",(0,l.jsxs)(t.p,{children:["\u25b8 ",(0,l.jsx)(t.strong,{children:"getListItemByIndex"}),"<",(0,l.jsx)(t.code,{children:"T"}),">(",(0,l.jsx)(t.code,{children:"host"}),", ",(0,l.jsx)(t.code,{children:"itemLocatorBase"}),", ",(0,l.jsx)(t.code,{children:"index"}),", ",(0,l.jsx)(t.code,{children:"driverClass"}),"): ",(0,l.jsx)(t.code,{children:"Promise"}),"<",(0,l.jsx)(t.code,{children:"T"})," | ",(0,l.jsx)(t.code,{children:"null"}),">"]}),"\n",(0,l.jsx)(t.p,{children:"Get list item driver within host by index.  List item is an indefinite number of items under the same host\nwith similar characteristics defined by the itemLocatorBase."}),"\n",(0,l.jsx)(t.h4,{id:"type-parameters",children:"Type parameters"}),"\n",(0,l.jsxs)(t.table,{children:[(0,l.jsx)(t.thead,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,l.jsx)(t.tbody,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"T"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:["extends ",(0,l.jsx)(t.a,{href:"/docs/api/classes/atomic_testing_core.ComponentDriver",children:(0,l.jsx)(t.code,{children:"ComponentDriver"})}),"<",">"]})]})})]}),"\n",(0,l.jsx)(t.h4,{id:"parameters",children:"Parameters"}),"\n",(0,l.jsxs)(t.table,{children:[(0,l.jsx)(t.thead,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,l.jsxs)(t.tbody,{children:[(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"host"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,l.jsx)(t.a,{href:"/docs/api/classes/atomic_testing_core.ComponentDriver",children:(0,l.jsx)(t.code,{children:"ComponentDriver"})}),"<",(0,l.jsx)(t.code,{children:"any"}),">"]}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The component the list item is under"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"itemLocatorBase"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.a,{href:"/docs/api/modules/atomic_testing_core#partlocator",children:(0,l.jsx)(t.code,{children:"PartLocator"})})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The locator of the list item without the index, the locator should already compound the host locator if needed"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"index"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"number"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The index of the list item"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"driverClass"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,l.jsx)(t.code,{children:"ComponentDriverClass"}),"<",(0,l.jsx)(t.code,{children:"T"}),">"]}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The driver class of the list item"})]})]})]}),"\n",(0,l.jsx)(t.h4,{id:"returns",children:"Returns"}),"\n",(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.code,{children:"Promise"}),"<",(0,l.jsx)(t.code,{children:"T"})," | ",(0,l.jsx)(t.code,{children:"null"}),">"]}),"\n",(0,l.jsx)(t.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,l.jsx)(t.p,{children:(0,l.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/495658714e956033ae0d7ca46b34508674b2dd3a/packages/core/src/drivers/listHelper.ts#L15",children:"packages/core/src/drivers/listHelper.ts:15"})}),"\n",(0,l.jsx)(t.hr,{}),"\n",(0,l.jsx)(t.h3,{id:"getlistitemiterator",children:"getListItemIterator"}),"\n",(0,l.jsxs)(t.p,{children:["\u25b8 ",(0,l.jsx)(t.strong,{children:"getListItemIterator"}),"<",(0,l.jsx)(t.code,{children:"T"}),">(",(0,l.jsx)(t.code,{children:"host"}),", ",(0,l.jsx)(t.code,{children:"itemLocatorBase"}),", ",(0,l.jsx)(t.code,{children:"driverClass"}),", ",(0,l.jsx)(t.code,{children:"startIndex?"}),"): ",(0,l.jsx)(t.code,{children:"AsyncGenerator"}),"<",(0,l.jsx)(t.code,{children:"T"}),", ",(0,l.jsx)(t.code,{children:"void"}),", ",(0,l.jsx)(t.code,{children:"unknown"}),">"]}),"\n",(0,l.jsx)(t.p,{children:"Get an iterator of list item driver.\nList item is an indefinite number of items under the same host"}),"\n",(0,l.jsx)(t.h4,{id:"type-parameters-1",children:"Type parameters"}),"\n",(0,l.jsxs)(t.table,{children:[(0,l.jsx)(t.thead,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,l.jsx)(t.tbody,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"T"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:["extends ",(0,l.jsx)(t.a,{href:"/docs/api/classes/atomic_testing_core.ComponentDriver",children:(0,l.jsx)(t.code,{children:"ComponentDriver"})}),"<",(0,l.jsx)(t.code,{children:"any"}),">"]})]})})]}),"\n",(0,l.jsx)(t.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,l.jsxs)(t.table,{children:[(0,l.jsx)(t.thead,{children:(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Default value"}),(0,l.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,l.jsxs)(t.tbody,{children:[(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"host"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,l.jsx)(t.a,{href:"/docs/api/classes/atomic_testing_core.ComponentDriver",children:(0,l.jsx)(t.code,{children:"ComponentDriver"})}),"<",(0,l.jsx)(t.code,{children:"any"}),">"]}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"undefined"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The component the list item is under"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"itemLocatorBase"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.a,{href:"/docs/api/modules/atomic_testing_core#partlocator",children:(0,l.jsx)(t.code,{children:"PartLocator"})})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"undefined"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The locator of the list item without the index, the locator should already compound the host locator if needed"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"driverClass"})}),(0,l.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,l.jsx)(t.code,{children:"ComponentDriverClass"}),"<",(0,l.jsx)(t.code,{children:"T"}),">"]}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"undefined"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The driver class of the list item"})]}),(0,l.jsxs)(t.tr,{children:[(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"startIndex"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"number"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:(0,l.jsx)(t.code,{children:"0"})}),(0,l.jsx)(t.td,{style:{textAlign:"left"},children:"The starting index of the list item iterator, default is 0"})]})]})]}),"\n",(0,l.jsx)(t.h4,{id:"returns-1",children:"Returns"}),"\n",(0,l.jsxs)(t.p,{children:[(0,l.jsx)(t.code,{children:"AsyncGenerator"}),"<",(0,l.jsx)(t.code,{children:"T"}),", ",(0,l.jsx)(t.code,{children:"void"}),", ",(0,l.jsx)(t.code,{children:"unknown"}),">"]}),"\n",(0,l.jsx)(t.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,l.jsx)(t.p,{children:(0,l.jsx)(t.a,{href:"https://github.com/atomic-testing/atomic-testing/blob/495658714e956033ae0d7ca46b34508674b2dd3a/packages/core/src/drivers/listHelper.ts#L38",children:"packages/core/src/drivers/listHelper.ts:38"})})]})}function a(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,l.jsx)(t,{...e,children:(0,l.jsx)(h,{...e})}):h(e)}},7705:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>d});var i=s(8318);const l={},n=i.createContext(l);function r(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:r(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);