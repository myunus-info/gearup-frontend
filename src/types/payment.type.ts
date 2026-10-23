import type { RentalOrder } from './rental.type';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'STRIPE' | 'SSLCOMMERZ';

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
