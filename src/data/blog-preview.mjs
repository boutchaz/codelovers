import { markdown } from './markdown.mjs';

export const ERP_ORIGIN = 'https://erp.boutchaz.dev';
export const PREVIEW_LIMIT = 131072;
const text = (value, max) => {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid preview field');
  return value;
};

// This endpoint renders supplied content only. It cannot fetch an ERP document or publish/store a draft.
export async function previewInput(request) {
  if (request.method !== 'POST') return new Response('Open a blog draft in ERP Content Studio to preview it.', {status: 405, headers: {Allow: 'POST'}});
  if (request.headers.get('origin') !== ERP_ORIGIN) return new Response('Preview is available from ERP Content Studio.', {status: 403});
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/x-www-form-urlencoded') return new Response('Invalid preview format.', {status: 415});
  const reader = request.body?.getReader();
  if (!reader) return new Response('Missing preview.', {status: 400});
  const chunks = []; let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > PREVIEW_LIMIT) { await reader.cancel(); return new Response('This draft is too large to preview.', {status: 413}); }
      chunks.push(value);
    }
  } catch {
    return new Response('This draft could not be read or exceeds the preview limit.', {status: 413});
  }
  try {
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const input = JSON.parse(new URLSearchParams(new TextDecoder().decode(bytes)).get('payload') || 'null');
    if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error('Missing article');
    const body = text(input.body, 60000);
    const title = text(input.title, 300);
    const description = text(input.description, 1000);
    const author = text(input.author, 200);
    const id = text(input.slug, 200);
    const product = text(input.product, 200);
    const series = text(input.series, 100);
    const dateString = text(input.date, 10);
    const date = new Date(dateString + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== dateString) throw new Error('Invalid date');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !/^[a-z0-9-]*$/.test(product) || !/^[a-z0-9-]*$/.test(series)) throw new Error('Invalid slug');
    if (!['en','fr'].includes(input.language) || !Array.isArray(input.tags) || input.tags.length > 30) throw new Error('Invalid metadata');
    const tags = input.tags.map(tag => text(tag, 100));
    if (input.cover && !['checklist','booking','belts','saas'].includes(input.cover)) throw new Error('Invalid cover');
    if (input.seriesOrder !== undefined && (!Number.isInteger(input.seriesOrder) || input.seriesOrder < 1 || input.seriesOrder > 1000)) throw new Error('Invalid series order');
    return {id, body, data: {title, description, author, date, language: input.language, tags, product, cover: input.cover || undefined, series, seriesOrder: input.seriesOrder, resources: [], draft: true, unlisted: true}};
  } catch {
    return new Response('Could not preview this draft. Check its article settings and try again.', {status: 400});
  }
}

let renderer;
export async function renderPreviewMarkdown(body) {
  renderer ||= markdown.processor.createRenderer(markdown);
  return (await renderer).render(body);
}

export const previewHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  // Visual review only: scripts, forms, trackers and navigation out of the frame are blocked.
  'Content-Security-Policy': `frame-ancestors ${ERP_ORIGIN}; script-src 'none'; connect-src 'none'; form-action 'none'; object-src 'none'; base-uri 'none'; sandbox allow-same-origin`,
};
