"use client";

import { useState, useTransition } from "react";
import { agregarAlCarrito } from "./actions";

export function AgregarCarritoButton({ platoId }: { platoId: number }) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleClick() {
    startTransition(async () => {
      await agregarAlCarrito(platoId);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white transition disabled:opacity-70 ${
        added ? "animate-pop bg-green-600" : "bg-ink hover:opacity-90"
      }`}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Añadiendo…
        </>
      ) : added ? (
        <>✓ Añadido</>
      ) : (
        <>Añadir al carrito</>
      )}
    </button>
  );
}
