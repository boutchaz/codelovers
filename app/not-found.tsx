import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">404</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-base text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30"
      >
        Back to home
        <span>→</span>
      </Link>
    </div>
  );
}
