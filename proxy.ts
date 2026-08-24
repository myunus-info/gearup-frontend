import type { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtUtils } from './utils/jwt';
import { env } from './config/env';
import { getNewAccessToken } from './lib/auth';

type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

interface AccessTokenPayload extends JwtPayload {
  role: Role;
}

const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const PUBLIC_ROUTES = ['/', '/gear', '/about', '/contact', '/payment'];

const PAYMENT_POST_ROUTES = ['/payment/success', '/payment/fail', '/payment/cancel'];

// Map gateway field names -> what the pages expect.
const FIELD_MAP: Record<string, string> = {
  order_id: 'orderId',
  tran_id: 'tranId',
};

// Single source of truth for role -> dashboard mapping.
const ROLE_DASHBOARD: Record<Role, string> = {
  CUSTOMER: '/dashboard/customer',
  PROVIDER: '/dashboard/provider',
  ADMIN: '/dashboard/admin',
};

const isRole = (value: unknown): value is Role =>
  value === 'CUSTOMER' || value === 'ADMIN' || value === 'PROVIDER';

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(route => pathname === route || pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Turn the gateway's POST into a browser GET so the page can render.
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
      // Body parse failed: redirect without params so the page shows defaults.
    }

    const target = new URL(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, request.url);

    return NextResponse.redirect(target, 303);
  }

  const response = NextResponse.next();

  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let decodedAccessToken = accessToken
    ? await jwtUtils.verifyToken(accessToken, env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? await jwtUtils.verifyToken(refreshToken, env.JWT_REFRESH_SECRET as string)
    : null;

  // Access token missing/invalid but refresh token is valid -> try to refresh.
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      accessToken = result.data.accessToken;
      decodedAccessToken = await jwtUtils.verifyToken(accessToken as string, env.JWT_ACCESS_SECRET as string);

      response.cookies.set('accessToken', accessToken as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    } else {
      // Refresh failed: don't carry a stale/invalid token forward.
      accessToken = undefined;
      decodedAccessToken = null;
    }
  }

  let userRole: Role | null = null;

  if (!decodedAccessToken?.success) {
    accessToken = undefined;
    response.cookies.delete('accessToken');
  } else if (decodedAccessToken.data) {
    const payload = decodedAccessToken.data as AccessTokenPayload;
    userRole = isRole(payload.role) ? payload.role : null;
  }

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);

  // Logged-in user hitting /login or /register -> bounce to their dashboard.
  if (accessToken && isAuthRoute) {
    const destination = userRole ? ROLE_DASHBOARD[userRole] : '/';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // No valid session on a protected route -> send to login.
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-gate each dashboard using the same table used above.
  for (const [role, dashboardPath] of Object.entries(ROLE_DASHBOARD) as [Role, string][]) {
    if (pathname.startsWith(dashboardPath) && userRole !== role) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};
