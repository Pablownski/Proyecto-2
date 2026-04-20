import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const form = await request.formData();
  const action = form.get('_action') as string;
  const base = `http://${host}/gestion-clientes`;

  const body = {
    name:  (form.get('name') as string)?.trim(),
    email: (form.get('email') as string)?.trim(),
    phone: (form.get('phone') as string)?.trim(),
  };

  // Validación básica
  if (!body.name || !body.email || !body.phone) {
    return NextResponse.redirect(`${base}?error=${encodeURIComponent('Nombre, email y teléfono son obligatorios.')}&add=1`);
  }
  if (!body.email.includes('@')) {
    return NextResponse.redirect(`${base}?error=${encodeURIComponent('Email inválido.')}&add=1`);
  }

  try {
    if (action === 'crear') {
      const res = await fetch(`${process.env.API_URL}/cliente`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}&add=1`);
      }
      return NextResponse.redirect(`${base}?success=Cliente+creado+exitosamente`);
    }

    if (action === 'editar') {
      const id = form.get('id');
      const res = await fetch(`${process.env.API_URL}/cliente/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}&edit=${id}`);
      }
      return NextResponse.redirect(`${base}?success=Cliente+actualizado+exitosamente`);
    }

    if (action === 'eliminar') {
      const id = form.get('id');
      const res = await fetch(`${process.env.API_URL}/cliente/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        return NextResponse.redirect(`${base}?error=${encodeURIComponent(e.detail)}`);
      }
      return NextResponse.redirect(`${base}?success=Cliente+eliminado`);
    }
  } catch (e: any) {
    return NextResponse.redirect(`${base}?error=${encodeURIComponent(String(e))}`);
  }

  return NextResponse.redirect(base);
}
