import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // In cross-origin deployments (Frontend on Vercel, Backend on a separate domain),
  // HTTP-only cookies are scoped to the backend domain and cannot be read by Next.js edge middleware.
  // Authentication & role authorization are securely validated by RoleGuard and AuthGuard.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
