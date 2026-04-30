import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Usuario ya autenticado no necesita ver login ni registro
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
