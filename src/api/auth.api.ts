import apiClient from '@/lib/apiClient';
import type { IApiResponse, ILoginResponse, LoginPayload, RegisterPayload, User } from '@/types';

export function loginUser(payload: LoginPayload) {
  // Only send whitelisted authentication credentials expected by the backend LoginDto
  const { email, password } = payload;
  return apiClient<IApiResponse<ILoginResponse>>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function registerUser(payload: RegisterPayload) {
  const body: Record<string, any> = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  };
  if (payload.phone) body.phone = payload.phone;
  if (payload.address) body.address = payload.address;
  if (payload.role === 'PROVIDER' && payload.shopName) {
    body.shopName = payload.shopName;
  }

  return apiClient<IApiResponse<User>>('/auth/register', {
    method: 'POST',
    body,
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
