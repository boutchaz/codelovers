import { test, expect } from 'bun:test';
import { validatePost, checkExisting, hasRevision } from './publish-erp-blog.mjs';
const revision = 'a'.repeat(64);
function post(overrides = {}) {
  return { name: 'CL-CONTENT-00004', channel: 'Website Blog', profile_url: 'https://wearecodelovers.com/',
    slug: 'our-story-fr', revision, language: 'French', format: 'Article', body: 'Bonjour',
    markdown: `---\nerpId: CL-CONTENT-00004\nerpRevision: ${revision}\nlanguage: fr\n---\nBonjour\n`, ...overrides };
}
test('accepts an exact bilingual export', () => expect(validatePost(post()).url).toEndWith('/our-story-fr/'));
test('rejects traversal, social delivery, other sites, stale exports and unsupported media', () => {
  for (const overrides of [{ slug: '../secret' }, { channel: 'X' }, { profile_url: 'https://evil.example' },
    { revision: 'bad' }, { body: 'Changed' }, { media: '/private/files/photo.png' }, { language: 'German' }]) {
    expect(() => validatePost(post(overrides))).toThrow();
  }
});
test('preserves manually authored articles and permits retrying the same ERP record', () => {
  expect(() => checkExisting('---\ntitle: Existing\n---\nCopy', post())).toThrow();
  expect(() => checkExisting(post().markdown, post())).not.toThrow();
});
test('requires the exact live revision marker, not just HTTP success or a text mention', () => {
  expect(hasRevision(`<meta name="codelovers-content-revision" content="${revision}">`, revision)).toBe(true);
  expect(hasRevision(revision, revision)).toBe(false);
  expect(hasRevision(`<meta name="codelovers-content-revision" content="${'b'.repeat(64)}">`, revision)).toBe(false);
});
