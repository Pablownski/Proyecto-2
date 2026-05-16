'use client';

export default function DeleteProductForm({ id, redirectTo = '/productos' }: { id: number; redirectTo?: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('¿Eliminar este producto?')) e.preventDefault();
  };

  return (
    <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/productos`} method="post" style={{ display: 'inline' }} onSubmit={handleSubmit}>
      <input type="hidden" name="_action" value="eliminar" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="_redirect" value={redirectTo} />
      <button type="submit" className="btn btn-danger btn-sm">Eliminar</button>
    </form>
  );
}
