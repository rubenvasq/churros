import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/PanelShell";
import { PerfilForms } from "./PerfilForms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mi perfil" };

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, telefono: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <PanelShell titulo="Mi perfil" usuario={session.user}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Mi perfil</h2>
        <p className="mt-1 text-sm text-muted">
          Rol: <span className="font-medium capitalize">{user.role}</span>
        </p>
      </div>
      <PerfilForms
        nombre={user.name}
        telefono={user.telefono ?? ""}
        email={user.email}
      />
    </PanelShell>
  );
}
