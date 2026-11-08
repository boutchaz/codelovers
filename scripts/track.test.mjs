import { test, expect } from 'bun:test';
import { classifyClick, pageContext, productFromPath } from '../src/scripts/track.ts';

const origin = 'https://wearecodelovers.com';

test('classifies the clicks that mean a visitor is trying to reach us', () => {
  expect(classifyClick('https://cal.com/codelovers/30min?user=codelovers', origin)).toEqual({ kind: 'booking', host: 'cal.com' });
  expect(classifyClick('https://app.cal.com/codelovers', origin)).toEqual({ kind: 'booking', host: 'app.cal.com' });
  expect(classifyClick('https://wa.me/212600000000?text=Bonjour', origin)).toEqual({ kind: 'whatsapp', host: 'wa.me' });
  expect(classifyClick('https://api.whatsapp.com/send?phone=1', origin)?.kind).toBe('whatsapp');
  expect(classifyClick('mailto:tech@wearecodelovers.com?subject=Hi', origin)).toEqual({ kind: 'email', host: '' });
  expect(classifyClick('tel:+212600000000', origin)).toEqual({ kind: 'phone', host: '' });
});
test('reports only the host of other outbound links and ignores internal navigation', () => {
  expect(classifyClick('https://www.linkedin.com/company/codelovers?trk=abc', origin)).toEqual({ kind: 'outbound', host: 'linkedin.com' });
  for (const href of ['/services/', '#contact', 'https://wearecodelovers.com/blog/', 'javascript:alert(1)', 'data:text/html,x', '']) {
    expect(classifyClick(href, origin)).toBeNull();
  }
});
test('never leaks the address, number, path or query of what was clicked', () => {
  for (const href of ['mailto:private@example.com', 'tel:+212611223344', 'https://wa.me/212611223344?text=secret', 'https://cal.com/someone/secret-meeting?email=a@b.c']) {
    expect(JSON.stringify(classifyClick(href, origin))).not.toMatch(/private|2126|secret|a@b/);
  }
});
test('names the product only on a case-study page', () => {
  expect(productFromPath('/case-studies/passion-fitness/')).toBe('passion-fitness');
  expect(productFromPath('/case-studies/snookly')).toBe('snookly');
  for (const path of ['/', '/blog/offline-first-rural-morocco/', '/case-studies/', '/fr/', '/case-studies/a/b/']) expect(productFromPath(path)).toBe('');
});
test('credits a blog post to the product it names, and a case study to its own', () => {
  expect(pageContext('/blog/suivi-progression-ceintures-bjj/', { article: 'suivi-progression-ceintures-bjj', product: 'passion-fitness' }))
    .toEqual({ product: 'passion-fitness', article: 'suivi-progression-ceintures-bjj' });
  expect(pageContext('/case-studies/snookly/')).toEqual({ product: 'snookly', article: '' });
  expect(pageContext('/blog/offline-first-rural-morocco/', { article: 'offline-first-rural-morocco', product: undefined }))
    .toEqual({ product: '', article: 'offline-first-rural-morocco' });
  expect(pageContext('/')).toEqual({ product: '', article: '' });
});
test('drops page attributes that are not a plain slug', () => {
  const junk = ['Passion Fitness', 'a/b', 'x?y=1', 'ÉTÉ', '', 'a@b.c'];
  for (const value of junk) expect(pageContext('/blog/x/', { article: value, product: value })).toEqual({ product: '', article: '' });
});
