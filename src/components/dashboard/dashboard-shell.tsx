'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { UserContext } from '@/components/dashboard/user-context';
import { guestUser } from '@/utils/guestUser';
import type { IUser } from '@/types/types';

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IUser;
}) {
  const resolvedUser = user ?? guestUser;

  return (
    <UserContext.Provider value={resolvedUser}>
      <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <div className="hidden md:block">
          <DashboardSidebar user={resolvedUser} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </UserContext.Provider>
  );
}
