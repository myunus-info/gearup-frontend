'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import type React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['ADMIN']}>{children}</RoleGuard>;
}
