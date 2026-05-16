export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <div className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Bienvenido a la Tienda</h1>
        <p>Explora nuestro catálogo y agrega productos a tu carrito.</p>
      </div>

      <div className="grid-2">
        <a href="/productos" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '2rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '.3rem' }}>Productos</div>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Explora todo el catálogo disponible</div>
          </div>
        </a>
        <a href="/carrito" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', padding: '2rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '.3rem' }}>Carrito</div>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Revisa y confirma tu compra</div>
          </div>
        </a>
      </div>
    </>
  );
}
