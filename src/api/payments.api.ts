import apiClient from '@/lib/apiClient';
import type { IApiResponse, Payment } from '@/types';

export function getMyPayments() {
  return apiClient<IApiResponse<Payment[]>>('/payments');
}

export function confirmPayment(params: { orderId: string; tranId: string; status: string }) {
  return apiClient<IApiResponse<Payment>>('/payments/confirm', {
    method: 'POST',
    query: params,
  });
}
