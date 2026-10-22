'use client';

import AccessDenied from '@/components/auth/AccessDenied';
import AuthLoading from '@/components/auth/AuthLoading';
import { useAuth } from '@/providers/authProvider';
import type { Role } from '@/types';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export interface IRoleGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  roles?: Role[];
}

export function RoleGuard({ children, allowedRoles, roles }: IRoleGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const effectiveRoles = allowedRoles || roles || [];
  const isAuthorized = !!user && effectiveRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <AuthLoading label="Authorizing role permissions..." />;
  }

  if (!user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <AccessDenied
      title="Restricted Portal"
      message={`This view requires one of the following roles: [${effectiveRoles.join(
        ', ',
      )}]. Your current role is ${user.role}.`}
    />
  );
}

export default RoleGuard;
