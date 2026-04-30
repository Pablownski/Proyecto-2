export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/reporte`, { cache: 'no-store' });
  const data: any[] = await res.json();

  const header = 'ID,Cliente,Total (Q),Fecha\n';
  const rows = data.map((r) => {
    const fecha = new Date(r[3]).toLocaleString('es-GT');
    const cliente = String(r[1]).replace(/"/g, '""');
    return `${r[0]},"${cliente}",${Number(r[2]).toFixed(2)},"${fecha}"`;
  }).join('\n');

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="reporte_ventas.csv"',
    },
  });
}
