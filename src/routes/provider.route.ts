import { Layers, LayoutDashboard, Package, ShoppingBag, User } from 'lucide-react';

export const PROVIDER_ROUTES = {
  OVERVIEW: '/dashboard/provider',
  GEAR: '/dashboard/provider/gear',
  CREATE_GEAR: '/dashboard/provider/gear/new',
  ORDERS: '/dashboard/provider/orders',
  PROFILE: '/dashboard/provider/profile',
} as const;

export const providerRoutes = [
  { name: 'Overview', href: PROVIDER_ROUTES.OVERVIEW, icon: LayoutDashboard },
  { name: 'My Gear Inventory', href: PROVIDER_ROUTES.GEAR, icon: Package },
  { name: 'Add New Gear', href: PROVIDER_ROUTES.CREATE_GEAR, icon: Layers },
  { name: 'Rental Orders', href: PROVIDER_ROUTES.ORDERS, icon: ShoppingBag },
  { name: 'Shop Profile', href: PROVIDER_ROUTES.PROFILE, icon: User },
];
