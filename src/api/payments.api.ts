import apiClient from '@/lib/apiClient';
import type { IApiResponse, Payment } from '@/types';

export function getMyPayments() {
  return apiClient<IApiResponse<Payment[]>>('/payments');
}

export function initiatePayment(payload: {
  orderId?: string;
  rentalOrderId?: string;
  paymentMethod?: string;
  provider?: string;
}) {
  const orderId = payload.orderId || payload.rentalOrderId;
  const method = payload.paymentMethod || payload.provider || 'SSLCOMMERZ';
  return apiClient<IApiResponse<{ paymentUrl?: string; [key: string]: any }>>('/payments/create', {
    method: 'POST',
    body: {
      orderId,
      rentalOrderId: orderId,
      paymentMethod: method,
      provider: method,
    },
  });
}

export function confirmPayment(params: { orderId: string; tranId: string; status: string }) {
  return apiClient<IApiResponse<Payment>>('/payments/confirm', {
    method: 'POST',
    body: {
      orderId: params.orderId,
      tranId: params.tranId,
      payload: { status: params.status },
    },
    query: params,
  });
}
