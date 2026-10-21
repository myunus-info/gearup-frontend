import { RoleGuard } from '@/components/auth';
import type React from 'react';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['CUSTOMER']}>{children}</RoleGuard>;
}
