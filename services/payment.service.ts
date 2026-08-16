import { Payment } from '@/types/types';
import { request } from '../lib/request';

export const paymentService = {
  getMyPayments: () => {
    return request<Payment[]>('/payments');
  },
  confirmPayment: (params: { orderId: string; tranId: string; status: string }) => {
    return request(`/payments?orderId=${params.orderId}&tranId=${params.tranId}&status=${params.status}`, {
      method: 'POST',
    });
  },
};
