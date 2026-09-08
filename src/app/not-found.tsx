import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-accent">Error 404</p>
      <h1 className="title-serif mt-4 text-6xl font-bold">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-muted">
        Puede que el enlace esté roto o que la página se haya movido. Volvamos a
        un lugar seguro.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-8 py-3 font-medium text-white transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
