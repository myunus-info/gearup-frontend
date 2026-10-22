'use client';

import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { sidebarMenuItems } from '@/routes';
import type { IUser } from '@/types';
import { ArrowLeft, Compass, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function DashboardSidebar({ user }: { user?: IUser }) {
  const pathname = usePathname();
  const { user: authUser, logout } = useAuth();

  const activeUser = authUser || user?.data;
  const activeRole = activeUser?.role || 'CUSTOMER';

  // Navigation items based on role
  const navItems = sidebarMenuItems[activeRole as keyof typeof sidebarMenuItems] || [];

  return (
    <aside className="w-64 h-full shrink-0 border-r border-border bg-card flex flex-col justify-between overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Brand Link */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-foreground">
            Gear<span className="text-emerald-500">Up</span>
          </span>
        </Link>

        {/* User Card */}
        {activeUser && (
          <div className="rounded-2xl bg-muted/50 p-3 border border-border space-y-2">
            <div className="flex items-center gap-2.5">
              <Image
                src={
                  activeUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt={activeUser.name || 'User avatar'}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover shrink-0 border border-emerald-500/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{activeUser.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{activeUser.email}</p>
              </div>
            </div>
            <div className="pt-0.5">
              <RoleBadge role={activeUser.role} />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {activeRole ? `${activeRole} Portal` : 'Navigation'}
          </p>

          {navItems.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25'
                    : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-5 border-t border-border space-y-2">
        <Link href="/gear">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-xs rounded-xl cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Marketplace</span>
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={async () => await logout()}
          className="w-full justify-start gap-2 text-destructive border-border hover:bg-destructive/10 text-xs rounded-xl cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
