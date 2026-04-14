async function getData() {
  const res = await fetch(`${process.env.API_URL}/top-productos`, { cache: "no-store" });
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h2>Top Productos</h2>
      <ul>
        {data.map((r: any, i: number) => (
          <li key={i}>{r[0]}</li>
        ))}
      </ul>
    </div>
  );
}