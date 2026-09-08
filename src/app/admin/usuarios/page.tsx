import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { CrearUsuarioForm } from "./CrearUsuarioForm";
import { EliminarUsuarioButton } from "./EliminarUsuarioButton";
import { cambiarRol } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Usuarios" };

export default async function AdminUsuariosPage() {
  const session = await auth();

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      telefono: true,
    },
  });

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-accent hover:underline">
          ← Panel
        </Link>
        <h2 className="text-2xl font-bold text-ink">Usuarios</h2>
      </div>

      <div className="mb-8">
        <CrearUsuarioForm />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-surface shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-accent-soft text-ink">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3 text-muted">{u.telefono ?? "—"}</td>
                <td className="px-4 py-3">
                  <form
                    action={cambiarRol.bind(null, u.id)}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-sm"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="chef">Chef</option>
                      <option value="repartidor">Repartidor</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg border border-line px-3 py-1 text-xs font-medium text-accent hover:bg-accent-soft"
                    >
                      Guardar
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <EliminarUsuarioButton id={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
