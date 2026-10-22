'use client';

import AuthLoading from '@/components/auth/AuthLoading';
import { useGetMe } from '@/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isPending, isError } = useGetMe();

  useEffect(() => {
    if (isPending) return;
    if (isError || !user) {
      const redirectQuery = pathname ? `?redirectTo=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${redirectQuery}`);
    }
  }, [isPending, isError, user, router, pathname]);

  if (isPending) {
    return <AuthLoading label="Verifying active session..." />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  return <>{children}</>;
}

export default AuthGuard;
