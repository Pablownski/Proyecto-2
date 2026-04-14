async function getData() {
  const res = await fetch(`${process.env.API_URL}/reporte`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h2>Reporte de Ventas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: any, i: number) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}