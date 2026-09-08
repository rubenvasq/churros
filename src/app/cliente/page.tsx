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
import { AgregarCarritoButton } from "./AgregarCarritoButton";
import { CarritoBadge } from "./CarritoBadge";

export const dynamic = "force-dynamic";

export default async function ClienteMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;

  const [session, platos, totalCarrito] = await Promise.all([
    auth(),
    prisma.plato.findMany({
      where: { cantidad: { gt: 0 } },
      orderBy: { nombre: "asc" },
    }),
    contarCarrito(),
  ]);

  // Categorías disponibles (a partir de tipoComida).
  const categorias = Array.from(
    new Set(platos.map((p) => p.tipoComida).filter((t): t is string => !!t)),
  ).sort();

  const filtrados = cat
    ? platos.filter((p) => p.tipoComida === cat)
    : platos;

  const chip = (activo: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      activo
        ? "bg-ink text-white"
        : "border border-line text-muted hover:border-ink/40 hover:text-ink"
    }`;

  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">Menú</h2>
        <div className="flex gap-3">
          <Link
            href="/cliente/pedidos"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            Mis pedidos
          </Link>
          <Link
            href="/cliente/resenas"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            Reseñas
          </Link>
          <Link
            href="/cliente/carrito"
            className="relative rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Carrito 🛒
            <CarritoBadge total={totalCarrito} />
          </Link>
        </div>
      </div>

      {/* Filtros por categoría */}
      {categorias.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/cliente" className={chip(!cat)}>
            Todo
          </Link>
          {categorias.map((c) => (
            <Link
              key={c}
              href={`/cliente?cat=${encodeURIComponent(c)}`}
              className={chip(cat === c)}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      {filtrados.length === 0 ? (
        <p className="text-muted">No hay platos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((plato) => {
            const oferta = estaEnOferta(plato);
            const precioFinal = precioConDescuento(plato);
            return (
              <article
                key={plato.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow"
              >
                <div className="relative">
                  {plato.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={plato.imagen}
                      alt={plato.nombre}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-accent-soft text-4xl">
                      🍲
                    </div>
                  )}
                  {oferta && (
                    <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                      -{plato.descuentoPorcentaje}%
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-ink">{plato.nombre}</h3>

                  {(plato.saludable || plato.vegano) && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {plato.saludable && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          🥗 Saludable
                        </span>
                      )}
                      {plato.vegano && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          🌱 Vegano
                        </span>
                      )}
                    </div>
                  )}

                  {plato.descripcion && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {plato.descripcion}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-accent">
                      {formatearPrecio(precioFinal)}
                    </span>
                    {oferta && (
                      <span className="text-sm text-muted line-through">
                        {formatearPrecio(Number(plato.precio))}
                      </span>
                    )}
                  </div>
                  <AgregarCarritoButton platoId={plato.id} nombre={plato.nombre} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
