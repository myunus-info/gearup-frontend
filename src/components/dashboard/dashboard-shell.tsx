'use client';

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { UserContext } from '@/components/dashboard/user-context';
import { RoleBadge } from '@/components/shared/role-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/providers/authProvider';
import type { IUser } from '@/types';
import {
  ArrowLeft,
  Bell,
  Compass,
  ExternalLink,
  Layers,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sparkles,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: IUser;
}) {
  const { user: authUser, logout, demoLogin } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fallback to authUser if user wrapper is passed
  const currentUser = authUser || user?.data;

  const getProfileLink = () => {
    if (currentUser?.role === 'ADMIN') return '/dashboard/admin/profile';
    if (currentUser?.role === 'PROVIDER') return '/dashboard/provider/profile';
    return '/dashboard/customer/profile';
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <DashboardSidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Dashboard Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-card border-border">
                  <DashboardSidebar user={user} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Quick Context Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition flex items-center gap-1 font-medium"
              >
                <Compass className="h-3.5 w-3.5 text-emerald-500" />
                <span>GearUp</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-bold text-foreground capitalize">
                {pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right Action Icons & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400" />
            </Button>

            {/* Marketplace link */}
            <Link href="/gear">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex rounded-xl border-border text-xs font-semibold gap-1.5 hover:bg-muted cursor-pointer"
              >
                <span>Browse Gear</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Button>
            </Link>

            {/* Profile Dropdown Icon & Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1 pr-2.5 hover:bg-muted transition cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <div className="h-8 w-8 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    {currentUser?.name?.slice(0, 2).toUpperCase() || 'GU'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-foreground max-w-[110px] truncate">
                      {currentUser?.name || 'My Account'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {currentUser?.role || 'CUSTOMER'}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl p-2 bg-card border-border shadow-2xl"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="text-xs font-bold text-foreground">
                    {currentUser?.name || 'Account'}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {currentUser?.email}
                  </div>
                  <div className="pt-1">
                    <RoleBadge role={currentUser?.role} />
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                  <Link href={getProfileLink()} className="flex items-center gap-2 text-xs">
                    <UserIcon className="h-4 w-4 text-emerald-500" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                  <Link href="/gear" className="flex items-center gap-2 text-xs">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>Public Catalog</span>
                  </Link>
                </DropdownMenuItem>

                {/* Role switch / Demo quick options */}
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Switch Demo Account
                </div>
                <DropdownMenuItem
                  onClick={() => demoLogin('ADMIN')}
                  className="rounded-xl text-xs cursor-pointer text-red-400 font-semibold"
                >
                  Switch to Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => demoLogin('PROVIDER')}
                  className="rounded-xl text-xs cursor-pointer text-amber-400 font-semibold"
                >
                  Switch to Provider
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => demoLogin('CUSTOMER')}
                  className="rounded-xl text-xs cursor-pointer text-emerald-400 font-semibold"
                >
                  Switch to Customer
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-2 text-xs font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Page View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
