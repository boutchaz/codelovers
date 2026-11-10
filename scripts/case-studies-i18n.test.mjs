import { test, expect } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';

const dir = (lang) => new URL(`../src/content/${lang === 'en' ? 'case-studies' : 'case-studies-fr'}/`, import.meta.url);
const files = (lang) => readdirSync(dir(lang)).filter((name) => name.endsWith('.md')).sort();
const read = (lang, name) => matter(readFileSync(new URL(name, dir(lang)), 'utf8'));

test('every English case study has a French version, and the other way round', () => {
  expect(files('fr')).toEqual(files('en'));
});

test('the French version keeps the fields that are not text, and translates the ones that are', () => {
  for (const name of files('en')) {
    const en = read('en', name).data;
    const fr = read('fr', name).data;
    // Not translated: the product name, the look, the stack, the date and the live link.
    for (const key of ['title', 'gradient', 'stack', 'date', 'externalUrl']) expect(fr[key]).toEqual(en[key]);
    // Translated: the description must differ from the English one, and the page must have a body.
    expect(fr.description).not.toBe(en.description);
    expect(fr.category).not.toBe(en.category);
    expect(read('fr', name).content.trim().length).toBeGreaterThan(0);
  }
});

test('the French body keeps the same sections as the English one', () => {
  const headings = (text) => text.split('\n').filter((line) => /^#{2,3} /.test(line)).length;
  for (const name of files('en')) {
    expect(headings(read('fr', name).content)).toBe(headings(read('en', name).content));
  }
});
