"use client";

export function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-white hover:opacity-90 print:hidden"
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
