import {test, expect} from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {previewInput, previewHeaders, renderPreviewMarkdown, ERP_ORIGIN} from '../src/data/blog-preview.mjs';

const article={title:'A product decision',body:'Intro.\n\n## The workflow\n\n**Real work**, [a case study](/case-studies/passion-fitness/).\n\n- Schedule\n- Book\n\n```js\nconst demo = true;\n```',description:'A short walkthrough',author:'CodeLovers',date:'2026-11-12',slug:'a-product-decision',product:'passion-fitness',series:'',tags:['Product engineering'],language:'en',cover:'booking'};
const request=(payload=article,options={})=>new Request('https://wearecodelovers.com/preview/blog/',{method:'POST',headers:{Origin:ERP_ORIGIN,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({payload:JSON.stringify(payload)}),...options});
test('only the ERP can submit a bounded article; GET never retrieves a draft',async()=>{
 expect((await previewInput(new Request('https://wearecodelovers.com/preview/blog/'))).status).toBe(405);
 for(const origin of ['https://evil.example','null','https://erp.boutchaz.dev.evil.example','']){
  expect((await previewInput(request(article,{headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded'}}))).status).toBe(403);
 }
 expect((await previewInput(request(article,{headers:{Origin:ERP_ORIGIN,'Content-Type':'application/json'}}))).status).toBe(415);
 expect((await previewInput(request({...article,body:'a'.repeat(140000)}))).status).toBe(413);
 const post=await previewInput(request({...article,notes:'private',approved_snapshot:'private'}));
 expect(post.data.date.toISOString()).toBe('2026-11-12T00:00:00.000Z');expect(post.data.cover).toBe('booking');
 expect(post).not.toHaveProperty('notes');expect(JSON.stringify(post)).not.toContain('private');expect(post.data.draft).toBe(true);
});
test('invalid metadata fails without reflecting supplied content',async()=>{
 for(const values of [{date:'2026-02-30'},{slug:'../bad'},{cover:'evil'},{tags:[{}]},{language:'es'},{seriesOrder:-1},{body:{}},{title:'x'.repeat(301)}]){
  const response=await previewInput(request({...article,...values}));expect(response.status).toBe(400);expect(await response.text()).not.toContain('x'.repeat(100));
 }
});
test('preview Markdown uses the shared sanitized publication pipeline with matching heading ids',async()=>{
 const result=await renderPreviewMarkdown(article.body+'\n\n<script>alert("private")</script>\n\n[bad](javascript:alert(1))\n\n<img src=x onerror="alert(1)">');
 expect(result.code).toContain('<h2 id="the-workflow">The workflow</h2>');expect(result.metadata.headings).toEqual([{depth:2,slug:'the-workflow',text:'The workflow'}]);
 expect(result.code).toContain('<strong>Real work</strong>');expect(result.code).toContain('<ul>');expect(result.code).toContain('<pre');
 expect(result.code).not.toMatch(/<script|onerror|javascript:/);
});
test('preview response disallows indexing, persistence, trackers and public framing',()=>{
 expect(previewHeaders['Cache-Control']).toContain('no-store');expect(previewHeaders['X-Robots-Tag']).toContain('noindex');
 expect(previewHeaders['Content-Security-Policy']).toContain('frame-ancestors '+ERP_ORIGIN);
 expect(previewHeaders['Content-Security-Policy']).toContain("script-src 'none'");expect(previewHeaders['Content-Security-Policy']).toContain("form-action 'none'");
});
test('analytics does not capture attribution, listen or load the SDK in preview',()=>{
 let code=fs.readFileSync(new URL('../src/scripts/posthog.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'').replaceAll('import.meta.env.PUBLIC_POSTHOG_KEY','"test"').replaceAll('import.meta.env.DEV','false');
 code=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const unexpected=()=>{throw new Error('Preview must not initialize analytics');};
 vm.runInNewContext(code,{document:{body:{hasAttribute:()=>true},addEventListener:unexpected},currentCampaign:unexpected,afterLoadIdle:unexpected});
});
