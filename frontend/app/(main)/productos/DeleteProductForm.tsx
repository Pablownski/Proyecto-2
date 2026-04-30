'use client';

export default function DeleteProductForm({ id }: { id: number }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('¿Eliminar este producto?')) {
      e.preventDefault();
    }
  };

  return (
    <form action="/api/productos" method="post" style={{ display: 'inline' }} onSubmit={handleSubmit}>
      <input type="hidden" name="_action" value="eliminar" />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">🗑 Eliminar</button>
    </form>
  );
}
