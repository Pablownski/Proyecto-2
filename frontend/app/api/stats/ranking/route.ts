import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/ranking`);
  const data = await res.json();
  if (!Array.isArray(data)) return NextResponse.json(data, { status: res.status });
  const mapped = data.map(([name, total_vendido]: [string, number]) => ({ name, total_vendido }));
  return NextResponse.json(mapped, { status: res.status });
}
