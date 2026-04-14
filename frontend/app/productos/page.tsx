async function getData() {
  const res = await fetch(`${process.env.API_URL}/productos`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h2>Productos</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Producto</th><th>Categoría</th><th>Proveedor</th><th>Precio</th><th>Stock</th>
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