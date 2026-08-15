/* eslint-disable @typescript-eslint/no-explicit-any */
export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export type GearCondition = 'NEW' | 'GOOD' | 'FAIR' | 'WORN';

export type RentalStatus = 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'STRIPE' | 'SSLCOMMERZ';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  status: UserStatus;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  providerProfile?: ProviderProfile | null;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  shopName: string;
  businessAddress?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export interface GearItem {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  pricePerDay: number | string;
  depositAmount?: number | string | null;
  quantityTotal: number;
  quantityAvailable: number;
  condition?: GearCondition | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    providerProfile?: ProviderProfile | null;
  };
  reviews?: Review[];
  avgRating?: number;
}

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDaySnapshot: number | string;
  subtotal: number | string;
  gearItem?: GearItem;
}

export interface Payment {
  id: string;
  rentalOrderId: string;
  transactionId?: string | null;
  amount: number | string;
  provider: PaymentProvider;
  method?: string | null;
  paidAt?: string | null;
  status: PaymentStatus;
  gatewayResponse?: any;
  createdAt: string;
  rentalOrder?: RentalOrder;
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  gearItem?: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface RentalOrder {
  id: string;
  customerId: string;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  pickupConfirmedAt?: string | null;
  returnConfirmedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  items: RentalOrderItem[];
  payments?: Payment[];
  reviews?: Review[];
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
}

export interface GearFilterParams {
  category?: string;
  brand?: string;
  price?: string; // e.g. min-max or single
  condition?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  shopName?: string;
}
