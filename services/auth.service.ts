import { LoginPayload, RegisterPayload, User } from '@/types/types';
import { request } from '@/lib/request';

export const authService = {
  register: (payload: RegisterPayload) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: (payload: LoginPayload) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: false,
    });
  },

  getMe: () => {
    return request<User>('/auth/me');
  },
};
