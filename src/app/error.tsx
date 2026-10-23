'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, ChevronUp, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log unexpected errors to monitoring service
    console.error('Root error boundary caught exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      {/* Icon Graphic */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 shadow-xl shadow-rose-200/50 dark:bg-rose-950/80 dark:text-rose-400 dark:shadow-rose-950/50">
          <AlertTriangle className="h-10 w-10" strokeWidth={2.2} />
        </div>
      </div>

      {/* Badges and Headings */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 mb-3">
        <span>Application Exception</span>
        {error.digest && <span className="font-mono text-[10px]">#{error.digest.slice(0, 8)}</span>}
      </span>

      <h1 className="text-2xl font-extrabold text-foreground sm:text-4xl">
        Something unexpected happened
      </h1>

      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        We encountered an error while rendering this expedition view. The issue has been logged, and
        no data or reservations were corrupted.
      </p>

      {/* Error Details Expandable Card */}
      <div className="mt-6 w-full max-w-md text-left">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-xs hover:bg-muted"
        >
          <span>Technical Diagnostics</span>
          {showDetails ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showDetails && (
          <div className="mt-2 rounded-xl border border-border bg-muted/60 p-4 font-mono text-[11px] text-rose-600 dark:text-rose-400">
            <p className="font-bold text-muted-foreground">Message:</p>
            <p className="mt-1 break-all text-foreground">
              {error?.message || 'Unknown error encountered'}
            </p>
            {error?.digest && (
              <p className="mt-2 text-muted-foreground">
                Digest: <span className="text-foreground">{error.digest}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <Button
          onClick={() => reset()}
          size="lg"
          className="w-full sm:w-auto font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md text-white cursor-pointer"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>

        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full font-semibold gap-2 border-border text-foreground hover:bg-muted cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Basecamp</span>
          </Button>
        </Link>
      </div>

      {/* Support Helper Link */}
      <p className="mt-8 text-xs text-muted-foreground">
        Persistent problem?{' '}
        <Link
          href="/contact"
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Contact our gear support team
        </Link>
      </p>
    </div>
  );
}
