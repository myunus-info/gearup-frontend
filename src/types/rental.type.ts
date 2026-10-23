import type { GearItem, Review } from './gear.type';
import type { Payment, PaymentProvider } from './payment.type';

export type RentalStatus = 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDaySnapshot: number | string;
  subtotal: number | string;
  gearItem?: GearItem;
}

export type IRentalOrderItem = RentalOrderItem;

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
  paymentUrl?: string | null;
}

export type IRentalOrder = RentalOrder;

export interface ICreateRentalOrderPayload {
  gearItemId?: string;
  startDate: string;
  endDate: string;
  quantity?: number;
  items?: { gearItemId: string; quantity: number }[];
  provider?: PaymentProvider;
}
