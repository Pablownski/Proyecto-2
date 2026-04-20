import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await fetch(`${process.env.API_URL}/venta`, { method: 'POST' });
  } catch (_) {}
  const host = request.headers.get('host') || 'localhost:3000';
  return NextResponse.redirect(`http://${host}/?success=1`);
}
