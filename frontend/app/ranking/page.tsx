async function getData() {
  const res = await fetch(`${process.env.API_URL}/ranking`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h2>Ranking Productos</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Producto</th><th>Total Vendido</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: any, i: number) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}