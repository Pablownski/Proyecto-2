import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const session_token = (await cookies()).get('session_token')?.value ?? null;
  const res = await fetch(`${process.env.API_URL}/compra`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, session_token }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
