import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  try {
    const res = await fetch(`${process.env.API_URL}/venta-rollback`, { method: 'POST' });
    if (!res.ok) {
      const data = await res.json();
      const msg = encodeURIComponent(data.detail || 'Error desconocido');
      return NextResponse.redirect(`http://${host}/?rollback=${msg}`);
    }
  } catch (e: any) {
    const msg = encodeURIComponent(String(e));
    return NextResponse.redirect(`http://${host}/?rollback=${msg}`);
  }
  return NextResponse.redirect(`http://${host}/`);
}
