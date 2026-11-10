import {test,expect} from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
test('fast inquiry success is queued before SDK idle load and no form fields enter analytics',async()=>{
 const listeners={},captured=[];let idle;
 const client={init(){},register(){},capture:(...args)=>captured.push(args)};
 let code=fs.readFileSync(new URL('../src/scripts/posthog.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'').replaceAll('import.meta.env.PUBLIC_POSTHOG_KEY','"test"').replaceAll('import.meta.env.DEV','false').replace("import('posthog-js')",'loadPosthog()');
 code=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 vm.runInNewContext(code,{document:{querySelector:()=>null,addEventListener:(name,fn)=>listeners[name]=fn},location:{origin:'https://wearecodelovers.com',pathname:'/contact/'},currentCampaign:()=>({utm_source:'linkedin',utm_campaign:'stack'}),isInternalTraffic:()=>true,afterLoadIdle:fn=>idle=fn,posthogConfig:()=>({}),pageContext:()=>({}),loadPosthog:async()=>({default:client}),classifyClick:()=>null,shareKind:()=>''});
 listeners['codelovers:inquiry-recorded']({detail:{language:'en',product:'services',email:'private@example.com',message:'Private'}});
 expect(captured).toHaveLength(0);idle();await new Promise(resolve=>setImmediate(resolve));
 expect(captured.map(row=>row[0])).toEqual(['$pageview','website_inquiry_recorded']);
 expect(captured[1][1].utm_campaign).toBe('stack');expect(captured[1][1].internal_traffic).toBe(true);
 expect(JSON.stringify(captured)).not.toContain('private@example.com');expect(JSON.stringify(captured)).not.toContain('Private');
});
