import { auth } from "@/auth";
import { PanelShell } from "@/components/PanelShell";

export const dynamic = "force-dynamic";

export default async function RepartidorPage() {
  const session = await auth();
  return (
    <PanelShell titulo="Repartidor" usuario={session?.user}>
      <h2 className="text-2xl font-bold text-gray-900">Repartos</h2>
      <p className="mt-2 text-gray-600">
        Aquí verás los pedidos listos y podrás marcarlos como entregados.
      </p>
      <p className="mt-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-800">
        🚧 Gestión de entregas — en construcción.
      </p>
    </PanelShell>
  );
}
