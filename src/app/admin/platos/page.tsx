import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { formatearPrecio, estaEnOferta } from "@/lib/platos";
import { EliminarPlatoButton } from "@/components/EliminarPlatoButton";

export const dynamic = "force-dynamic";

export default async function AdminPlatosPage() {
  const session = await auth();
  const platos = await prisma.plato.findMany({ orderBy: { nombre: "asc" } });

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-accent hover:underline">
            ← Panel
          </Link>
          <h2 className="text-2xl font-bold text-ink">Platos</h2>
        </div>
        <Link
          href="/admin/platos/nuevo"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Nuevo plato
        </Link>
      </div>

      {platos.length === 0 ? (
        <p className="rounded-lg bg-surface p-6 text-muted shadow">
          No hay platos registrados todavía.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-soft text-ink">
              <tr>
                <th className="px-4 py-3">Plato</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Oferta</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {platos.map((plato) => (
                <tr key={plato.id}>
                  <td className="px-4 py-3 font-medium text-ink">
                    {plato.nombre}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {plato.tipoComida ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatearPrecio(Number(plato.precio))}
                  </td>
                  <td className="px-4 py-3 text-muted">{plato.cantidad}</td>
                  <td className="px-4 py-3">
                    {estaEnOferta(plato) ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        -{plato.descuentoPorcentaje}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/platos/${plato.id}`}
                        className="text-sm font-medium text-accent hover:text-ink"
                      >
                        Editar
                      </Link>
                      <EliminarPlatoButton id={plato.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelShell>
  );
}
