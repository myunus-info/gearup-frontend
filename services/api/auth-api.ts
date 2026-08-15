import { LoginPayload, RegisterPayload, User } from '@/lib/types';
import { request } from './request';
import { logout as signout } from '../logout';

export async function login(payload: LoginPayload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return request<User>('/auth/me');
}

export async function logout() {
  await signout();
}
