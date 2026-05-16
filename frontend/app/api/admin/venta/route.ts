import { NextResponse } from 'next/server';

export async function POST() {
  const res = await fetch(`${process.env.API_URL}/venta`, { method: 'POST' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
