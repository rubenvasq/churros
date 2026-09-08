import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { PlatoForm } from "@/components/PlatoForm";
import { actualizarPlato } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarPlatoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const platoId = Number(id);
  if (Number.isNaN(platoId)) notFound();

  const [session, plato] = await Promise.all([
    auth(),
    prisma.plato.findUnique({ where: { id: platoId } }),
  ]);
  if (!plato) notFound();

  const action = actualizarPlato.bind(null, plato.id);

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6">
        <Link
          href="/admin/platos"
          className="text-sm text-accent hover:underline"
        >
          ← Platos
        </Link>
        <h2 className="text-2xl font-bold text-ink">
          Editar: {plato.nombre}
        </h2>
      </div>
      <PlatoForm action={action} plato={plato} />
    </PanelShell>
  );
}
