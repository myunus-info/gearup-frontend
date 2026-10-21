import apiClient from '@/lib/apiClient';
import type { IApiResponse, ILoginResponse, LoginPayload, RegisterPayload, User } from '@/types';

export function loginUser(payload: LoginPayload) {
  return apiClient<IApiResponse<ILoginResponse>>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function registerUser(payload: RegisterPayload) {
  return apiClient<IApiResponse<User>>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function logoutUser() {
  return apiClient<IApiResponse<null>>('/auth/logout', {
    method: 'POST',
  });
}

export function refreshToken(token?: string) {
  return apiClient<IApiResponse<{ accessToken: string }>>('/auth/refresh-token', {
    method: 'POST',
    body: token ? { refreshToken: token } : {},
  });
}

export function getMe() {
  return apiClient<IApiResponse<User>>('/auth/me');
}
