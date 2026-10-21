import { BarChart3, Layers, LayoutDashboard, Shield, ShoppingBag, Users } from 'lucide-react';

export const adminLinks = [
  {
    label: 'Platform Overview',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'User Management',
    href: '/dashboard/admin/users',
    icon: Users,
  },
  {
    label: 'All Gear Catalog',
    href: '/dashboard/admin/gear',
    icon: Layers,
  },
  {
    label: 'Platform Rentals',
    href: '/dashboard/admin/rentals',
    icon: ShoppingBag,
  },
  {
    label: 'Revenue & Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Admin Profile',
    href: '/dashboard/admin/profile',
    icon: Shield,
  },
];
