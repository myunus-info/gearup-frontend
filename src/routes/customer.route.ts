import { CreditCard, LayoutDashboard, ShoppingBag, User } from 'lucide-react';

export const CUSTOMER_ROUTES = {
  OVERVIEW: '/dashboard/customer',
  ORDERS: '/dashboard/customer/orders',
  PAYMENTS: '/dashboard/customer/payments',
  PROFILE: '/dashboard/customer/profile',
} as const;

export const customerRoutes = [
  { name: 'Overview', href: CUSTOMER_ROUTES.OVERVIEW, icon: LayoutDashboard },
  { name: 'My Orders', href: CUSTOMER_ROUTES.ORDERS, icon: ShoppingBag },
  { name: 'Payments', href: CUSTOMER_ROUTES.PAYMENTS, icon: CreditCard },
  { name: 'My Profile', href: CUSTOMER_ROUTES.PROFILE, icon: User },
];
