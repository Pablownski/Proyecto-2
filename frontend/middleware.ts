import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_PUBLIC = ['/login', '/registro', '/admin/login'];

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Admin routes ─────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      const adminToken = request.cookies.get('admin_token')?.value;
      if (adminToken && adminToken === process.env.ADMIN_SECRET) {
        return redirect(request, '/admin');
      }
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token')?.value;
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
      return redirect(request, '/admin/login');
    }
    return NextResponse.next();
  }

  // ── User routes ───────────────────────────────────────────────────────────────
  const userToken = request.cookies.get('session_token')?.value;
  const isPublic = USER_PUBLIC.includes(pathname);

  if (!userToken && !isPublic) {
    return redirect(request, '/login');
  }

  if (userToken && isPublic) {
    return redirect(request, '/');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
