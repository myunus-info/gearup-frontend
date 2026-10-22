import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getNewAccessToken } from './lib/auth';

const PAYMENT_POST_ROUTES = ['/payment/success', '/payment/fail', '/payment/cancel'];

// Map gateway field names -> what the pages expect.
const FIELD_MAP: Record<string, string> = {
  order_id: 'orderId',
  tran_id: 'tranId',
};

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/login', '/register'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

function isTokenValid(token?: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Payment callback POST -> GET redirect for payment gateways (SSLCommerz, Stripe)
  if (request.method === 'POST' && PAYMENT_POST_ROUTES.includes(pathname)) {
    const params = new URLSearchParams();
    try {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        const v = typeof value === 'string' ? value : value.name;
        const mapped = FIELD_MAP[key] ?? key;
        params.set(mapped, v);
      }
    } catch {
      // Continue without parameters.
    }

    const target = new URL(pathname, request.url);
    for (const [key, value] of params.entries()) {
      target.searchParams.set(key, value);
    }
    return NextResponse.redirect(target, 303);
  }

  // 2. Token refresh attempt in background if accessToken is missing but refreshToken is present
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken && refreshToken) {
    try {
      const result = await getNewAccessToken();
      if (result?.success && result?.data?.accessToken) {
        response.cookies.set('accessToken', result.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
      }
    } catch {
      // Do not block navigation on background refresh errors
    }
  }

  // 3. If an authenticated user hits login or register, bounce to /dashboard
  // Only bounce if token is actually valid and unexpired to prevent infinite redirect loops
  if (accessToken && matchesRoute(pathname, AUTH_ROUTES)) {
    if (isTokenValid(accessToken)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Expired or malformed token: clear cookie so login screen renders cleanly
    response.cookies.delete('accessToken');
  }

  // 4. Allow dashboard routes (/dashboard, /dashboard/*) to pass through.
  // Client-side AuthGuard and RoleGuard protect routes and enforce access control.
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};
