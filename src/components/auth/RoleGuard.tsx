'use client';

import { useAuth } from '@/providers/authProvider';
import type { Role } from '@/types';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  const isAuthorized = !isLoading && !!user && allowedRoles.includes(user.role);

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

export default RoleGuard;
