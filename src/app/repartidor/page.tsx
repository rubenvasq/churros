import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { formatearPrecio } from "@/lib/platos";
import { ESTADO_INFO } from "@/lib/pedidos";
import { marcarEntregado } from "./actions";

export const dynamic = "force-dynamic";

export default async function RepartidorPage() {
  const session = await auth();

  const pedidos = await prisma.pedido.findMany({
    where: { estado: "listo" },
    include: { plato: true, cliente: { select: { name: true, telefono: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <PanelShell titulo="Repartidor" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[--color-ink]">Repartos</h2>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
          {pedidos.length} listos
        </span>
      </div>

      {pedidos.length === 0 ? (
        <p className="rounded-lg bg-[--color-surface] p-6 text-[--color-muted] shadow">
          No hay pedidos listos para entregar.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => {
            const info = ESTADO_INFO[pedido.estado];
            return (
              <article
                key={pedido.id}
                className="flex flex-col rounded-2xl bg-[--color-surface] p-5 shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[--color-ink]">
                    {pedido.plato.nombre}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.clase}`}
                  >
                    {info.texto}
                  </span>
                </div>
                <dl className="mt-3 space-y-1 text-sm text-[--color-muted]">
                  <div className="flex justify-between">
                    <dt>Cantidad</dt>
                    <dd className="font-medium text-[--color-ink]">
                      ×{pedido.cantidad}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cliente</dt>
                    <dd>{pedido.cliente.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Teléfono</dt>
                    <dd>{pedido.cliente.telefono ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Fecha</dt>
                    <dd>{pedido.createdAt.toLocaleString("es-PE")}</dd>
                  </div>
                </dl>
                <form
                  action={marcarEntregado.bind(null, pedido.id)}
                  className="mt-4"
                >
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Marcar como entregado 🚚
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
