import{j as s}from"./jsx-runtime-f0839969.js";const t="JS 中的 Array.fill()",o="2min",c="Array.fill() 对于设置了 length、未设置元素的数组的作用。",i="zh",x="2022-08-31T21:26:00.000+08:00",p="/notes/js-array-fill",r=function({children:e}){return s.exports.jsx("article",{className:"prose",children:e})};function l(n){const e=Object.assign({nav:"nav",ol:"ol",li:"li",a:"a",h1:"h1",p:"p",code:"code",strong:"strong",pre:"pre",span:"span"},n.components);return s.exports.jsxs(s.exports.Fragment,{children:[s.exports.jsx(e.nav,{className:"toc",children:s.exports.jsx(e.ol,{className:"toc-level toc-level-1",children:s.exports.jsx(e.li,{className:"toc-item toc-item-h1",children:s.exports.jsx(e.a,{className:"toc-link toc-link-h1",href:"#js-中的-arrayfill",children:"JS 中的 Array.fill()"})})})}),`
`,s.exports.jsx(e.h1,{id:"js-中的-arrayfill",children:"JS 中的 Array.fill()"}),`
`,s.exports.jsxs(e.p,{children:["用于填充数组的",s.exports.jsx(e.code,{children:"Array.prototype.fill()"}),"是一个",s.exports.jsx(e.strong,{children:"就地(in-place)方法"}),"，会改变原来的数组，但它同时又返回原数组的",s.exports.jsx(e.strong,{children:"引用"}),`,
这容易导致用户`,s.exports.jsx(e.strong,{children:"误以为"}),"它是一个",s.exports.jsx(e.strong,{children:"纯函数"}),"。"]}),`
`,s.exports.jsx(e.pre,{children:s.exports.jsxs(e.code,{className:"hljs language-ts",children:[s.exports.jsx(e.span,{className:"hljs-comment",children:"// [undefined, undefined, undefined]"}),`
`,s.exports.jsx(e.span,{className:"hljs-keyword",children:"const"})," arr1 = ",s.exports.jsx(e.span,{className:"hljs-keyword",children:"new"})," ",s.exports.jsx(e.span,{className:"hljs-title class_",children:"Array"}),"(",s.exports.jsx(e.span,{className:"hljs-number",children:"3"}),`)

`,s.exports.jsx(e.span,{className:"hljs-comment",children:"// [0, 0, 0]"}),`
`,s.exports.jsx(e.span,{className:"hljs-keyword",children:"const"})," arr2 = arr1.",s.exports.jsx(e.span,{className:"hljs-title function_",children:"fill"}),"(",s.exports.jsx(e.span,{className:"hljs-number",children:"0"}),`)

`,s.exports.jsx(e.span,{className:"hljs-comment",children:"// [0, 0, 1]"}),`
arr2[`,s.exports.jsx(e.span,{className:"hljs-number",children:"2"}),"] = ",s.exports.jsx(e.span,{className:"hljs-number",children:"1"}),`

`,s.exports.jsx(e.span,{className:"hljs-comment",children:"// [0, 0, 1]"}),`
`,s.exports.jsx(e.span,{className:"hljs-variable language_",children:"console"}),".",s.exports.jsx(e.span,{className:"hljs-title function_",children:"log"}),`(arr1)
`]})})]})}function h(n={}){return s.exports.jsx(r,Object.assign({},n,{children:s.exports.jsx(l,n)}))}export{x as date,h as default,c as description,o as duration,i as lang,p as path,t as title};
