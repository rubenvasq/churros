import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  const [usuarios, platos, pedidos] = await Promise.all([
    prisma.user.count(),
    prisma.plato.count(),
    prisma.pedido.count(),
  ]);

  const tarjetas = [
    { etiqueta: "Usuarios", valor: usuarios, icono: "👥" },
    { etiqueta: "Platos", valor: platos, icono: "🍲" },
    { etiqueta: "Pedidos", valor: pedidos, icono: "🧾" },
  ];

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <h2 className="text-2xl font-bold text-gray-900">Panel de administración</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className="rounded-2xl bg-white p-6 shadow">
            <div className="text-3xl">{t.icono}</div>
            <div className="mt-2 text-3xl font-bold text-amber-700">{t.valor}</div>
            <div className="text-sm text-gray-500">{t.etiqueta}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-800">
        🚧 Gestión de platos/usuarios y reportes PDF/Excel — en construcción.
      </p>
    </PanelShell>
  );
}
