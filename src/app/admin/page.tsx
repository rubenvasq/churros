import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  const [usuarios, platos, pedidos, entregados] = await Promise.all([
    prisma.user.count(),
    prisma.plato.count(),
    prisma.pedido.count(),
    prisma.pedido.count({ where: { estado: "entregado" } }),
  ]);

  const tarjetas = [
    { etiqueta: "Usuarios", valor: usuarios, icono: "👥" },
    { etiqueta: "Platos", valor: platos, icono: "🍲" },
    { etiqueta: "Pedidos", valor: pedidos, icono: "🧾" },
    { etiqueta: "Entregados", valor: entregados, icono: "✅" },
  ];

  const accesos = [
    {
      href: "/admin/platos",
      titulo: "Gestión de platos",
      texto: "Crear, editar y eliminar platos del menú y sus ofertas.",
      icono: "🍲",
    },
    {
      href: "/admin/pedidos",
      titulo: "Pedidos",
      texto: "Ver todos los pedidos y su estado.",
      icono: "🧾",
    },
    {
      href: "/admin/reportes",
      titulo: "Reportes",
      texto: "Exportar pedidos a Excel o PDF.",
      icono: "📊",
    },
  ];

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <h2 className="text-2xl font-bold text-[--color-ink]">Panel de administración</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className="rounded-2xl bg-[--color-surface] p-6 shadow">
            <div className="text-3xl">{t.icono}</div>
            <div className="mt-2 text-3xl font-bold text-[--color-accent]">{t.valor}</div>
            <div className="text-sm text-[--color-muted]">{t.etiqueta}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {accesos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group rounded-2xl bg-[--color-surface] p-6 shadow transition hover:shadow-md"
          >
            <div className="text-3xl">{a.icono}</div>
            <div className="mt-2 font-semibold text-[--color-ink] group-hover:text-[--color-accent]">
              {a.titulo}
            </div>
            <p className="mt-1 text-sm text-[--color-muted]">{a.texto}</p>
          </Link>
        ))}
      </div>
    </PanelShell>
  );
}
