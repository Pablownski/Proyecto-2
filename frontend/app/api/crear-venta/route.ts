export async function POST() {
  await fetch(`${process.env.API_URL}/venta`, {
    method: "POST"
  });

  return Response.redirect("/");
}