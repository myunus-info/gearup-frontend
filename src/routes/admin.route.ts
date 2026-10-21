import { BarChart3, LayoutDashboard, Package, ShoppingBag, User, Users } from 'lucide-react';

export const ADMIN_ROUTES = {
  OVERVIEW: '/dashboard/admin',
  USERS: '/dashboard/admin/users',
  GEAR: '/dashboard/admin/gear',
  RENTALS: '/dashboard/admin/rentals',
  ANALYTICS: '/dashboard/admin/analytics',
  PROFILE: '/dashboard/admin/profile',
} as const;

export const adminRoutes = [
  { name: 'Overview', href: ADMIN_ROUTES.OVERVIEW, icon: LayoutDashboard },
  { name: 'User Management', href: ADMIN_ROUTES.USERS, icon: Users },
  { name: 'Gear Oversight', href: ADMIN_ROUTES.GEAR, icon: Package },
  { name: 'All Rentals', href: ADMIN_ROUTES.RENTALS, icon: ShoppingBag },
  { name: 'Analytics & Trends', href: ADMIN_ROUTES.ANALYTICS, icon: BarChart3 },
  { name: 'Admin Profile', href: ADMIN_ROUTES.PROFILE, icon: User },
];
