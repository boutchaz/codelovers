import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const SITE = 'https://wearecodelovers.com';
const MANIFEST = '.erp-publish-manifest.json';
const REVISION = /^[a-f0-9]{64}$/;

export function validatePost(post) {
  if (post.channel !== 'Website Blog') throw new Error('Only website blog publishing is enabled');
  if (new URL(post.profile_url).origin !== SITE) throw new Error('Unexpected website destination');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || post.slug.length > 100) throw new Error('Invalid blog slug');
  if (!/^CL-CONTENT-\d+$/.test(post.name) || !REVISION.test(post.revision)) throw new Error('Invalid approved revision');
  if (!['English', 'French'].includes(post.language)) throw new Error('Unsupported language');
  // shortcut: first release publishes text articles; add authenticated image handling before approving posts with attachments.
  if (post.media || !['Text', 'Article'].includes(post.format)) throw new Error('This publisher supports text articles without media attachments');
  const parsed = matter(post.markdown);
  if (parsed.data.erpId !== post.name || parsed.data.erpRevision !== post.revision ||
      parsed.data.language !== (post.language === 'French' ? 'fr' : 'en') ||
      parsed.content.trim() !== post.body.trim()) throw new Error('Export does not match the approved post');
  return { ...post, path: `src/content/blog/${post.slug}.md`, url: `${SITE}/blog/${post.slug}/` };
}

export function checkExisting(existing, post) {
  if (existing && matter(existing).data.erpId !== post.name) throw new Error(`Slug already belongs to another article: ${post.slug}`);
}

export function hasRevision(html, revision) {
  return REVISION.test(revision) && new RegExp(`<meta\\s+name="codelovers-content-revision"\\s+content="${revision}"\\s*/?>`).test(html);
}

function apiClient() {
  const url = new URL(process.env.ERP_URL || 'https://erp.boutchaz.dev');
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/') throw new Error('ERP_URL must be an HTTPS origin');
  const { ERP_API_KEY: key, ERP_API_SECRET: secret } = process.env;
  if (!key || !secret) throw new Error('ERP API credentials are required');
  return async (method, payload) => {
    const response = await fetch(`${url.origin}/api/method/codelovers.content.${method}`, {
      method: payload ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `token ${key}:${secret}`, 'Content-Type': 'application/json' },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    if (!response.ok) throw new Error(`ERP ${method} failed (${response.status})`);
    return (await response.json()).message;
  };
}

async function due(api) {
  const posts = await api('get_due_posts');
  if (!Array.isArray(posts)) throw new Error('Invalid ERP response');
  const validated = posts.map(validatePost);
  if (new Set(validated.map(post => post.slug)).size !== validated.length) throw new Error('Two approved posts share a slug');
  return validated;
}

async function prepare(api) {
  const posts = await due(api);
  // Check every collision before writing any file.
  for (const post of posts) {
    let existing;
    try { existing = await readFile(post.path, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    checkExisting(existing, post);
  }
  await mkdir('src/content/blog', { recursive: true });
  for (const post of posts) await writeFile(post.path, post.markdown);
  await writeFile(MANIFEST, JSON.stringify(posts.map(({ name, revision, path, url }) => ({ name, revision, path, url }))));
  console.log(`Prepared ${posts.length} approved website article(s)`);
}

async function publish(api) {
  const posts = JSON.parse(await readFile(MANIFEST, 'utf8'));
  if (!posts.length) return;
  const hook = new URL(process.env.DEPLOY_WEBHOOK_URL || '');
  if (hook.protocol !== 'https:') throw new Error('An HTTPS deployment webhook is required');
  const current = await due(api);
  for (const post of posts) {
    if (!current.some(row => row.name === post.name && row.revision === post.revision)) throw new Error('Approval changed during build; nothing was pushed');
    const disk = await readFile(post.path, 'utf8');
    if (disk !== current.find(row => row.name === post.name).markdown) throw new Error('Built article differs from approval');
  }
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('add', '--', ...posts.map(post => post.path));
  if (git('diff', '--cached', '--name-only').trim()) {
    git('config', 'user.name', 'Codelovers publisher');
    git('config', 'user.email', 'publisher@wearecodelovers.com');
    git('commit', '-m', 'Publish approved Codelovers website articles');
    git('push', 'origin', 'HEAD:main');
  }
  const reference = git('rev-parse', 'HEAD').trim();
  const deployed = await fetch(hook, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000) });
  if (!deployed.ok) throw new Error(`Deployment request failed (${deployed.status})`);
  const remaining = new Map(posts.map(post => [post.name, post]));
  for (let attempt = 0; attempt < 30 && remaining.size; attempt++) {
    for (const post of remaining.values()) {
      try {
        const response = await fetch(`${post.url}?revision=${post.revision}`, { redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok || !hasRevision(await response.text(), post.revision)) continue;
      } catch { continue; }
      // The ERP rejects stale confirmations; never turn a failed delivery into Published.
      await api('confirm_publication', { name: post.name, revision: post.revision, published_url: post.url,
        published_at: new Date().toISOString(), reference });
      remaining.delete(post.name);
      console.log(`Confirmed ${post.name}`);
    }
    if (remaining.size) await new Promise(resolve => setTimeout(resolve, 15000));
  }
  if (remaining.size) throw new Error('Live revisions are not confirmed yet; approved posts will be retried next run');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const api = apiClient();
    if (process.argv[2] === 'prepare') await prepare(api);
    else if (process.argv[2] === 'publish') await publish(api);
    else throw new Error('Choose prepare or publish');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
