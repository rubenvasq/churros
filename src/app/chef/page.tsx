import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { formatearPrecio } from "@/lib/platos";
import { ESTADO_INFO } from "@/lib/pedidos";
import { marcarListo } from "./actions";

export const dynamic = "force-dynamic";

export default async function ChefPage() {
  const session = await auth();

  const pedidos = await prisma.pedido.findMany({
    where: { estado: "en_espera" },
    include: { plato: true, cliente: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <PanelShell titulo="Chef" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Cocina</h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
          {pedidos.length} en espera
        </span>
      </div>

      {pedidos.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-gray-500 shadow">
          No hay pedidos en espera. ¡Todo al día! 🎉
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => {
            const info = ESTADO_INFO[pedido.estado];
            return (
              <article
                key={pedido.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {pedido.plato.nombre}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.clase}`}
                  >
                    {info.texto}
                  </span>
                </div>
                <dl className="mt-3 space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <dt>Cantidad</dt>
                    <dd className="font-medium text-gray-900">
                      ×{pedido.cantidad}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Cliente</dt>
                    <dd>{pedido.cliente.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Precio</dt>
                    <dd>
                      {pedido.precioConDescuento != null
                        ? formatearPrecio(Number(pedido.precioConDescuento))
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Fecha</dt>
                    <dd>{pedido.createdAt.toLocaleString("es-PE")}</dd>
                  </div>
                </dl>
                <form action={marcarListo.bind(null, pedido.id)} className="mt-4">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Marcar como listo ✓
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
