'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import type React from 'react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>{children}</RoleGuard>;
}
