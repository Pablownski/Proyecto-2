import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.API_URL}/producto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      stock: Number(body.stock),
      category_id: Number(body.category_id),
      supplier_id: Number(body.supplier_id),
    }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.API_URL}/producto/${body.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      stock: Number(body.stock),
      category_id: Number(body.category_id),
      supplier_id: Number(body.supplier_id),
    }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
