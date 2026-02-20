"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">Error</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-base text-slate-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30"
      >
        Try again
      </button>
    </div>
  );
}
