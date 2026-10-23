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
  const provider = payload.provider || payload.paymentMethod || 'SSLCOMMERZ';
  return apiClient<IApiResponse<{ paymentUrl?: string; [key: string]: any }>>('/payments/create', {
    method: 'POST',
    body: {
      orderId,
      provider,
    },
  });
}

export function confirmPayment(params: {
  orderId: string;
  tranId?: string;
  sessionId?: string;
  status?: string;
  provider?: string;
  payload?: Record<string, any>;
}) {
  return apiClient<IApiResponse<Payment>>('/payments/confirm', {
    method: 'POST',
    body: {
      orderId: params.orderId,
      tranId: params.tranId,
      sessionId: params.sessionId,
      provider: params.provider,
      payload: params.payload || {
        status: params.status,
        session_id: params.sessionId,
      },
    },
    query: params as any,
  });
}
