import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { crearResena } from "./actions";

export const dynamic = "force-dynamic";

export default async function ResenasClientePage() {
  const session = await auth();

  const cliente = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  // Platos que le fueron entregados al cliente (candidatos a reseñar).
  const entregados = cliente
    ? await prisma.pedido.findMany({
        where: { clienteId: cliente.id, estado: "entregado" },
        distinct: ["platoId"],
        include: { plato: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Reseñas que el cliente ya escribió.
  const misResenas = cliente
    ? await prisma.resena.findMany({
        where: { userId: cliente.id },
        include: { plato: { select: { nombre: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const yaResenados = new Set(misResenas.map((r) => r.platoId));
  const pendientes = entregados.filter((p) => !yaResenados.has(p.platoId));

  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[--color-ink]">Reseñas</h2>
        <Link
          href="/cliente"
          className="rounded-lg border border-[--color-line] px-4 py-2 text-sm font-medium text-[--color-accent] hover:bg-[--color-accent-soft]"
        >
          ← Volver al menú
        </Link>
      </div>

      <section className="mb-10">
        <h3 className="mb-3 text-lg font-semibold text-[--color-ink]">
          Platos por reseñar
        </h3>
        {pendientes.length === 0 ? (
          <p className="rounded-lg bg-[--color-surface] p-6 text-[--color-muted] shadow">
            No tienes platos entregados pendientes de reseñar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pendientes.map(({ plato }) => (
              <form
                key={plato.id}
                action={crearResena}
                className="rounded-2xl bg-[--color-surface] p-5 shadow"
              >
                <input type="hidden" name="platoId" value={plato.id} />
                <h4 className="font-semibold text-[--color-ink]">{plato.nombre}</h4>
                <label className="mt-3 block text-sm font-medium text-[--color-ink]">
                  Calificación
                </label>
                <select
                  name="calificacion"
                  defaultValue="5"
                  className="mt-1 w-full rounded-lg border border-[--color-line] px-3 py-2 text-sm"
                >
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★ (4)</option>
                  <option value="3">★★★ (3)</option>
                  <option value="2">★★ (2)</option>
                  <option value="1">★ (1)</option>
                </select>
                <label className="mt-3 block text-sm font-medium text-[--color-ink]">
                  Comentario
                </label>
                <textarea
                  name="comentario"
                  rows={2}
                  placeholder="¿Qué te pareció?"
                  className="mt-1 w-full rounded-lg border border-[--color-line] px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-[--color-ink] py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Enviar reseña
                </button>
              </form>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-[--color-ink]">Mis reseñas</h3>
        {misResenas.length === 0 ? (
          <p className="rounded-lg bg-[--color-surface] p-6 text-[--color-muted] shadow">
            Aún no has escrito ninguna reseña.
          </p>
        ) : (
          <div className="space-y-3">
            {misResenas.map((r) => (
              <div key={r.id} className="rounded-2xl bg-[--color-surface] p-5 shadow">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[--color-ink]">
                    {r.plato.nombre}
                  </h4>
                  <span className="text-[--color-accent]">
                    {"★".repeat(r.calificacion)}
                    <span className="text-[--color-line]">
                      {"★".repeat(5 - r.calificacion)}
                    </span>
                  </span>
                </div>
                {r.comentario && (
                  <p className="mt-1 text-sm text-[--color-muted]">{r.comentario}</p>
                )}
                <p className="mt-2 text-xs text-[--color-muted]">
                  {r.createdAt.toLocaleDateString("es-PE")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PanelShell>
  );
}
