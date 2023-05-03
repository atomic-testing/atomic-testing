"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[817],{8305:(e,t,n)=>{n.d(t,{Z:()=>E});var a=n(5675),r=n(9231),i=n(9841),s=n(718),l=n(7355),c=n(5946),o=n(2775),m=n(6677),d=n(8362);function u(e){return r.createElement("svg",(0,a.Z)({viewBox:"0 0 24 24"},e),r.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const b={breadcrumbHomeIcon:"breadcrumbHomeIcon_qNPC"};function h(){const e=(0,d.Z)("/");return r.createElement("li",{className:"breadcrumbs__item"},r.createElement(o.Z,{"aria-label":(0,m.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:"breadcrumbs__link",href:e},r.createElement(u,{className:b.breadcrumbHomeIcon})))}const p={breadcrumbsContainer:"breadcrumbsContainer_H3bb"};function v(e){let{children:t,href:n,isLast:a}=e;const i="breadcrumbs__link";return a?r.createElement("span",{className:i,itemProp:"name"},t):n?r.createElement(o.Z,{className:i,href:n,itemProp:"item"},r.createElement("span",{itemProp:"name"},t)):r.createElement("span",{className:i},t)}function g(e){let{children:t,active:n,index:s,addMicrodata:l}=e;return r.createElement("li",(0,a.Z)({},l&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,i.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,r.createElement("meta",{itemProp:"position",content:String(s+1)}))}function E(){const e=(0,l.s1)(),t=(0,c.Ns)();return e?r.createElement("nav",{className:(0,i.Z)(s.k.docs.docBreadcrumbs,p.breadcrumbsContainer),"aria-label":(0,m.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},r.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&r.createElement(h,null),e.map(((t,n)=>{const a=n===e.length-1,i="category"===t.type&&t.linkUnlisted?void 0:t.href;return r.createElement(g,{key:n,active:a,index:n,addMicrodata:!!i},r.createElement(v,{href:i,isLast:a},t.label))})))):null}},9423:(e,t,n)=>{n.r(t),n.d(t,{default:()=>y});var a=n(9231),r=n(3773),i=n(7355),s=n(8362),l=n(9841),c=n(2775),o=n(6022),m=n(6677),d=n(845);const u={cardContainer:"cardContainer_W5oL",cardTitle:"cardTitle_ICxv",cardDescription:"cardDescription_s7Yz"};function b(e){let{href:t,children:n}=e;return a.createElement(c.Z,{href:t,className:(0,l.Z)("card padding--lg",u.cardContainer)},n)}function h(e){let{href:t,icon:n,title:r,description:i}=e;return a.createElement(b,{href:t},a.createElement(d.Z,{as:"h2",className:(0,l.Z)("text--truncate",u.cardTitle),title:r},n," ",r),i&&a.createElement("p",{className:(0,l.Z)("text--truncate",u.cardDescription),title:i},i))}function p(e){let{item:t}=e;const n=(0,i.LM)(t);return n?a.createElement(h,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,m.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function v(e){let{item:t}=e;const n=(0,o.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",r=(0,i.xz)(t.docId??void 0);return a.createElement(h,{href:t.href,icon:n,title:t.label,description:t.description??r?.description})}function g(e){let{item:t}=e;switch(t.type){case"link":return a.createElement(v,{item:t});case"category":return a.createElement(p,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function E(e){let{className:t}=e;const n=(0,i.jA)();return a.createElement(f,{items:n.items,className:t})}function f(e){const{items:t,className:n}=e;if(!t)return a.createElement(E,e);const r=(0,i.MN)(t);return a.createElement("section",{className:(0,l.Z)("row",n)},r.map(((e,t)=>a.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},a.createElement(g,{item:e})))))}var N=n(3368),Z=n(3784),L=n(3029),_=n(8305);const k={generatedIndexPage:"generatedIndexPage_uVG_",list:"list_sF4Q",title:"title_jtTE"};function T(e){let{categoryGeneratedIndex:t}=e;return a.createElement(r.d,{title:t.title,description:t.description,keywords:t.keywords,image:(0,s.Z)(t.image)})}function x(e){let{categoryGeneratedIndex:t}=e;const n=(0,i.jA)();return a.createElement("div",{className:k.generatedIndexPage},a.createElement(Z.Z,null),a.createElement(_.Z,null),a.createElement(L.Z,null),a.createElement("header",null,a.createElement(d.Z,{as:"h1",className:k.title},t.title),t.description&&a.createElement("p",null,t.description)),a.createElement("article",{className:"margin-top--lg"},a.createElement(f,{items:n.items,className:k.list})),a.createElement("footer",{className:"margin-top--lg"},a.createElement(N.Z,{previous:t.navigation.previous,next:t.navigation.next})))}function y(e){return a.createElement(a.Fragment,null,a.createElement(T,e),a.createElement(x,e))}},3368:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(5675),r=n(9231),i=n(6677),s=n(9841),l=n(2775);function c(e){const{permalink:t,title:n,subLabel:a,isNext:i}=e;return r.createElement(l.Z,{className:(0,s.Z)("pagination-nav__link",i?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},a&&r.createElement("div",{className:"pagination-nav__sublabel"},a),r.createElement("div",{className:"pagination-nav__label"},n))}function o(e){const{previous:t,next:n}=e;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,i.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages",description:"The ARIA label for the docs pagination"})},t&&r.createElement(c,(0,a.Z)({},t,{subLabel:r.createElement(i.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&r.createElement(c,(0,a.Z)({},n,{subLabel:r.createElement(i.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}},3029:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(9231),r=n(9841),i=n(6677),s=n(718),l=n(7832);function c(e){let{className:t}=e;const n=(0,l.E)();return n.badge?a.createElement("span",{className:(0,r.Z)(t,s.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(i.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}},3784:(e,t,n)=>{n.d(t,{Z:()=>v});var a=n(9231),r=n(9841),i=n(9432),s=n(2775),l=n(6677),c=n(6226),o=n(718),m=n(8054),d=n(7832);const u={unreleased:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(l.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(l.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function b(e){const t=u[e.versionMetadata.banner];return a.createElement(t,e)}function h(e){let{versionLabel:t,to:n,onClick:r}=e;return a.createElement(l.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(s.Z,{to:n,onClick:r},a.createElement(l.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function p(e){let{className:t,versionMetadata:n}=e;const{siteConfig:{title:s}}=(0,i.Z)(),{pluginId:l}=(0,c.gA)({failfast:!0}),{savePreferredVersionName:d}=(0,m.J)(l),{latestDocSuggestion:u,latestVersionSuggestion:p}=(0,c.Jo)(l),v=u??(g=p).docs.find((e=>e.id===g.mainDocId));var g;return a.createElement("div",{className:(0,r.Z)(t,o.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(b,{siteTitle:s,versionMetadata:n})),a.createElement("div",{className:"margin-top--md"},a.createElement(h,{versionLabel:p.label,to:v.path,onClick:()=>d(p.name)})))}function v(e){let{className:t}=e;const n=(0,d.E)();return n.banner?a.createElement(p,{className:t,versionMetadata:n}):null}}}]);