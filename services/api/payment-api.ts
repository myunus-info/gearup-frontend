import { Payment } from '@/lib/types';
import { request } from './request';

export async function getMyPayments() {
  return request<Payment[]>('/payments');
}

export async function confirmPayment(params: { orderId: string; tranId: string; status: string }) {
  return request(`/payments?orderId=${params.orderId}&tranId=${params.tranId}&status=${params.status}`, {
    method: 'POST',
  });
}
