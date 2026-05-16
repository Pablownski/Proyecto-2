import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.API_URL}/cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: body.name, email: body.email, phone: body.phone }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.API_URL}/cliente/${body.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: body.name, email: body.email, phone: body.phone }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
