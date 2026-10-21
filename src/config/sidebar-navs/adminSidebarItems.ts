import { LayoutDashboard, ShoppingBag, Users, Shield, Layers } from 'lucide-react';

export const adminLinks = [
  {
    label: 'Platform Analytics',
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
    label: 'Admin Profile',
    href: '/dashboard/admin/profile',
    icon: Shield,
  },
];
