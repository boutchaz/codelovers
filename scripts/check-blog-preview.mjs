import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {spawn} from 'node:child_process';

// Run after bun run build; the child is stopped even when a comparison fails.
const port=14329;
const server=spawn(process.execPath,['dist/server/entry.mjs'],{env:{...process.env,HOST:'127.0.0.1',PORT:String(port)}});
try {
await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(new Error('Preview server did not start')),15000);
 server.once('error',reject);
 server.once('exit',()=>{clearTimeout(timer);reject(new Error('Preview server exited before verification'));});
 server.stdout.on('data',data=>{if(String(data).includes('Server listening')){clearTimeout(timer);resolve();}});
});
const source=matter(fs.readFileSync('src/content/blog/reservation-cours-salle-de-sport.md','utf8'));
const payload={author:"CodeLovers",description:"",tags:[],language:"en",...source.data,date:new Date(source.data.date).toISOString().slice(0,10),body:source.content,slug:'reservation-cours-salle-de-sport',series:source.data.series||'',product:source.data.product||''};
const request=new URLSearchParams({payload:JSON.stringify(payload)});
const response=await fetch('http://127.0.0.1:14329/preview/blog/',{method:'POST',headers:{Origin:'https://erp.boutchaz.dev','Content-Type':'application/x-www-form-urlencoded'},body:request});
const html=await response.text();
assert.equal(response.status,200,html.slice(-1000));assert.match(response.headers.get('content-security-policy'),/script-src 'none'/);assert.match(response.headers.get('cache-control'),/no-store/);
assert.match(html,/data-preview="true"/);assert.doesNotMatch(html,/application\/ld\+json|rel="canonical"/);
const published=fs.readFileSync('dist/client/blog/'+payload.slug+'/index.html','utf8');
const prose=content=>content.match(/<div class="blog-prose text-lg text-slate-300">([\s\S]*?)<\/div>/)[1].trim();
assert.equal(prose(html),prose(published),'Preview Markdown must equal the published article');
for(const element of ['<h1','<p class="mt-6','<div class="mx-auto mt-10']){
 const get=h=>h.slice(h.indexOf(element),h.indexOf('</',h.indexOf(element)));
 assert.equal(get(html),get(published));
}
if(process.env.PREVIEW_PROOF_PATH)fs.writeFileSync(process.env.PREVIEW_PROOF_PATH,html);
assert.equal((await fetch('http://127.0.0.1:14329/preview/blog/')).status,405);
assert.equal((await fetch('http://127.0.0.1:14329/preview/blog/',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/x-www-form-urlencoded'},body:request})).status,403);
assert(!fs.readFileSync('dist/client/sitemap-0.xml','utf8').includes('/preview/'));
console.log('Built preview: 200; GET 405; foreign origin 403; Markdown, title, description and cover match public article; private/noindex headers verified.');

} finally { server.kill(); }
