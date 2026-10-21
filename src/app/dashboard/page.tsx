'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/auth/login');
      return;
    }

    switch (user.role) {
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      case 'PROVIDER':
        router.replace('/dashboard/provider');
        break;
      default:
        router.replace('/dashboard/customer');
        break;
    }
  }, [user, isLoading, isAuthenticated, router]);

  return (
    <div className="flex h-96 items-center justify-center space-y-4">
      <div className="text-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-medium">Navigating to your dashboard...</p>
      </div>
    </div>
  );
}
