import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { filasReportePedidos } from "@/lib/reportes";
import { formatearPrecio } from "@/lib/platos";
import { BotonImprimir } from "./BotonImprimir";

export const dynamic = "force-dynamic";

export default async function ReportePdfPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const filas = await filasReportePedidos();
  const fecha = new Date().toLocaleString("es-PE");

  return (
    <div className="mx-auto max-w-4xl bg-surface p-10 text-ink">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent">El Rinconcito</h1>
          <h2 className="text-lg font-semibold">Reporte de pedidos</h2>
          <p className="text-sm text-muted">Generado el {fecha}</p>
        </div>
        <BotonImprimir />
      </div>

      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-line bg-accent-soft">
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Cliente</th>
            <th className="px-3 py-2">Plato</th>
            <th className="px-3 py-2">Cant.</th>
            <th className="px-3 py-2">Precio</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id} className="border-b border-line">
              <td className="px-3 py-2 text-muted">{f.id}</td>
              <td className="px-3 py-2">{f.cliente}</td>
              <td className="px-3 py-2 font-medium">{f.plato}</td>
              <td className="px-3 py-2">{f.cantidad}</td>
              <td className="px-3 py-2">
                {f.precio != null ? formatearPrecio(f.precio) : "—"}
              </td>
              <td className="px-3 py-2">{f.estado}</td>
              <td className="px-3 py-2 text-muted">{f.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filas.length === 0 && (
        <p className="mt-6 text-muted">No hay pedidos registrados.</p>
      )}
    </div>
  );
}
