'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import type React from 'react';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>{children}</RoleGuard>;
}
