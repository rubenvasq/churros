import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { panelPara } from "@/lib/roles";
import { formatearPrecio, estaEnOferta, precioConDescuento } from "@/lib/platos";

// La página consulta la BD, así que se renderiza en cada petición.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  const platos = await prisma.plato.findMany({
    where: { cantidad: { gt: 0 } },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="min-h-screen bg-amber-50">
      <header className="flex items-center justify-between bg-amber-600 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">El Rinconcito 🍽️</h1>
        <nav>
          {session?.user ? (
            <Link
              href={panelPara(session.user.role)}
              className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30"
            >
              Mi panel
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold text-amber-900">Nuestro menú</h2>

        {platos.length === 0 ? (
          <p className="text-gray-500">
            No hay platos disponibles por ahora. Vuelve pronto. 🙂
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platos.map((plato) => {
              const oferta = estaEnOferta(plato);
              const precioFinal = precioConDescuento(plato);
              return (
                <article
                  key={plato.id}
                  className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-md"
                >
                  {plato.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={plato.imagen}
                      alt={plato.nombre}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-amber-100 text-4xl">
                      🍲
                    </div>
                  )}
                  <div className="p-4">
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
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
