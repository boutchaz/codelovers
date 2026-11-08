import { test, expect } from 'bun:test';
import { hasTranslation, pathIn } from '../src/data/i18n.ts';

test('every translated page maps to its counterpart in both directions', () => {
  const pairs = [
    ['/', '/fr/'],
    ['/about/', '/fr/about/'],
    ['/services/', '/fr/services/'],
    ['/case-studies/', '/fr/case-studies/'],
    ['/case-studies/passion-fitness/', '/fr/case-studies/passion-fitness/'],
    ['/case-studies/logintel-saas/', '/fr/case-studies/logintel-saas/'],
  ];
  for (const [en, fr] of pairs) {
    expect(pathIn(en, 'fr')).toBe(fr);
    expect(pathIn(fr, 'en')).toBe(en);
    expect(pathIn(en, 'en')).toBe(en);
    expect(pathIn(fr, 'fr')).toBe(fr);
    expect(hasTranslation(en)).toBe(true);
    expect(hasTranslation(fr)).toBe(true);
  }
});

test('accepts paths with or without the trailing slash', () => {
  expect(pathIn('/about', 'fr')).toBe('/fr/about/');
  expect(pathIn('/fr/services', 'en')).toBe('/services/');
});

test('a page without a counterpart sends the switch to the other language home', () => {
  for (const path of ['/blog/', '/blog/reservation-cours-salle-de-sport/', '/privacy/', '/terms/', '/404/', '/newsletter/confirmed/', '/case-studies/a/b/']) {
    expect(hasTranslation(path)).toBe(false);
    expect(pathIn(path, 'fr')).toBe('/fr/');
    expect(pathIn(path, 'en')).toBe('/');
  }
});
