import Link from "next/link";
import { auth } from "@/auth";
import { PanelShell } from "@/components/PanelShell";
import { filasReportePedidos } from "@/lib/reportes";

export const dynamic = "force-dynamic";

export default async function AdminReportesPage() {
  const session = await auth();
  const filas = await filasReportePedidos();

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-accent hover:underline">
          ← Panel
        </Link>
        <h2 className="text-2xl font-bold text-ink">Reportes</h2>
        <p className="mt-1 text-muted">
          {filas.length} pedido{filas.length === 1 ? "" : "s"} en total.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href="/admin/reportes/excel"
          className="flex items-center gap-4 rounded-2xl bg-surface p-6 shadow transition hover:shadow-md"
        >
          <span className="text-4xl">📊</span>
          <span>
            <span className="block font-semibold text-ink">
              Exportar a Excel
            </span>
            <span className="text-sm text-muted">
              Descarga un archivo .xlsx con todos los pedidos.
            </span>
          </span>
        </a>

        <Link
          href="/admin/reportes/pdf"
          target="_blank"
          className="flex items-center gap-4 rounded-2xl bg-surface p-6 shadow transition hover:shadow-md"
        >
          <span className="text-4xl">📄</span>
          <span>
            <span className="block font-semibold text-ink">
              Exportar a PDF
            </span>
            <span className="text-sm text-muted">
              Abre una vista imprimible; guárdala como PDF desde el navegador.
            </span>
          </span>
        </Link>
      </div>
    </PanelShell>
  );
}
