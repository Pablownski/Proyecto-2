import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  try {
    const res = await fetch(`${process.env.API_URL}/venta-rollback`, { method: 'POST' });
    if (!res.ok) {
      const data = await res.json();
      const msg = encodeURIComponent(data.detail || 'Error desconocido');
      return NextResponse.redirect(`${proto}://${host}${bp}/?rollback=${msg}`);
    }
  } catch (e: unknown) {
    const msg = encodeURIComponent(String(e));
    return NextResponse.redirect(`${proto}://${host}${bp}/?rollback=${msg}`);
  }
  return NextResponse.redirect(`${proto}://${host}${bp}/`);
}
