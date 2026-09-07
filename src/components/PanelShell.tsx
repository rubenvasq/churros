import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export function PanelShell({
  titulo,
  usuario,
  children,
}: {
  titulo: string;
  usuario?: { name?: string | null; role?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-amber-600 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold">
            El Rinconcito
          </Link>
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-sm">{titulo}</span>
        </div>
        <div className="flex items-center gap-4">
          {usuario?.name && (
            <span className="hidden text-sm sm:inline">
              {usuario.name}
              {usuario.role ? ` · ${usuario.role}` : ""}
            </span>
          )}
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
