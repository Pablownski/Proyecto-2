import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const form = await request.formData();
  const username = (form.get('username') as string)?.trim();
  const password = form.get('password') as string;
  const confirm = form.get('confirm_password') as string;

  if (!username || !password) {
    return NextResponse.redirect(`http://${host}/registro?error=${encodeURIComponent('Usuario y contraseña requeridos.')}`);
  }
  if (password.length < 6) {
    return NextResponse.redirect(`http://${host}/registro?error=${encodeURIComponent('La contraseña debe tener al menos 6 caracteres.')}`);
  }
  if (password !== confirm) {
    return NextResponse.redirect(`http://${host}/registro?error=${encodeURIComponent('Las contraseñas no coinciden.')}`);
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const e = await res.json();
      return NextResponse.redirect(`http://${host}/registro?error=${encodeURIComponent(e.detail)}`);
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
    return NextResponse.redirect(`http://${host}/registro?error=${encodeURIComponent('Error de conexión con el servidor.')}`);
  }
}
