import { CreditCard, LayoutDashboard, ShoppingBag, User } from 'lucide-react';

export const customerLinks = [
  {
    label: 'My Overview',
    href: '/dashboard/customer',
    icon: LayoutDashboard,
  },
  {
    label: 'Rental Orders',
    href: '/dashboard/customer/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Payment History',
    href: '/dashboard/customer/payments',
    icon: CreditCard,
  },
  {
    label: 'My Profile',
    href: '/dashboard/customer/profile',
    icon: User,
  },
];
