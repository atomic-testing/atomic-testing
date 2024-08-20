"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[62],{660:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>V,contentTitle:()=>k,default:()=>N,frontMatter:()=>D,metadata:()=>A,toc:()=>L});var r=n(6106),a=n(9252),o=n(5646);const i="import { HTMLAnchorDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';\nimport { ButtonDriver, TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';\nimport { ScenePart, byDataTestId } from '@atomic-testing/core';\n\nconst loginScenePart: ScenePart = {\n  username: {\n    locator: byDataTestId('username'),\n    driver: TextFieldDriver,\n  },\n  password: {\n    locator: byDataTestId('password'),\n    driver: TextFieldDriver,\n  },\n  error: {\n    locator: byDataTestId('error-display'),\n    driver: HTMLElementDriver,\n  },\n  submit: {\n    locator: byDataTestId('submit'),\n    driver: ButtonDriver,\n  },\n  forgetPassword: {\n    locator: byDataTestId('forget-password'),\n    driver: HTMLAnchorDriver,\n  },\n} satisfies ScenePart;\n";var s=n(7378),c=n(3372),l=n(935),d=n(505),u=n(3124),p=n(680),h=n(8089),m=n(6991);function g(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function f(e){const{values:t,children:n}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return g(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}(n);return function(e){const t=(0,h.XI)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function b(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function v(e){let{queryString:t=!1,groupId:n}=e;const r=(0,d.W6)(),a=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,p.aZ)(a),(0,s.useCallback)((e=>{if(!a)return;const t=new URLSearchParams(r.location.search);t.set(a,e),r.replace({...r.location,search:t.toString()})}),[a,r])]}function x(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,a=f(e),[o,i]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!b({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:a}))),[c,l]=v({queryString:n,groupId:r}),[d,p]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,a]=(0,m.Dv)(n);return[r,(0,s.useCallback)((e=>{n&&a.set(e)}),[n,a])]}({groupId:r}),h=(()=>{const e=c??d;return b({value:e,tabValues:a})?e:null})();(0,u.A)((()=>{h&&i(h)}),[h]);return{selectedValue:o,selectValue:(0,s.useCallback)((e=>{if(!b({value:e,tabValues:a}))throw new Error(`Can't select invalid tab value=${e}`);i(e),l(e),p(e)}),[l,p,a]),tabValues:a}}var y=n(528);const j={tabList:"tabList_Oefr",tabItem:"tabItem_uxWX"};function w(e){let{className:t,block:n,selectedValue:a,selectValue:o,tabValues:i}=e;const s=[],{blockElementScrollPositionUntilNextRender:d}=(0,l.a_)(),u=e=>{const t=e.currentTarget,n=s.indexOf(t),r=i[n].value;r!==a&&(d(t),o(r))},p=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const n=s.indexOf(e.currentTarget)+1;t=s[n]??s[0];break}case"ArrowLeft":{const n=s.indexOf(e.currentTarget)-1;t=s[n]??s[s.length-1];break}}t?.focus()};return(0,r.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,c.A)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:o}=e;return(0,r.jsx)("li",{role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,ref:e=>s.push(e),onKeyDown:p,onClick:u,...o,className:(0,c.A)("tabs__item",j.tabItem,o?.className,{"tabs__item--active":a===t}),children:n??t},t)}))})}function T(e){let{lazy:t,children:n,selectedValue:a}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===a));return e?(0,s.cloneElement)(e,{className:(0,c.A)("margin-top--md",e.props.className)}):null}return(0,r.jsx)("div",{className:"margin-top--md",children:o.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function E(e){const t=x(e);return(0,r.jsxs)("div",{className:(0,c.A)("tabs-container",j.tabList),children:[(0,r.jsx)(w,{...t,...e}),(0,r.jsx)(T,{...t,...e})]})}function I(e){const t=(0,y.A)();return(0,r.jsx)(E,{...e,children:g(e.children)},String(t))}const S={tabItem:"tabItem_AruD"};function P(e){let{children:t,hidden:n,className:a}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,c.A)(S.tabItem,a),hidden:n,children:t})}const D={id:"concepts",sidebar_position:2},k="Core Concepts",A={id:"concepts",title:"Core Concepts",description:"Before using Atomic Testing, familiarize yourself with the following key concepts:",source:"@site/docs/core-concepts.mdx",sourceDirName:".",slug:"/concepts",permalink:"/docs/concepts",draft:!1,unlisted:!1,editUrl:"https://github.com/atomic-testing/atomic-testing/tree/main/docs/docs/docs/core-concepts.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"concepts",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/docs/intro"},next:{title:"Example",permalink:"/docs/example"}},V={},L=[{value:"Component Driver",id:"component-driver",level:2},{value:"Locator",id:"locator",level:2},{value:"ScenePart",id:"scenepart",level:2},{value:"Test Engine",id:"test-engine",level:2}];function C(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components},{Details:n}=t;return n||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"core-concepts",children:"Core Concepts"})}),"\n",(0,r.jsx)(t.p,{children:"Before using Atomic Testing, familiarize yourself with the following key concepts:"}),"\n",(0,r.jsx)(t.h2,{id:"component-driver",children:"Component Driver"}),"\n",(0,r.jsx)(t.p,{children:"At the heart of Atomic Testing are component drivers. They define how to programmatically interact with UI components, such as clicking a button, selecting a value from a dropdown, or reading a row from a grid."}),"\n",(0,r.jsxs)(t.p,{children:["A growing number of component drivers are available for popular UI frameworks like ",(0,r.jsx)(t.a,{href:"https://mui.com",children:"Material UI"}),". Each component driver offers a set of methods for interacting with the component. When using TypeScript for writing tests, auto-completion can help discover available methods."]}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["Refer to the ",(0,r.jsx)(t.a,{href:"/docs/api-overview#component-drivers",children:"API Reference"})," for a list of available component drivers."]})}),"\n",(0,r.jsx)(t.h2,{id:"locator",children:"Locator"}),"\n",(0,r.jsxs)(t.p,{children:["Locators help find components on a page, using various ",(0,r.jsx)(t.a,{href:"/docs/api-overview#locator",children:"locator strategies"})," such as ",(0,r.jsx)(t.code,{children:"byDataTestId"})," and ",(0,r.jsx)(t.code,{children:"byRole"}),"."]}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsxs)(t.p,{children:["The use of the data-testid attribute is recommended for locating components on a page. Refer to ",(0,r.jsx)(t.a,{href:"/docs/best-practices#data-testid",children:"Best Practices"})," for more details. Use the ",(0,r.jsx)(t.code,{children:"byDataTestId(value)"})," API as the recommended approach for building locators."]})}),"\n",(0,r.jsx)(t.h2,{id:"scenepart",children:"ScenePart"}),"\n",(0,r.jsx)(t.p,{children:"A ScenePart is a map describing all components of interest (part) within a scene (a page or a rich UI component). Each entry in a ScenePart outlines the part name, the component locator, and the component driver."}),"\n",(0,r.jsxs)(n,{children:[(0,r.jsx)("summary",{children:"A sample ScenePart of a typical login screen"}),(0,r.jsx)(o.A,{language:"ts",children:i})]}),"\n",(0,r.jsx)(t.h2,{id:"test-engine",children:"Test Engine"}),"\n",(0,r.jsx)(t.p,{children:"The Test Engine is where all the pieces come together. It is responsible for rendering a scene, locating all the components in the scene, and providing a set of methods to interact with the components."}),"\n",(0,r.jsxs)(t.p,{children:["Use ",(0,r.jsx)(t.code,{children:"createTestEngine"})," to create a Test Engine instance. The ",(0,r.jsx)(t.code,{children:"createTestEngine"})," function is specific to each rendering framework, such as React, Cypress, and Playwright."]}),"\n",(0,r.jsx)(t.p,{children:"The examples below demonstrate how to create a Test Engine for the loginScenePart described earlier."}),"\n","\n",(0,r.jsxs)(I,{children:[(0,r.jsx)(P,{value:"react",label:"React 18+",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { createTestEngine } from '@atomic-testing/react';\nimport { loginScenePart } from './loginScenePart';\nimport { Login } from './components/Login';\n\nconst testEngine = createTestEngine(<Login />, loginScenePart);\n"})})}),(0,r.jsx)(P,{value:"react-legacy",label:"React 17",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { createLegacyTestEngine } from '@atomic-testing/react/dist/createLegacyTestEngine';\nimport { loginScenePart } from './loginScenePart';\nimport { Login } from './components/Login';\n\nconst testEngine = createLegacyTestEngine(<Login />, loginScenePart);\n"})})}),(0,r.jsx)(P,{value:"playwright",label:"Playwright",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { createTestEngine } from '@atomic-testing/playwright';\nimport { loginScenePart } from './loginScenePart';\n\nawait page.goto('/login');\nconst testEngine = createTestEngine(page, loginScenePart);\n"})})}),(0,r.jsx)(P,{value:"cypress",label:"Cypress",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { createTestEngine } from '@atomic-testing/cypress';\nimport { loginScenePart } from './loginScenePart';\n\ncy.visit('/login');\nconst testEngine = createTestEngine(loginScenePart);\n"})})})]}),"\n",(0,r.jsx)(t.p,{children:"Once the test engine is created, it can be used to interact with the components in the scene."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"// Test code is agnostic to the rendering framework\n\nawait testEngine.parts.username.setValue('john@example.com');\nawait testEngine.parts.password.setValue('');\nawait testEngine.parts.submit.click();\n\nconst error = await testEngine.parts.error.getText();\nexpect(error).toEqual('Password is required'); // Jest assertion, but any assertion library can be used\n"})})]})}function N(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(C,{...e})}):C(e)}}}]);