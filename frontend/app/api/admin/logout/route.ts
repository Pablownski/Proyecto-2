import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const response = NextResponse.redirect(`http://${host}/admin/login`, { status: 303 });
  response.cookies.delete('admin_token');
  return response;
}
