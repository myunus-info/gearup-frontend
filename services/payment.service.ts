import { request } from '../lib/request';
import { PaymentProvider } from '@/types/types';

export const paymentService = {
  initiatePayment: (params: { orderId: string; paymentMethod: PaymentProvider }) => {
    return request('/payments/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  getMyPayments: () => {
    return request('/payments');
  },
  confirmPayment: (params: { orderId: string; tranId: string; status: string }) => {
    return request(`/payments?orderId=${params.orderId}&tranId=${params.tranId}&status=${params.status}`, {
      method: 'POST',
    });
  },
};
