// Which pages exist in both English and French, and how to get from one language to the other.
// English pages live at /<page>/, French ones at /fr/<page>/. A page with no counterpart (the blog, the legal
// pages, the 404) sends the language switch to the home page of the other language.
export type Lang = "en" | "fr";

const TRANSLATED_PAGES = ["about", "services", "case-studies"];
const CASE_STUDY = /^case-studies\/[a-z0-9-]+$/;

const trim = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "");

// The path without its language prefix: "/fr/about/" and "/about/" both give "about", "/fr/" gives "".
function bare(pathname: string): string {
  const path = trim(pathname);
  if (path === "fr") return "";
  return path.startsWith("fr/") ? path.slice(3) : path;
}

const isTranslated = (path: string) => path === "" || TRANSLATED_PAGES.includes(path) || CASE_STUDY.test(path);

export function hasTranslation(pathname: string): boolean {
  return isTranslated(bare(pathname));
}

// The URL of the same page in another language, or that language's home page when the page has no counterpart.
export function pathIn(pathname: string, to: Lang): string {
  const path = bare(pathname);
  const prefix = to === "fr" ? "/fr/" : "/";
  return isTranslated(path) && path !== "" ? `${prefix}${path}/` : prefix;
}
