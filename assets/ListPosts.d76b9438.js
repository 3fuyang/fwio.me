import{c as u,r as p,_ as e,a as s,j as g,L as x}from"./index.636dc139.js";function E(r){const a=u();p.exports.useEffect(()=>{const t=[],n=Object.assign({"../../pages/blog/deep-clone-in-js.mdx":()=>e(()=>import("./deep-clone-in-js.a5da6fad.js"),["assets/deep-clone-in-js.a5da6fad.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/blog/empty-object-in-ts.mdx":()=>e(()=>import("./empty-object-in-ts.960b3b9b.js"),["assets/empty-object-in-ts.960b3b9b.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/blog/js-event-loop.mdx":()=>e(()=>import("./js-event-loop.94adb83e.js"),["assets/js-event-loop.94adb83e.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/blog/ssg-in-flog.mdx":()=>e(()=>import("./ssg-in-flog.ea06d6e8.js"),["assets/ssg-in-flog.ea06d6e8.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/blog/tsconfig-notes.mdx":()=>e(()=>import("./tsconfig-notes.180c1502.js"),["assets/tsconfig-notes.180c1502.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/blog/vue-node-mysql-deployment.mdx":()=>e(()=>import("./vue-node-mysql-deployment.f2027414.js"),["assets/vue-node-mysql-deployment.f2027414.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/essay/the-cherry-orchard.mdx":()=>e(()=>import("./the-cherry-orchard.6937878d.js"),["assets/the-cherry-orchard.6937878d.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/index.mdx":()=>e(()=>import("./RenderedRoutes.3096f8b6.js").then(o=>o.i),["assets/RenderedRoutes.3096f8b6.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/notes/js-array-fill.mdx":()=>e(()=>import("./js-array-fill.bbc60572.js"),["assets/js-array-fill.bbc60572.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/notes/js-string-and-regexp.mdx":()=>e(()=>import("./js-string-and-regexp.844d5378.js"),["assets/js-string-and-regexp.844d5378.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/notes/string-to-ascii.mdx":()=>e(()=>import("./string-to-ascii.3eb95364.js"),["assets/string-to-ascii.3eb95364.js","assets/index.636dc139.js","assets/index.7d521447.css"]),"../../pages/notes/this-in-js-prototype-function.mdx":()=>e(()=>import("./this-in-js-prototype-function.23d29e10.js"),["assets/this-in-js-prototype-function.23d29e10.js","assets/index.636dc139.js","assets/index.7d521447.css"])}),d=`../../pages/${a.pathname.split("/")[1]}/`;for(const o in n)o.includes(d)&&t.push(n[o]().then(({title:i,date:_,duration:m,lang:l,path:c})=>({title:i,duration:m,date:_,lang:l,path:c})));Promise.all(t).then(o=>{o.sort((i,_)=>Date.parse(_.date)-Date.parse(i.date)),r(o)})})}function v(){const[r,a]=p.exports.useState([]);return E(a),s("section",{className:"max-w-45em m-auto",children:r.map(t=>s("article",{className:"mt-8",children:g(x,{to:t.path,className:"block box-border rounded-sm op70 dark:op80 hover:op100 focus:op100 ml-4 p-1 hover:drop-shadow focus:drop-shadow",border:"r-4 #878584 hover:blue-4 dark:hover:blue-5 focus:blue-4 dark:focus:blue-5 lt-md:blue-4",flex:"~ col",transition:"~",children:[s("span",{className:"text-3xl font-bold truncate",children:t.title}),s("span",{children:new Date(t.date).toLocaleDateString()})]})},t.title))})}export{v as L};