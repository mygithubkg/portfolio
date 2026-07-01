import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware — protects /admin/dashboard at the network layer.
 * Reads the `adminSession` cookie set by /api/admin-session on login.
 * Unauthenticated requests are redirected to /admin/login BEFORE
 * any JS hydration happens, defeating client-side bypass attacks.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('adminSession');

    if (!session || !session.value) {
      const loginUrl = new URL('/admin/login', request.url);
      // Preserve the original destination so we can redirect after login
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cookie exists — let the request through.
    // The client-side Firebase Auth check is an additional layer of defence.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
