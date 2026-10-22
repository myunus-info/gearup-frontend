import { RoleBadge } from '@/components/shared/role-badge';
import type { IUser } from '@/types';
import type React from 'react';

interface DashboardHeaderProps {
  user?: IUser;
  heading?: string;
  subheading?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ user, heading, subheading, action }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h1>
          {user?.data?.role && <RoleBadge role={user?.data?.role} />}
        </div>
        {subheading && <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>}
      </div>
      <div>{action}</div>
    </div>
  );
}
