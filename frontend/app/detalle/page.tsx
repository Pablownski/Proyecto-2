async function getData() {
  const res = await fetch(`${process.env.API_URL}/detalle`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h2>Detalle de Ventas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Venta</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: any, i: number) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td>{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}