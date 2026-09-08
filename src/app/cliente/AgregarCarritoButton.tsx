"use client";

import { useState, useTransition } from "react";
import { agregarAlCarrito } from "./actions";

export function AgregarCarritoButton({
  platoId,
  nombre,
}: {
  platoId: number;
  nombre?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  function handleClick() {
    startTransition(async () => {
      await agregarAlCarrito(platoId);
      setAdded(true);
      setToast(true);
      setTimeout(() => setAdded(false), 1600);
      setTimeout(() => setToast(false), 2600);
    });
  }

  return (
    <>
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

      {toast && (
        <div className="animate-toast fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-sm text-white shadow-xl">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs">
            ✓
          </span>
          <span>
            Añadido al carrito
            {nombre ? (
              <>
                : <span className="font-semibold">{nombre}</span>
              </>
            ) : null}
          </span>
        </div>
      )}
    </>
  );
}
