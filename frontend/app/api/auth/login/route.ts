import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const form = await request.formData();
  const username = (form.get('username') as string)?.trim();
  const password = form.get('password') as string;

  const userParam = username ? `&username=${encodeURIComponent(username)}` : '';

  if (!username || !password) {
    return NextResponse.redirect(`http://${host}/login?error=${encodeURIComponent('Usuario y contraseña requeridos.')}${userParam}`);
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const e = await res.json();
      return NextResponse.redirect(`http://${host}/login?error=${encodeURIComponent(e.detail)}${userParam}`);
    }

    const data = await res.json();
    const response = NextResponse.redirect(`http://${host}/`);
    response.cookies.set('session_token', data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    response.cookies.set('username', data.username, {
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.redirect(`http://${host}/login?error=${encodeURIComponent('Error de conexión con el servidor.')}${userParam}`);
  }
}
