'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
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
import { RoleBadge } from '@/components/shared/role-badge';
import {
  Compass,
  Menu,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  Shield,
  Store,
  Search,
} from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardHref = () => {
    if (role === 'ADMIN') return '/dashboard/admin';
    if (role === 'PROVIDER') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Gear', href: '/gear' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Gear<span className="text-emerald-600">Up</span>
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Rent Outdoor Gear Instantly
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                pathname === link.href
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/gear">
            <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 cursor-pointer">
              <Search className="h-4 w-4" />
              <span>Search Gear</span>
            </Button>
          </Link>

          {/* {user ? (
            <div className="flex items-center gap-2">
              <Link href={getDashboardHref()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-300 hover:border-emerald-500"
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-1 ring-2 ring-emerald-500/20 hover:ring-emerald-500/40 transition">
                    <Image
                      src={
                        user.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col space-y-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                    <div className="pt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={getDashboardHref()} className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                      <span>My Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {user.role === 'PROVIDER' && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/provider/gear/new"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="h-4 w-4 text-purple-600" />
                        <span>List New Gear</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/users" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4 text-red-600" />
                        <span>Manage Users</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserIcon className="h-4 w-4 text-slate-500" />
                      <span>Account Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="default">
                  Get Started
                </Button>
              </Link>
            </div>
          )} */}

          {/* Will Remove later */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" variant="default" className="cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
          {/* Will Remove later */}
        </div>

        {/* Mobile Hamburger Sheet */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 sm:w-87.5">
              {' '}
              {/* "w-[300px] sm:w-[350px]" */}
              <SheetHeader className="text-left pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-600" />
                  <span>GearUp Menu</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {user && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
                    <Image
                      src={
                        user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                      }
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{user.name}</span>
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        pathname === link.href
                          ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/50'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link href={getDashboardHref()} onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-2" variant="default">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-red-600"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Create Account</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
