if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const a=s=>i(s,r),u={module:{uri:r},exports:o,require:a};e[r]=Promise.all(n.map((s=>u[s]||a(s)))).then((s=>(l(...s),o)))}}define(["./workbox-3ea082d2"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/client-session-storage.5135ceed.js",revision:null},{url:"assets/critical-rendering-path.6c66db14.js",revision:null},{url:"assets/csrf-and-xss.f38b17f9.js",revision:null},{url:"assets/deep-clone-in-js.1ff1544d.js",revision:null},{url:"assets/empty-object-in-ts.996b939a.js",revision:null},{url:"assets/ErrorBoundary.3fe44cf2.js",revision:null},{url:"assets/FLink.b5e1fb30.js",revision:null},{url:"assets/Footer.c2280d24.js",revision:null},{url:"assets/iconBase.109ed6b8.js",revision:null},{url:"assets/index.37f8a772.js",revision:null},{url:"assets/index.5ab13b01.js",revision:null},{url:"assets/index.5ab13b012.js",revision:"503b09bb9d8473e09d7fb0c801a46afe"},{url:"assets/index.5c25caaf.js",revision:null},{url:"assets/index.6d519b32.js",revision:null},{url:"assets/index.8405d52c.js",revision:null},{url:"assets/index.9f99ce30.css",revision:null},{url:"assets/index.esm.4ad3d935.js",revision:null},{url:"assets/index.esm.7ab7e9e1.js",revision:null},{url:"assets/index.esm.81309b7a.js",revision:null},{url:"assets/js-array-fill.02e54da6.js",revision:null},{url:"assets/js-event-loop.0adbc893.js",revision:null},{url:"assets/js-logical-operator.889d7cb9.js",revision:null},{url:"assets/js-string-and-regexp.8d7def16.js",revision:null},{url:"assets/ListPosts.397bfda7.js",revision:null},{url:"assets/Loading.c26060dc.js",revision:null},{url:"assets/NavBar.0bf35964.js",revision:null},{url:"assets/overload-in-ts.cbd9aa12.js",revision:null},{url:"assets/promise-a-plus.72d0e4cb.js",revision:null},{url:"assets/regexp-test-undefined.9ab1ac90.js",revision:null},{url:"assets/RenderedRoutes.94466411.js",revision:null},{url:"assets/ssg-in-flog.8c44deef.js",revision:null},{url:"assets/string-to-ascii.b313ff8a.js",revision:null},{url:"assets/the-cherry-orchard.2c808402.js",revision:null},{url:"assets/this-in-js-prototype-function.8516babe.js",revision:null},{url:"assets/ToggleTheme.05fb1286.js",revision:null},{url:"assets/ts-non-null-operator.fc343a61.js",revision:null},{url:"assets/tsconfig-notes.3f8dacb1.js",revision:null},{url:"assets/vue-node-mysql-deployment.6d242f76.js",revision:null},{url:"index.html",revision:"eb1626bf107ebbefbbef8b2ddf2140c2"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"fwio.svg",revision:"1b2b4b9593e79fd162e1387882b0c9c2"},{url:"fwio-apple-touch.png",revision:"19a89ab1cbc3b2f4f86c30fe83ce70ab"},{url:"fwio-192x192.png",revision:"94a41505b3312456e5cd14b38c45eb38"},{url:"fwio-512x512.png",revision:"b7e572316adcac123a6ce8450964c984"},{url:"fwio-maskable-icon-512x512.png",revision:"f3338edfec1f9da05343995762ae6490"},{url:"images/critical-rendering-path/css-mutate-dom.png",revision:"63f3199b2adffc412f983e436e5e5413"},{url:"images/critical-rendering-path/render.png",revision:"f27613c9ef66aa9cd6b376ab3b2d419b"},{url:"images/empty-object-in-ts/anyof.png",revision:"d4f32fa0e66fec617af3e2c84fea929d"},{url:"images/js-event-loop/mid-execution.png",revision:"3143d579b991b9336b91a734b48703e5"},{url:"images/js-event-loop/warning.png",revision:"51d05eeb7af58cca34628e29a4d46194"},{url:"images/ssg-in-flog/figure-label.png",revision:"be5be43d5026d06756dd19ea46203a45"},{url:"images/ssg-in-flog/rollup-plugin-hooks.png",revision:"48aeb163c2acecbf882609ca17c04115"},{url:"images/ssg-in-flog/vite-universal-plugins.png",revision:"0600fbc5446b6217d39aab32183b2f2a"},{url:"images/ssg-in-flog/vitepress-router.png",revision:"dca74c20861bc29e2ba3f1091ae49441"},{url:"images/string-to-ascii/stackoverflow.png",revision:"743d43dbe6c825b53a9407ccbdc3d2f5"},{url:"images/vue-node-mysql-deployment/1.png",revision:"c2bfcff8c9301c92f861d9e089f72167"},{url:"images/vue-node-mysql-deployment/2.png",revision:"db87fb50dedcab2e79c325626f749dda"},{url:"images/vue-node-mysql-deployment/3.png",revision:"369c70cc78c870034d80d189220522bd"},{url:"images/vue-node-mysql-deployment/4.png",revision:"06bfb712a399187c354015c4203c9d48"},{url:"manifest.webmanifest",revision:"b7e05a02d5087a8dab81fc9013746245"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
