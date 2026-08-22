'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleBadge } from '@/components/shared/role-badge';
import { Compass, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavbarProps } from '@/types/types';
import { logout } from '@/utils/logout';
import { sidebarMenuItems } from '@/config/sidebar-navs';
import { guestUser } from '@/utils/guestUser';
import Image from 'next/image';

export function DashboardSidebar({ user }: NavbarProps) {
  const pathname = usePathname();
  const currentUser = user ?? guestUser;

  // Navigation items based on role
  const navItems = sidebarMenuItems[user?.data?.role as keyof typeof sidebarMenuItems] || [];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="p-5 space-y-6">
        {/* Brand Link */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Gear<span className="text-emerald-600">Up</span>
          </span>
        </Link>

        {/* User Card */}
        {currentUser.success && (
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Image
                src={
                  currentUser?.data?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt={currentUser?.data?.name || 'User avatar'}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate dark:text-slate-100">
                  {currentUser?.data?.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.data?.email}</p>
              </div>
            </div>
            <div className="pt-1">
              <RoleBadge role={currentUser?.data?.role} />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {currentUser?.data?.role ? `${currentUser?.data?.role} Portal` : 'Dashboard Navigation'}
          </p>

          {navItems.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <Link href="/gear">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-slate-600 dark:text-slate-300 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Marketplace
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={async () => await logout()}
          className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 text-xs cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
