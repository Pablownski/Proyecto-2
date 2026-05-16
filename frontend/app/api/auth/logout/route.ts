import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const token = (await cookies()).get('session_token')?.value;

  if (token) {
    try {
      await fetch(`${process.env.API_URL}/auth/logout?token=${token}`, { method: 'POST' });
    } catch {
      // Si el backend falla, igual limpiamos la cookie
    }
  }

  const response = NextResponse.redirect(`${proto}://${host}${bp}/login`);
  response.cookies.delete('session_token');
  response.cookies.delete('username');
  return response;
}
