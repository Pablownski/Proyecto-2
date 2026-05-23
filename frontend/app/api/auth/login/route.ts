import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const ROLE_REDIRECT: Record<string, string> = {
  admin:            '/admin-panel',
  inventory:        '/inventory',
  sales:            '/sales',
  reporting:        '/reports',
  customer_service: '/customers',
  customer:         '/',
};

export async function POST(request: Request) {
  const host  = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp    = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const form     = await request.formData();
  const username = (form.get('username') as string)?.trim();
  const password = form.get('password') as string;

  const userParam = username ? `&username=${encodeURIComponent(username)}` : '';

  if (!username || !password) {
    return NextResponse.redirect(
      `${proto}://${host}${bp}/login?error=${encodeURIComponent('Usuario y contraseña requeridos.')}${userParam}`,
    );
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const e = await res.json();
      return NextResponse.redirect(
        `${proto}://${host}${bp}/login?error=${encodeURIComponent(e.detail)}${userParam}`,
      );
    }

    const data     = await res.json();
    const role     = data.role ?? 'customer';
    const dest     = ROLE_REDIRECT[role] ?? '/';
    const response = NextResponse.redirect(`${proto}://${host}${bp}${dest}`);

    response.cookies.set('session_token', data.token, { httpOnly: true, sameSite: 'lax', path: '/' });
    response.cookies.set('username',      data.username, { sameSite: 'lax', path: '/' });
    response.cookies.set('user_role',     role,          { sameSite: 'lax', path: '/' });

    return response;
  } catch {
    return NextResponse.redirect(
      `${proto}://${host}${bp}/login?error=${encodeURIComponent('Error de conexión con el servidor.')}${userParam}`,
    );
  }
}
