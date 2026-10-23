import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // SSLCommerz redirects customer browsers using HTTP POST.
  // Next.js App Router page routes only accept GET/HEAD and return HTTP 405 on POST.
  // Intercept POST requests to /payment/*, preserve/extract form body fields into URL search params,
  // and redirect via HTTP 303 (See Other) which forces browsers to navigate via GET.
  if (request.nextUrl.pathname.startsWith('/payment') && request.method === 'POST') {
    const url = request.nextUrl.clone();
    try {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === 'string' && !url.searchParams.has(key)) {
          url.searchParams.set(key, value);
        }
      });
    } catch {
      // Body not form-data or already consumed; existing query params remain intact
    }
    return NextResponse.redirect(url, 303);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/payment/:path*'],
};
