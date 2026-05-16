import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_PUBLIC = ['/login', '/registro', '/admin/login'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Admin routes ─────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Login de admin es siempre público
    if (pathname === '/admin/login') {
      const adminToken = request.cookies.get('admin_token')?.value;
      if (adminToken && adminToken === process.env.ADMIN_SECRET) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // El resto de /admin requiere admin_token
    const adminToken = request.cookies.get('admin_token')?.value;
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // ── User routes ───────────────────────────────────────────────────────────────
  const userToken = request.cookies.get('session_token')?.value;
  const isPublic = USER_PUBLIC.includes(pathname);

  if (!userToken && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (userToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
