'use client';

import AuthLoading from '@/components/auth/AuthLoading';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <AuthLoading label="Verifying active session..." />;
  }

  if (!user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}

export default AuthGuard;
