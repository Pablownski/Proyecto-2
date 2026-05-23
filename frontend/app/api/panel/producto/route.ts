import { NextResponse } from 'next/server';

const API = process.env.API_URL;

export async function POST(req: Request) {
  const body = await req.json();
  const res  = await fetch(`${API}/orm/producto`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: Request) {
  const { id, ...body } = await req.json();
  const res = await fetch(`${API}/orm/producto/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const res = await fetch(`${API}/orm/producto/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
