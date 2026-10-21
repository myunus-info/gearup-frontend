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
  // Let AuthGuard & RoleGuard handle client-side role redirection
  if (accessToken && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
