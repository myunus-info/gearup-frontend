import { RoleGuard } from '@/components/auth';
import type React from 'react';

export const instant = false;

export default function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['PROVIDER']}>{children}</RoleGuard>;
}
