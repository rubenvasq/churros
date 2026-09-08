"use client";

import { eliminarPlato } from "@/app/admin/platos/actions";

export function EliminarPlatoButton({ id }: { id: number }) {
  return (
    <form
      action={eliminarPlato.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este plato? Esta acción no se puede deshacer.")) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Eliminar
      </button>
    </form>
  );
}
