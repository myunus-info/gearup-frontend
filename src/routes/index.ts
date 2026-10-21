import {
  BarChart3,
  BookOpen,
  Compass,
  CreditCard,
  FileText,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  Package,
  PhoneCall,
  ShieldAlert,
  ShoppingBag,
  User,
  Users,
} from 'lucide-react';

export const publicNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse Gear', href: '/gear' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Help', href: '/help' },
];

export const customerRoutes = [
  { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
  { name: 'My Orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
  { name: 'Payments', href: '/dashboard/customer/payments', icon: CreditCard },
  { name: 'My Profile', href: '/dashboard/customer/profile', icon: User },
];

export const providerRoutes = [
  { name: 'Overview', href: '/dashboard/provider', icon: LayoutDashboard },
  { name: 'My Gear Inventory', href: '/dashboard/provider/gear', icon: Package },
  { name: 'Add New Gear', href: '/dashboard/provider/gear/new', icon: Layers },
  { name: 'Rental Orders', href: '/dashboard/provider/orders', icon: ShoppingBag },
  { name: 'Shop Profile', href: '/dashboard/provider/profile', icon: User },
];

export const adminRoutes = [
  { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
  { name: 'Gear Oversight', href: '/dashboard/admin/gear', icon: Package },
  { name: 'All Rentals', href: '/dashboard/admin/rentals', icon: ShoppingBag },
  { name: 'Analytics & Trends', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { name: 'Admin Profile', href: '/dashboard/admin/profile', icon: User },
];
