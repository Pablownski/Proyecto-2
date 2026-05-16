import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const response = NextResponse.redirect(`${proto}://${host}${bp}/admin/login`, { status: 303 });
  response.cookies.delete('admin_token');
  return response;
}
