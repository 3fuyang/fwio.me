import{G as r}from"./iconBase.40c590f6.js";import{d as t}from"./index.esm.b915e587.js";import{e as o,F as s,d as l}from"./index.esm.dc904d5f.js";import{a as e,j as i}from"./index.856eb6dd.js";function n(a){return r({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"}}]})(a)}const c=[{logo:n,title:"TJ Flea",src:"https://github.com/3fuyang/flea-market",intro:"A classic online flea market for TJSSE software enginnering course.",type:"vue"},{logo:t,title:"Flog",src:"https://github.com/3fuyang/3fuyang.github.io",intro:"Means Fwio's blog.",type:"react"},{logo:o,title:"Libre Testing",src:"https://github.com/3fuyang/libre-testing",intro:"An automatic testing platform for TJSSE software testing course.",type:"vue"}];function u(){return e("section",{className:"m-auto max-w-45em md:justify-between md:flex md:flex-wrap",children:c.map(a=>e("article",{className:"relative dark:shadow-gray-5 box-border rounded-md p3 md:w-20/41 h-50 op80 mb4",hover:"op100 shadow-md",active:"op100 shadow-md",transition:"~",border:"~ gray-4",children:i("a",{href:a.src,target:"_blank",rel:"noreferrer",children:[e("header",{"aria-hidden":"true",className:"absolute bottom-1 right-1",children:a.type==="react"?e(s,{className:"w-6 ha color-cyan-5 dark:color-cyan-4"}):e(l,{className:"w-6 ha color-green-7 dark:color-emerald-5"})}),e(a.logo,{"aria-hidden":"true",className:"w-10 ha color-gray-6 dark:color-gray-3"}),e("h2",{className:"font-bold text-xl truncate",children:a.title}),e("main",{className:"overflow-auto box-border h-28",children:a.intro})]})},a.title))})}export{u as default};