import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { getMe } from '@/utils/getMe';
import { guestUser } from '@/utils/guestUser';

export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userResponse = await getMe();
  const user = userResponse?.success ? userResponse : guestUser;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
