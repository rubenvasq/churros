import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { contarCarrito } from "@/lib/carrito";
import {
  formatearPrecio,
  estaEnOferta,
  precioConDescuento,
} from "@/lib/platos";
import { agregarAlCarrito } from "./actions";

export const dynamic = "force-dynamic";

export default async function ClienteMenuPage() {
  const session = await auth();
  const [platos, totalCarrito] = await Promise.all([
    prisma.plato.findMany({
      where: { cantidad: { gt: 0 } },
      orderBy: { nombre: "asc" },
    }),
    contarCarrito(),
  ]);

  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menú</h2>
        <div className="flex gap-3">
          <Link
            href="/cliente/pedidos"
            className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
          >
            Mis pedidos
          </Link>
          <Link
            href="/cliente/carrito"
            className="relative rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Carrito 🛒
            {totalCarrito > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                {totalCarrito}
              </span>
            )}
          </Link>
        </div>
      </div>

      {platos.length === 0 ? (
        <p className="text-gray-500">No hay platos disponibles por ahora.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platos.map((plato) => {
            const oferta = estaEnOferta(plato);
            const precioFinal = precioConDescuento(plato);
            return (
              <article
                key={plato.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow"
              >
                {plato.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={plato.imagen}
                    alt={plato.nombre}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-amber-100 text-4xl">
                    🍲
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{plato.nombre}</h3>
                    {oferta && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        -{plato.descuentoPorcentaje}%
                      </span>
                    )}
                  </div>
                  {plato.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {plato.descripcion}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-amber-700">
                      {formatearPrecio(precioFinal)}
                    </span>
                    {oferta && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatearPrecio(Number(plato.precio))}
                      </span>
                    )}
                  </div>
                  <form action={agregarAlCarrito.bind(null, plato.id)} className="mt-4">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      Añadir al carrito
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
