"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-accent">Algo salió mal</p>
      <h1 className="title-serif mt-4 text-5xl font-bold">Ups, un problema</h1>
      <p className="mt-4 max-w-md text-muted">
        Ocurrió un error inesperado. Puedes reintentar o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-ink px-8 py-3 font-medium text-white transition hover:opacity-90"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-ink/20 px-8 py-3 font-medium transition hover:border-ink/50"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
