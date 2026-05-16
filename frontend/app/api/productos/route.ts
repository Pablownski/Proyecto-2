import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host  = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const bp    = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const form  = await request.formData();
  const action = form.get('_action') as string;
  const redirectPath = (form.get('_redirect') as string) || '/productos';
  const base = `${proto}://${host}${bp}${redirectPath}`;

  const body = {
    name:        (form.get('name') as string)?.trim(),
    description: (form.get('description') as string)?.trim() || '',
    price:       parseFloat(form.get('price') as string),
    stock:       parseInt(form.get('stock') as string),
    category_id: parseInt(form.get('category_id') as string),
    supplier_id: parseInt(form.get('supplier_id') as string),
  };

  if (action !== 'eliminar') {
    if (!body.name || isNaN(body.price) || isNaN(body.stock)) {
      return NextResponse.redirect(`${base}?error=${encodeURIComponent('Nombre, precio y stock son obligatorios.')}&add=1`, { status: 303 });
    }
    if (body.price < 0 || body.stock < 0) {
      return NextResponse.redirect(`${base}?error=${encodeURIComponent('Precio y stock no pueden ser negativos.')}&add=1`, { status: 303 });
    }
  }

  try {
    if (action === 'crear') {
      const res = await fetch(`${process.env.API_URL}/producto`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}&add=1`, { status: 303 });
      }
      return NextResponse.redirect(`${base}?success=Producto+creado+exitosamente`, { status: 303 });
    }

    if (action === 'editar') {
      const id = form.get('id');
      const res = await fetch(`${process.env.API_URL}/producto/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}&edit=${id}`, { status: 303 });
      }
      return NextResponse.redirect(`${base}?success=Producto+actualizado+exitosamente`, { status: 303 });
    }

    if (action === 'eliminar') {
      const id = form.get('id');
      const res = await fetch(`${process.env.API_URL}/producto/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}`, { status: 303 });
      }
      return NextResponse.redirect(`${base}?success=Producto+eliminado`, { status: 303 });
    }
  } catch (e: unknown) {
    return NextResponse.redirect(`${base}?error=${encodeURIComponent(String(e))}`, { status: 303 });
  }

  return NextResponse.redirect(base, { status: 303 });
}
