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
          <Link href="/admin" className="text-sm text-amber-700 hover:underline">
            ← Panel
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Platos</h2>
        </div>
        <Link
          href="/admin/platos/nuevo"
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + Nuevo plato
        </Link>
      </div>

      {platos.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-gray-500 shadow">
          No hay platos registrados todavía.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-amber-50 text-amber-900">
              <tr>
                <th className="px-4 py-3">Plato</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Oferta</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {platos.map((plato) => (
                <tr key={plato.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {plato.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {plato.tipoComida ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatearPrecio(Number(plato.precio))}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{plato.cantidad}</td>
                  <td className="px-4 py-3">
                    {estaEnOferta(plato) ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        -{plato.descuentoPorcentaje}%
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/platos/${plato.id}`}
                        className="text-sm font-medium text-amber-700 hover:text-amber-900"
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
