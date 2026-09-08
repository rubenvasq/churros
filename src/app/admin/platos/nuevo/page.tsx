import Link from "next/link";
import { auth } from "@/auth";
import { PanelShell } from "@/components/PanelShell";
import { PlatoForm } from "@/components/PlatoForm";
import { crearPlato } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevoPlatoPage() {
  const session = await auth();

  return (
    <PanelShell titulo="Administración" usuario={session?.user}>
      <div className="mb-6">
        <Link
          href="/admin/platos"
          className="text-sm text-amber-700 hover:underline"
        >
          ← Platos
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Nuevo plato</h2>
      </div>
      <PlatoForm action={crearPlato} />
    </PanelShell>
  );
}
