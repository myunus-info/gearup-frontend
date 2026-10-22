'use client';

import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/auth/login');
    }
  }, [mounted, user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default AuthGuard;
