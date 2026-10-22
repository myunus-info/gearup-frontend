'use client';

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
import { useAuth } from '@/hooks';
import {
  BookOpen,
  Compass,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PhoneCall,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const getDashboardHref = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin';
    if (user?.role === 'PROVIDER') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  const getSecondaryRoleHref = () => {
    if (user?.role === 'ADMIN') return { label: 'User Management', href: '/dashboard/admin/users' };
    if (user?.role === 'PROVIDER')
      return { label: 'My Gear Inventory', href: '/dashboard/provider/gear' };
    return { label: 'My Rental Orders', href: '/dashboard/customer/orders' };
  };

  // Logged-out routes (minimum 4 routes, we provide 6)
  const loggedOutNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Gear', href: '/gear' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help', href: '/help' },
    { label: 'Contact', href: '/contact' },
  ];

  // Logged-in routes (minimum 6 routes, we provide 7)
  const secondaryItem = getSecondaryRoleHref();
  const loggedInNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Gear', href: '/gear' },
    { label: 'Dashboard', href: getDashboardHref() },
    { label: secondaryItem.label, href: secondaryItem.href },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const currentNavLinks = isAuthenticated ? loggedInNavLinks : loggedOutNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-foreground">
                Gear<span className="text-emerald-500">Up</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
              Adventure Gear Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {currentNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                  isActive ? 'text-emerald-500 font-bold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/gear">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-border text-foreground hover:bg-muted cursor-pointer text-xs font-semibold"
            >
              <Search className="h-3.5 w-3.5 text-emerald-500" />
              <span>Explore</span>
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href={getDashboardHref()}>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer font-semibold shadow-sm"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* Advanced Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-border p-1 pr-2.5 hover:bg-muted transition cursor-pointer">
                    <div className="h-8 w-8 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                      {user.name?.slice(0, 2).toUpperCase() || 'GU'}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <RoleBadge role={user.role} />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 bg-card border-border shadow-xl"
                >
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <div className="text-xs font-bold text-foreground">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link href={getDashboardHref()} className="flex items-center gap-2 text-xs">
                      <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                      <span>Role Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link
                      href={`${getDashboardHref()}/profile`}
                      className="flex items-center gap-2 text-xs"
                    >
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Account Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-2 text-xs font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border-border">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] p-6 bg-card border-border flex flex-col justify-between"
            >
              <div className="space-y-6">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Compass className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-foreground">GearUp</span>
                  </SheetTitle>
                </SheetHeader>

                {isAuthenticated && user && (
                  <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
                    <div className="text-xs font-bold text-foreground">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                    <div className="pt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  {currentNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                        pathname === link.href
                          ? 'bg-emerald-500/10 text-emerald-500 font-bold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
