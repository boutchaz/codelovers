import { test, expect } from 'bun:test';
import { validatePost, checkExisting, hasRevision, publish } from './publish-erp-blog.mjs';
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

// publish(): drives the real flow with fake git, network and ERP.
const PATH = 'src/content/blog/our-story-fr.md';
function harness({ staged = '', live = false, hookOk = true, env = {} } = {}) {
  const exported = post();
  const calls = { git: [], requests: [], confirmed: [] };
  const api = async (method, payload) => {
    if (method === 'get_due_posts') return [exported];
    calls.confirmed.push(payload);
    return {};
  };
  const git = (...args) => {
    calls.git.push(args.join(' '));
    if (args[0] === 'diff') return staged;
    if (args[0] === 'rev-parse') return 'abc123\n';
    return '';
  };
  const request = async (url, options = {}) => {
    calls.requests.push({ url: String(url), method: options.method || 'GET' });
    if (options.method === 'POST') return { ok: hookOk, status: hookOk ? 200 : 500 };
    return { ok: true, status: 200, text: async () => live ? `<meta name="codelovers-content-revision" content="${revision}">` : '<html></html>' };
  };
  const manifest = JSON.stringify([{ name: exported.name, revision, path: PATH, url: 'https://wearecodelovers.com/blog/our-story-fr/' }]);
  const read = async path => path === '.erp-publish-manifest.json' ? manifest : exported.markdown;
  const run = () => publish(api, { git, request, read, sleep: async () => {}, attempts: 2,
    env: { DEPLOY_WEBHOOK_URL: 'https://deploy.example/hook', ...env } });
  return { calls, run };
}
const deployments = calls => calls.requests.filter(request => request.method === 'POST');

test('scheduled retries never redeploy an article that is committed but not live yet', async () => {
  for (let scheduledRun = 0; scheduledRun < 3; scheduledRun++) {
    const { calls, run } = harness();
    await expect(run()).rejects.toThrow('No new deployment was requested');
    expect(deployments(calls)).toHaveLength(0);
    expect(calls.confirmed).toHaveLength(0);
  }
});
test('a retry confirms the article once the earlier deployment went live, without deploying again', async () => {
  const { calls, run } = harness({ live: true });
  await run();
  expect(deployments(calls)).toHaveLength(0);
  expect(calls.confirmed).toHaveLength(1);
  expect(calls.confirmed[0]).toMatchObject({ name: 'CL-CONTENT-00004', revision, reference: 'abc123' });
});
test('a newly pushed article requests exactly one deployment and is confirmed when live', async () => {
  const { calls, run } = harness({ staged: PATH, live: true });
  await run();
  expect(calls.git).toContain('push origin HEAD:main');
  expect(deployments(calls)).toHaveLength(1);
  expect(calls.confirmed).toHaveLength(1);
});
test('a pushed article that never goes live reports the deployment to check, after one request', async () => {
  const { calls, run } = harness({ staged: PATH });
  await expect(run()).rejects.toThrow('check its status in Dokploy');
  expect(deployments(calls)).toHaveLength(1);
  expect(calls.confirmed).toHaveLength(0);
});
test('an operator can force a redeploy without a new commit', async () => {
  const { calls, run } = harness({ live: true, env: { FORCE_REDEPLOY: 'true' } });
  await run();
  expect(deployments(calls)).toHaveLength(1);
});
test('a failed deployment request after the push says how to redeploy', async () => {
  const { run } = harness({ staged: PATH, hookOk: false });
  await expect(run()).rejects.toThrow('Redeploy');
});
test('a non-HTTPS or missing deployment hook is refused before anything is pushed', async () => {
  for (const hook of ['', 'http://deploy.example/hook']) {
    const { calls, run } = harness({ staged: PATH, env: { DEPLOY_WEBHOOK_URL: hook } });
    await expect(run()).rejects.toThrow();
    expect(calls.git).toHaveLength(0);
  }
});
