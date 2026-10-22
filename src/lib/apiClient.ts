import Cookies from 'js-cookie';
import { ofetch } from 'ofetch';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gearup-nestjs-server.vercel.app/api/v1';

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: 'include',
  onRequest({ options }) {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
      if (token) {
        const headers = new Headers(options.headers);
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        options.headers = headers;
      }
    }
  },
  onResponseError({ response }) {
    if (typeof window !== 'undefined' && response.status === 401) {
      // Clear expired credentials if rejected by backend
      Cookies.remove('accessToken', { path: '/' });
      localStorage.removeItem('accessToken');
    }
  },
});

export default apiClient;
