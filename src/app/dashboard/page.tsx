'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardRedirectPage() {
  return (
    <div className="flex h-96 items-center justify-center space-y-4">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-48 mx-auto" />
        <p className="text-xs text-slate-500">Redirecting to your portal...</p>
      </div>
    </div>
  );
}
