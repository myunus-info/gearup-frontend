import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Store } from 'lucide-react';

export const providerLinks = [
  {
    label: 'Provider Overview',
    href: '/dashboard/provider',
    icon: LayoutDashboard,
  },
  {
    label: 'Gear Inventory',
    href: '/dashboard/provider/gear',
    icon: Package,
  },
  {
    label: 'Add New Gear',
    href: '/dashboard/provider/gear/new',
    icon: PlusCircle,
  },
  {
    label: 'Incoming Orders',
    href: '/dashboard/provider/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Shop Profile',
    href: '/dashboard/provider/profile',
    icon: Store,
  },
];
