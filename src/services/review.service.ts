import { request } from '../lib/request';

export const reviewService = {
  createReview: (payload: {
    rentalOrderId: string;
    gearItemId: string;
    rating: number;
    comment?: string;
  }) => {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
