import Cookies from 'js-cookie';
import { ofetch } from 'ofetch';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gearup-nestjs-server.vercel.app/api/v1';

let refreshPromise: Promise<string | null> | null = null;

async function performSilentRefresh(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const storedRefresh = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
  if (!storedRefresh) return null;

  try {
    const res = await ofetch<{ data?: { accessToken?: string }; success?: boolean }>(
      `${BASE_URL}/auth/refresh-token`,
      {
        method: 'POST',
        body: { refreshToken: storedRefresh },
        credentials: 'include',
      },
    );

    const newAccessToken = res?.data?.accessToken;
    if (newAccessToken) {
      Cookies.set('accessToken', newAccessToken, { expires: 1, path: '/' });
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch {
    // Refresh token expired or revoked
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  } finally {
    refreshPromise = null;
  }
}

const rawClient = ofetch.create({
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
});

export const apiClient = async <T = any>(request: string, options?: any): Promise<T> => {
  try {
    return await rawClient<T>(request, options);
  } catch (err: any) {
    const is401 = err?.status === 401 || err?.response?.status === 401;
    const isAuthEndpoint =
      request.includes('/auth/login') ||
      request.includes('/auth/register') ||
      request.includes('/auth/refresh-token');

    if (is401 && !isAuthEndpoint && typeof window !== 'undefined') {
      if (!refreshPromise) {
        refreshPromise = performSilentRefresh();
      }

      const newToken = await refreshPromise;
      if (newToken) {
        const headers = new Headers(options?.headers);
        headers.set('Authorization', `Bearer ${newToken}`);
        return rawClient<T>(request, {
          ...options,
          headers,
        });
      }

      // Refresh failed; clear credentials
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    throw err;
  }
};

export default apiClient;
