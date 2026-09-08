import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { panelPara } from "@/lib/roles";
import { formatearPrecio, estaEnOferta, precioConDescuento } from "@/lib/platos";

// La página consulta la BD, así que se renderiza en cada petición.
export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80";

export default async function HomePage() {
  const session = await auth();

  const platos = await prisma.plato.findMany({
    where: { cantidad: { gt: 0 } },
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* ---- Barra superior ---- */}
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="title-serif text-xl font-bold tracking-tight">
            El Rinconcito
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#menu" className="hidden text-muted hover:text-ink sm:inline">
              Menú
            </a>
            {session?.user ? (
              <Link
                href={panelPara(session.user.role)}
                className="rounded-full bg-ink px-5 py-2 font-medium text-white transition hover:opacity-90"
              >
                Mi panel
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-ink px-5 py-2 font-medium text-white transition hover:opacity-90"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="grain">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow text-accent">Cocina peruana · Hecho al momento</p>
            <h1 className="title-serif mt-5 text-5xl font-bold sm:text-6xl lg:text-7xl">
              Sabor de casa,
              <br />
              <span className="italic text-accent">servido con calma.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Ingredientes frescos y recetas de siempre. Explora nuestra carta y
              pide en unos pocos toques.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="rounded-full bg-ink px-7 py-3 font-medium text-white transition hover:opacity-90"
              >
                Ver el menú
              </a>
              <Link
                href="/login"
                className="rounded-full border border-ink/20 px-7 py-3 font-medium transition hover:border-ink/50"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMG}
                alt="Mesa servida"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-surface px-5 py-4 shadow-lg sm:block">
              <p className="title-serif text-2xl font-bold">{platos.length}</p>
              <p className="text-xs text-muted">platos en carta</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Menú ---- */}
      <section id="menu" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between border-b border-line pb-6">
          <div>
            <p className="eyebrow text-accent">Nuestra carta</p>
            <h2 className="title-serif mt-2 text-4xl font-bold">El menú</h2>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            Precios en soles (S/)
          </p>
        </div>

        {platos.length === 0 ? (
          <p className="text-muted">
            No hay platos disponibles por ahora. Vuelve pronto. 🙂
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {platos.map((plato) => {
              const oferta = estaEnOferta(plato);
              const precioFinal = precioConDescuento(plato);
              return (
                <article key={plato.id} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-accent-soft">
                    {plato.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={plato.imagen}
                        alt={plato.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl">
                        🍲
                      </div>
                    )}
                    {oferta && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                        -{plato.descuentoPorcentaje}%
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="title-serif text-lg font-bold">
                        {plato.nombre}
                      </h3>
                      {plato.tipoComida && (
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
                          {plato.tipoComida}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block font-semibold text-accent">
                        {formatearPrecio(precioFinal)}
                      </span>
                      {oferta && (
                        <span className="text-xs text-muted line-through">
                          {formatearPrecio(Number(plato.precio))}
                        </span>
                      )}
                    </div>
                  </div>
                  {plato.descripcion && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {plato.descripcion}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---- CTA final ---- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="title-serif text-3xl font-bold sm:text-4xl">
            ¿Con hambre? Empieza tu pedido.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Inicia sesión para armar tu carrito y seguir tu pedido en tiempo real.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-block rounded-full bg-ink px-8 py-3 font-medium text-white transition hover:opacity-90"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="mt-auto border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-muted sm:flex-row">
          <span className="title-serif text-base font-bold text-ink">
            El Rinconcito
          </span>
          <span>© {new Date().getFullYear()} · Cocina peruana</span>
        </div>
      </footer>
    </div>
  );
}
