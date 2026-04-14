export async function POST() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta`, {
    method: "POST"
  });

  return Response.redirect("/");
}