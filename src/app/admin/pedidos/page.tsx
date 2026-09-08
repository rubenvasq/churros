import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { formatearPrecio } from "@/lib/platos";
import { ESTADO_INFO } from "@/lib/pedidos";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const session = await auth();
  const pedidos = await prisma.pedido.findMany({
    include: { plato: true, cliente: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-accent hover:underline">
            ← Panel
          </Link>
          <h2 className="text-2xl font-bold text-ink">Todos los pedidos</h2>
        </div>
        <Link
          href="/admin/reportes"
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
        >
          Exportar 📊
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <p className="rounded-lg bg-surface p-6 text-muted shadow">
          No hay pedidos registrados.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-soft text-ink">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Plato</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pedidos.map((pedido) => {
                const info = ESTADO_INFO[pedido.estado];
                return (
                  <tr key={pedido.id}>
                    <td className="px-4 py-3 text-muted">{pedido.id}</td>
                    <td className="px-4 py-3 text-ink">
                      {pedido.cliente.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {pedido.plato.nombre}
                    </td>
                    <td className="px-4 py-3 text-muted">{pedido.cantidad}</td>
                    <td className="px-4 py-3 text-muted">
                      {pedido.precioConDescuento != null
                        ? formatearPrecio(Number(pedido.precioConDescuento))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.clase}`}
                      >
                        {info.texto}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {pedido.createdAt.toLocaleString("es-PE")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PanelShell>
  );
}
