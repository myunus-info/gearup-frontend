'use client';

import { useAuth } from '@/providers/authProvider';
import type { Role } from '@/types';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }
    }
  }, [mounted, user, isLoading, allowedRoles, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

export default RoleGuard;
