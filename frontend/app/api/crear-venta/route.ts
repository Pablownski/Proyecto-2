import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  try {
    await fetch(`${process.env.API_URL}/venta`, { method: 'POST' });
  } catch (_) {}
  return NextResponse.redirect(`${proto}://${host}${bp}/?success=1`);
}
