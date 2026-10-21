import { ofetch } from 'ofetch';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gearup-nestjs-server.vercel.app/api/v1';

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  onRequest({ options }) {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('accessToken') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          ?.split('=')[1];

      if (token) {
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${token}`);
      }
    }
  },
  onResponseError({ response }) {
    if (response?.status === 401 && typeof window !== 'undefined') {
      // If unauthorized, clear local session if token is expired
      if (window.location.pathname.startsWith('/dashboard')) {
        // window.location.href = '/auth/login?expired=1';
      }
    }
  },
});

export default apiClient;
