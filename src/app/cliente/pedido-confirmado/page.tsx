import Link from "next/link";
import { auth } from "@/auth";
import { PanelShell } from "@/components/PanelShell";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pedido confirmado" };

export default async function PedidoConfirmadoPage() {
  const session = await auth();

  return (
    <PanelShell titulo="Cliente" usuario={session?.user}>
      <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
        <div className="animate-pop flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl text-green-600">✓</span>
        </div>

        <h2 className="title-serif mt-8 text-3xl font-bold">
          ¡Pedido confirmado!
        </h2>
        <p className="mt-3 text-muted">
          Recibimos tu pedido y ya está en preparación. Puedes seguir su estado
          en cualquier momento desde “Mis pedidos”.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/cliente/pedidos"
            className="rounded-full bg-ink px-7 py-3 font-medium text-white transition hover:opacity-90"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/cliente"
            className="rounded-full border border-ink/20 px-7 py-3 font-medium transition hover:border-ink/50"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </PanelShell>
  );
}
