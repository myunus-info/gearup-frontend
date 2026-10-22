import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AccessDenied({
  title = 'Access Restricted',
  message = 'You do not have permission to access this portal or resource.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-card p-8 text-foreground shadow-xl backdrop-blur-sm">
        <div className="rounded-full bg-red-500/10 p-4 text-red-500 ring-1 ring-red-500/30">
          <ShieldAlert className="size-10" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
        >
          <ArrowLeft className="size-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
