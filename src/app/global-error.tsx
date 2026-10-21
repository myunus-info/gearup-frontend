'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center font-sans text-slate-100">
        <div className="mx-auto max-w-md space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Critical System Error</h1>
            <p className="text-sm text-slate-400">
              A critical failure prevented the application shell from rendering.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left font-mono text-xs text-rose-300">
            <p className="font-bold text-slate-400">Exception:</p>
            <p className="mt-1 break-all text-white">{error?.message || 'Internal server render error'}</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
