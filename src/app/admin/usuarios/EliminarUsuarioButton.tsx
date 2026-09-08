"use client";

import { eliminarUsuario } from "./actions";

export function EliminarUsuarioButton({ id }: { id: number }) {
  return (
    <form
      action={eliminarUsuario.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
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
