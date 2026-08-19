// 'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { getMe } from '@/utils/getMe';
import { guestUser } from '@/utils/guestUser';

export const instant = false;

async function NavbarWithUser() {
  const userResponse = await getMe();
  const user = userResponse?.success ? userResponse : guestUser;
  return <Navbar user={user} />;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      <Suspense fallback={<Navbar user={guestUser} />}>
        <NavbarWithUser />
      </Suspense>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
