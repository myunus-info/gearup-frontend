import { adminRoutes } from './admin.route';
import { customerRoutes } from './customer.route';
import { providerRoutes } from './provider.route';

export * from './admin.route';
export * from './customer.route';
export * from './provider.route';

export const sidebarMenuItems = {
  CUSTOMER: customerRoutes.map((r) => ({ ...r, label: r.name })),
  PROVIDER: providerRoutes.map((r) => ({ ...r, label: r.name })),
  ADMIN: adminRoutes.map((r) => ({ ...r, label: r.name })),
} as const;

export const publicNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse Gear', href: '/gear' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Help', href: '/help' },
];
