import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const form = await request.formData();
  const username = (form.get('username') as string)?.trim();
  const password = form.get('password') as string;
  const confirm = form.get('confirm_password') as string;
  const name  = (form.get('name')  as string)?.trim();
  const email = (form.get('email') as string)?.trim();
  const phone = (form.get('phone') as string)?.trim();

  if (!username || !password) {
    return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent('Usuario y contraseña requeridos.')}`);
  }
  if (!name || !email || !phone) {
    return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent('Nombre, email y teléfono son obligatorios.')}`);
  }
  if (password.length < 6) {
    return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent('La contraseña debe tener al menos 6 caracteres.')}`);
  }
  if (password !== confirm) {
    return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent('Las contraseñas no coinciden.')}`);
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name, email, phone }),
    });

    if (!res.ok) {
      const e = await res.json();
      return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent(e.detail)}`);
    }

    const data = await res.json();
    const response = NextResponse.redirect(`${proto}://${host}${bp}/`);
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
    return NextResponse.redirect(`${proto}://${host}${bp}/registro?error=${encodeURIComponent('Error de conexión con el servidor.')}`);
  }
}
