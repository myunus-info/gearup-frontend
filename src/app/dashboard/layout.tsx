import AuthGuard from '@/components/auth/AuthGuard';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
