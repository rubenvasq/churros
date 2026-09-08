import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { auth } from "@/auth";
import { filasReportePedidos } from "@/lib/reportes";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return new NextResponse("No autorizado", { status: 403 });
  }

  const filas = await filasReportePedidos();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "El Rinconcito";
  const hoja = workbook.addWorksheet("Pedidos");

  hoja.columns = [
    { header: "#", key: "id", width: 8 },
    { header: "Cliente", key: "cliente", width: 25 },
    { header: "Plato", key: "plato", width: 30 },
    { header: "Cantidad", key: "cantidad", width: 12 },
    { header: "Precio (S/)", key: "precio", width: 14 },
    { header: "Estado", key: "estado", width: 14 },
    { header: "Fecha", key: "fecha", width: 22 },
  ];

  hoja.getRow(1).font = { bold: true };
  hoja.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFDE68A" },
  };

  filas.forEach((f) => hoja.addRow(f));

  const buffer = await workbook.xlsx.writeBuffer();
  const fecha = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="pedidos-${fecha}.xlsx"`,
    },
  });
}
