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

export type IPayment = Payment;

export interface IInitiatePaymentPayload {
  rentalOrderId: string;
  provider: PaymentProvider;
  paymentMethod?: string;
}

export interface IInitiatePaymentResponse {
  paymentId: string;
  paymentUrl?: string;
  clientSecret?: string;
  provider: PaymentProvider;
}
