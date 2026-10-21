import { RoleGuard } from '@/components/auth';
import type React from 'react';

export const instant = false;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['ADMIN']}>{children}</RoleGuard>;
}
