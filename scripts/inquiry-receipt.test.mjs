import {test,expect} from 'bun:test';
import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';
test('only explicitly ERP-acknowledged submissions emit the conversion event',async()=>{
 for(const recorded of [false,true,undefined]){
  let submit;const events=[];const result={};const button={};
  const form={dataset:{language:'en'},reportValidity:()=>true,querySelector:q=>q==='[data-inquiry-result]'?result:button,reset(){},addEventListener:(_,fn)=>submit=fn};
  const source=fs.readFileSync(new URL('../src/scripts/inquiry.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
  const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,{document:{querySelectorAll:()=>[form],dispatchEvent:event=>events.push(event)},location:{pathname:'/contact/'},currentCampaign:()=>({utm_source:'linkedin',utm_campaign:'stack',utm_content:'CL-1'}),crypto:{randomUUID:()=> 'test-id'},FormData:class{entries(){return [['full_name','QA'],['email','private@example.com'],['message','Private'],['product','services'],['consent','on']];}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},AbortSignal,fetch:async()=>Response.json({accepted:true,recorded})});
  await submit({preventDefault(){}});expect(events.length).toBe(recorded===true?1:0);
  if(recorded===true)expect(JSON.stringify(events)).not.toContain('private@example.com');
 }
});
