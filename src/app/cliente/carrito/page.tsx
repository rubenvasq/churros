import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { leerCarrito } from "@/lib/carrito";
import { formatearPrecio, precioConDescuento } from "@/lib/platos";
import { cambiarCantidad, quitarDelCarrito, confirmarPedido } from "../actions";

export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  const session = await auth();
  const items = await leerCarrito();
  const platos = items.length
    ? await prisma.plato.findMany({
        where: { id: { in: items.map((i) => i.platoId) } },
      })
    : [];

  const lineas = items
    .map((item) => {
      const plato = platos.find((p) => p.id === item.platoId);
      if (!plato) return null;
      const precio = precioConDescuento(plato);
      return {
        plato,
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal: precio * item.cantidad,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const total = lineas.reduce((acc, l) => acc + l.subtotal, 0);

  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tu carrito</h2>
        <Link
          href="/cliente"
          className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
        >
          ← Seguir comprando
        </Link>
      </div>

      {lineas.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-gray-500 shadow">
          Tu carrito está vacío.{" "}
          <Link href="/cliente" className="text-amber-700 hover:underline">
            Ver el menú
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-4">
          <div className="divide-y rounded-2xl bg-white shadow">
            {lineas.map((l) => (
              <div key={l.plato.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{l.plato.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {formatearPrecio(l.precioUnitario)} c/u
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <form action={cambiarCantidad.bind(null, l.plato.id, l.cantidad - 1)}>
                    <button
                      type="submit"
                      className="h-8 w-8 rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100"
                      aria-label="Restar"
                    >
                      −
                    </button>
                  </form>
                  <span className="w-8 text-center font-medium">{l.cantidad}</span>
                  <form action={cambiarCantidad.bind(null, l.plato.id, l.cantidad + 1)}>
                    <button
                      type="submit"
                      className="h-8 w-8 rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100"
                      aria-label="Sumar"
                    >
                      +
                    </button>
                  </form>
                </div>

                <div className="w-24 text-right font-semibold text-amber-700">
                  {formatearPrecio(l.subtotal)}
                </div>

                <form action={quitarDelCarrito.bind(null, l.plato.id)}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow">
            <span className="text-lg font-medium text-gray-700">Total</span>
            <span className="text-2xl font-bold text-amber-700">
              {formatearPrecio(total)}
            </span>
          </div>

          <form action={confirmarPedido}>
            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 py-3 text-lg font-semibold text-white hover:bg-green-700"
            >
              Confirmar pedido
            </button>
          </form>
        </div>
      )}
    </PanelShell>
  );
}
