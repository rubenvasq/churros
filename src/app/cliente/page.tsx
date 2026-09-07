import { auth } from "@/auth";
import { PanelShell } from "@/components/PanelShell";

export const dynamic = "force-dynamic";

export default async function ClientePage() {
  const session = await auth();
  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <h2 className="text-2xl font-bold text-gray-900">Bienvenido/a</h2>
      <p className="mt-2 text-gray-600">
        Aquí podrás ver el menú, añadir platos al carrito y hacer pedidos.
      </p>
      <p className="mt-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-800">
        🚧 Menú, carrito e historial de pedidos — en construcción.
      </p>
    </PanelShell>
  );
}
