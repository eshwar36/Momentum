import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {createHash} from 'node:crypto'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),{
    name:'momentum-offline',
    generateBundle(_,bundle){
      const files=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/favicon.svg',...Object.keys(bundle).filter(f=>f!=='index.html').map(f=>'/'+f)]
      const version=createHash('sha256').update(JSON.stringify(bundle)).digest('hex').slice(0,12)
      this.emitFile({type:'asset',fileName:'sw.js',source:`const CACHE='momentum-${version}';const FILES=${JSON.stringify(files)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('momentum-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request,{ignoreSearch:true}))||(e.request.mode==='navigate'?await c.match('/index.html'):fetch(e.request))));});`})
    }
  }],
})
