// Pure helpers for the click analytics in posthog.ts. They send no personal data: only a coarse kind,
// the destination host and the page's product, never a full URL, an email address or a phone number.
export type ClickKind = "booking" | "email" | "phone" | "whatsapp" | "outbound";

const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "whatsapp.com", "chat.whatsapp.com"]);

export function classifyClick(href: string, origin: string): { kind: ClickKind; host: string } | null {
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.protocol === "mailto:") return { kind: "email", host: "" };
  if (url.protocol === "tel:") return { kind: "phone", host: "" };
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.origin === origin) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "cal.com" || host.endsWith(".cal.com")) return { kind: "booking", host };
  if (WHATSAPP_HOSTS.has(host)) return { kind: "whatsapp", host };
  return { kind: "outbound", host };
}

// Case studies are the product pages today, so their slug names the product being read.
export function productFromPath(pathname: string): string {
  return /^\/case-studies\/([a-z0-9-]+)\/?$/.exec(pathname)?.[1] ?? "";
}

// A blog post names its product in frontmatter and the page exposes that and its own slug as data attributes, so a
// visit or a click on an article counts toward the product the article is about. Anything that is not a plain slug is dropped.
export function pageContext(
  pathname: string,
  dataset: { article?: string; product?: string } = {},
): { product: string; article: string } {
  const slug = (value?: string) => (value && /^[a-z0-9-]+$/.test(value) ? value : "");
  return { product: slug(dataset.product) || productFromPath(pathname), article: slug(dataset.article) };
}
