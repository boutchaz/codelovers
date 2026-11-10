import {test,expect} from 'bun:test';
import {campaignAttribution,internalTraffic} from '../src/scripts/attribution.ts';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};};
test('tagged landing survives navigation and a new campaign replaces the whole touch',()=>{
 const store=memory();const first=campaignAttribution('?utm_source=linkedin&utm_medium=social&utm_campaign=stack&utm_content=post-1',store,0);
 expect(campaignAttribution('',store,1000)).toEqual(first);
 const next=campaignAttribution('?utm_source=newsletter&utm_campaign=second',store,2000);
 expect(next.utm_content).toBe('');expect(next.utm_medium).toBe('');
 expect(campaignAttribution('',store,86402000).utm_campaign).toBe('');
});
test('storage failures and malformed or personal query values do not break attribution',()=>{
 const broken={getItem(){throw Error();},setItem(){throw Error();}};
 expect(campaignAttribution('?utm_source=linkedin&utm_campaign=stack',broken).utm_campaign).toBe('stack');
 expect(campaignAttribution('?utm_source=alice@example.com&utm_campaign=stack',memory()).utm_source).toBe('');
 expect(campaignAttribution('',{getItem:()=>'{bad',setItem(){}}).utm_campaign).toBe('');
});
test('explicit internal flag persists, can be cleared and detects automation',()=>{
 const store=memory();expect(internalTraffic('?analytics_mode=internal',store)).toBe(true);
 expect(internalTraffic('',store)).toBe(true);expect(internalTraffic('?analytics_mode=public',store)).toBe(false);
 expect(internalTraffic('',store,true)).toBe(true);
});
