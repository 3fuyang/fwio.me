if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,l)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const a=e=>i(e,r),u={module:{uri:r},exports:o,require:a};s[r]=Promise.all(n.map((e=>u[e]||a(e)))).then((e=>(l(...e),o)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/client-session-storage.696959a6.js",revision:null},{url:"assets/critical-rendering-path.a6c07c45.js",revision:null},{url:"assets/csrf-and-xss.80c85efe.js",revision:null},{url:"assets/deep-clone-in-js.eedd249a.js",revision:null},{url:"assets/empty-object-in-ts.21c3ea17.js",revision:null},{url:"assets/ErrorBoundary.922dedb9.js",revision:null},{url:"assets/farewell-my-lovely.eda290de.js",revision:null},{url:"assets/FLink.094434b2.js",revision:null},{url:"assets/Footer.1f7e21b0.js",revision:null},{url:"assets/function-length.7c015ea6.js",revision:null},{url:"assets/iconBase.f88ed8d3.js",revision:null},{url:"assets/import-meta-glob-and-auto-routes.352263f5.js",revision:null},{url:"assets/index.139b8234.js",revision:null},{url:"assets/index.45924e5e.js",revision:null},{url:"assets/index.489f702b.js",revision:null},{url:"assets/index.72f9bf68.js",revision:null},{url:"assets/index.80a851b7.js",revision:null},{url:"assets/index.80a851b72.js",revision:"5d6d61c82e83067fcc1a02081cc7d1d8"},{url:"assets/index.b20a34d9.css",revision:null},{url:"assets/index.ea2e2896.js",revision:null},{url:"assets/index.esm.2dd4d3de.js",revision:null},{url:"assets/index.esm.70513c88.js",revision:null},{url:"assets/index.esm.8174677f.js",revision:null},{url:"assets/js-array-fill.1431a4f4.js",revision:null},{url:"assets/js-event-loop.22f9a934.js",revision:null},{url:"assets/js-logical-operator.4374dad9.js",revision:null},{url:"assets/js-string-and-regexp.92e13f88.js",revision:null},{url:"assets/ListPosts.d1196683.js",revision:null},{url:"assets/Loading.88e308f3.js",revision:null},{url:"assets/NavBar.b334cc8b.js",revision:null},{url:"assets/overload-in-ts.8171d84d.js",revision:null},{url:"assets/promise-a-plus.688f638d.js",revision:null},{url:"assets/race-condition-in-vue-and-react.5dc8dbdd.js",revision:null},{url:"assets/regexp-test-undefined.e4faac69.js",revision:null},{url:"assets/RenderedRoutes.63355e94.js",revision:null},{url:"assets/ssg-in-flog.2607935d.js",revision:null},{url:"assets/string-to-ascii.c08add91.js",revision:null},{url:"assets/the-cherry-orchard.c79de8a9.js",revision:null},{url:"assets/this-in-js-prototype-function.f6628a66.js",revision:null},{url:"assets/ToggleTheme.97bedec2.js",revision:null},{url:"assets/ts-non-null-operator.546cb2d6.js",revision:null},{url:"assets/tsconfig-notes.9315b233.js",revision:null},{url:"assets/vue-node-mysql-deployment.614ec577.js",revision:null},{url:"index.html",revision:"3a0cb544ee6d0c5d6cf096a2da58fb32"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"fwio.svg",revision:"1b2b4b9593e79fd162e1387882b0c9c2"},{url:"fwio-apple-touch.png",revision:"19a89ab1cbc3b2f4f86c30fe83ce70ab"},{url:"fwio-192x192.png",revision:"94a41505b3312456e5cd14b38c45eb38"},{url:"fwio-512x512.png",revision:"b7e572316adcac123a6ce8450964c984"},{url:"fwio-maskable-icon-512x512.png",revision:"f3338edfec1f9da05343995762ae6490"},{url:"images/critical-rendering-path/css-mutate-dom.png",revision:"63f3199b2adffc412f983e436e5e5413"},{url:"images/critical-rendering-path/render.png",revision:"f27613c9ef66aa9cd6b376ab3b2d419b"},{url:"images/empty-object-in-ts/anyof.png",revision:"d4f32fa0e66fec617af3e2c84fea929d"},{url:"images/import-meta-glob-and-auto-routes/after.png",revision:"81ffb92d458ac20342ec5fffedb89f6f"},{url:"images/import-meta-glob-and-auto-routes/before.png",revision:"b74ad489dd572b4361041263e68f449f"},{url:"images/import-meta-glob-and-auto-routes/flog-and-ssg.png",revision:"23f65b7a181dbc7b19fbbe9e04627f46"},{url:"images/js-event-loop/mid-execution.png",revision:"3143d579b991b9336b91a734b48703e5"},{url:"images/js-event-loop/warning.png",revision:"51d05eeb7af58cca34628e29a4d46194"},{url:"images/ssg-in-flog/figure-label.png",revision:"be5be43d5026d06756dd19ea46203a45"},{url:"images/ssg-in-flog/rollup-plugin-hooks.png",revision:"48aeb163c2acecbf882609ca17c04115"},{url:"images/ssg-in-flog/vite-universal-plugins.png",revision:"0600fbc5446b6217d39aab32183b2f2a"},{url:"images/ssg-in-flog/vitepress-router.png",revision:"dca74c20861bc29e2ba3f1091ae49441"},{url:"images/string-to-ascii/stackoverflow.png",revision:"743d43dbe6c825b53a9407ccbdc3d2f5"},{url:"images/vue-node-mysql-deployment/1.png",revision:"c2bfcff8c9301c92f861d9e089f72167"},{url:"images/vue-node-mysql-deployment/2.png",revision:"db87fb50dedcab2e79c325626f749dda"},{url:"images/vue-node-mysql-deployment/3.png",revision:"369c70cc78c870034d80d189220522bd"},{url:"images/vue-node-mysql-deployment/4.png",revision:"06bfb712a399187c354015c4203c9d48"},{url:"manifest.webmanifest",revision:"b7e05a02d5087a8dab81fc9013746245"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
