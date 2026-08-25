import { request } from '../lib/request';

export const paymentService = {
  getMyPayments: () => {
    return request('/payments');
  },
  confirmPayment: (params: { orderId: string; tranId: string; status: string }) => {
    return request(
      `/payments/confirm?orderId=${params.orderId}&tranId=${params.tranId}&status=${params.status}`,
      {
        method: 'POST',
      },
    );
  },
};
