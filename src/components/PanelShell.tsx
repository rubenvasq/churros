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
  const inicial = usuario?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-[--color-line] bg-[--color-bg]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="title-serif text-xl font-bold tracking-tight"
            >
              El Rinconcito
            </Link>
            <span className="hidden rounded-full border border-[--color-line] px-3 py-0.5 text-xs uppercase tracking-wide text-[--color-muted] sm:inline">
              {titulo}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {usuario?.name && (
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[--color-accent] text-sm font-semibold text-white">
                  {inicial}
                </span>
                <span className="hidden text-sm leading-tight sm:block">
                  <span className="block font-medium">{usuario.name}</span>
                  {usuario.role && (
                    <span className="text-xs text-[--color-muted]">
                      {usuario.role}
                    </span>
                  )}
                </span>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
