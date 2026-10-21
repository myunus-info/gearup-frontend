import { request } from '@/lib/request';

export const authService = {
  getMe: () => {
    return request('/auth/me');
  },
};
