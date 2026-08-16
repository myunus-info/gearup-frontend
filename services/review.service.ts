import { Review } from '@/types/types';
import { request } from '../lib/request';

export const reviewService = {
  createReview: (payload: {
    rentalOrderId: string;
    gearItemId: string;
    rating: number;
    comment?: string;
  }) => {
    return request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
