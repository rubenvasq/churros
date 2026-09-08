"use client";

import { useActionState } from "react";
import { crearUsuario, type EstadoUsuario } from "./actions";

const estadoInicial: EstadoUsuario = {};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export function CrearUsuarioForm() {
  const [estado, accion, pendiente] = useActionState(crearUsuario, estadoInicial);

  return (
    <form action={accion} className="space-y-4 rounded-2xl bg-surface p-6 shadow">
      <h3 className="title-serif text-lg font-bold">Crear usuario</h3>
      <p className="text-sm text-muted">
        Da de alta chefs, repartidores u otros administradores.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Nombre</label>
          <input name="name" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Correo</label>
          <input name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Contraseña</label>
          <input name="password" type="password" required minLength={6} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Rol</label>
          <select name="role" defaultValue="chef" className={inputCls}>
            <option value="cliente">Cliente</option>
            <option value="chef">Chef</option>
            <option value="repartidor">Repartidor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      {estado.ok && (
        <p className="rounded-xl bg-green-100 px-4 py-2.5 text-sm text-green-700">
          {estado.ok}
        </p>
      )}
      {estado.error && (
        <p className="rounded-xl bg-accent-soft px-4 py-2.5 text-sm text-accent">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pendiente ? "Creando…" : "Crear usuario"}
      </button>
    </form>
  );
}
