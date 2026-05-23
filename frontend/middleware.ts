import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PUBLIC = ['/login', '/registro'];

const PANEL_ROLES: Record<string, string[]> = {
  '/admin-panel': ['admin'],
  '/inventory':   ['admin', 'inventory'],
  '/sales':       ['admin', 'sales'],
  '/reports':     ['admin', 'reporting'],
  '/customers':   ['admin', 'customer_service'],
};

const ROLE_HOME: Record<string, string> = {
  admin:            '/admin-panel',
  inventory:        '/inventory',
  sales:            '/sales',
  reporting:        '/reports',
  customer_service: '/customers',
};

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const pathname  = request.nextUrl.pathname;
  const userToken = request.cookies.get('session_token')?.value;
  const userRole  = request.cookies.get('user_role')?.value ?? '';

  // ── Rutas del panel de roles ───────────────────────────────────────────────
  const panelMatch = Object.keys(PANEL_ROLES).find(p => pathname.startsWith(p));
  if (panelMatch) {
    if (!userToken || !PANEL_ROLES[panelMatch].includes(userRole)) {
      return redirect(request, '/login');
    }
    return NextResponse.next();
  }

  // ── Rutas de autenticación ────────────────────────────────────────────────
  if (AUTH_PUBLIC.includes(pathname)) {
    if (userToken) {
      return redirect(request, ROLE_HOME[userRole] ?? '/');
    }
    return NextResponse.next();
  }

  // ── Rutas de la tienda ────────────────────────────────────────────────────
  if (!userToken) {
    return redirect(request, '/login');
  }

  // Usuarios con rol de panel no navegan por la tienda
  if (ROLE_HOME[userRole]) {
    return redirect(request, ROLE_HOME[userRole]);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
