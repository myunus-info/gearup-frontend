'use client';

import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const isAuthorized = !isLoading && !!user;

  return (
    <>
      {!isAuthorized && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      )}
      <div className={!isAuthorized ? 'hidden' : undefined} aria-hidden={!isAuthorized}>
        {children}
      </div>
    </>
  );
}

export default AuthGuard;
