export default function Home() {
  return (
    <div>
      <h1>Dashboard Tienda</h1>

      <ul>
        <li><a href="/ventas">Ventas</a></li>
        <li><a href="/detalle">Detalle Ventas</a></li>
        <li><a href="/productos">Productos</a></li>
        <li><a href="/ranking">Ranking Productos</a></li>
        <li><a href="/clientes">Clientes Top</a></li>
        <li><a href="/top-productos">Top Productos (Subquery)</a></li>
        <li><a href="/reporte">Reporte (VIEW)</a></li>
      </ul>

      <form action="/api/crear-venta" method="post">
        <button type="submit">Crear Venta (Transacción)</button>
      </form>
    </div>
  );
}