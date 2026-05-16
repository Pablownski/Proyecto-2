import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const form = await request.formData();
  const username = form.get('username')?.toString().trim() ?? '';
  const password = form.get('password')?.toString() ?? '';

  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!validUser || !validPass || !secret) {
    const url = `${proto}://${host}${bp}/admin/login?error=${encodeURIComponent('Configuración de admin incompleta en el servidor')}`;
    return NextResponse.redirect(url, { status: 303 });
  }

  if (username !== validUser || password !== validPass) {
    const url = `${proto}://${host}${bp}/admin/login?error=${encodeURIComponent('Usuario o contraseña incorrectos')}`;
    return NextResponse.redirect(url, { status: 303 });
  }

  const response = NextResponse.redirect(`${proto}://${host}${bp}/admin`, { status: 303 });
  response.cookies.set('admin_token', secret, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
