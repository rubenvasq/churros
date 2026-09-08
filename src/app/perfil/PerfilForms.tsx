"use client";

import { useActionState } from "react";
import {
  actualizarPerfil,
  cambiarPassword,
  type EstadoPerfil,
} from "./actions";

const estadoInicial: EstadoPerfil = {};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

function Aviso({ estado }: { estado: EstadoPerfil }) {
  if (estado.ok) {
    return (
      <p className="rounded-xl bg-green-100 px-4 py-2.5 text-sm text-green-700">
        {estado.ok}
      </p>
    );
  }
  if (estado.error) {
    return (
      <p className="rounded-xl bg-accent-soft px-4 py-2.5 text-sm text-accent">
        {estado.error}
      </p>
    );
  }
  return null;
}

export function PerfilForms({
  nombre,
  telefono,
  email,
}: {
  nombre: string;
  telefono: string;
  email: string;
}) {
  const [estadoDatos, accionDatos, pendDatos] = useActionState(
    actualizarPerfil,
    estadoInicial,
  );
  const [estadoPass, accionPass, pendPass] = useActionState(
    cambiarPassword,
    estadoInicial,
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Datos personales */}
      <form
        action={accionDatos}
        className="space-y-4 rounded-2xl bg-surface p-6 shadow"
      >
        <h3 className="title-serif text-lg font-bold">Datos personales</h3>

        <div>
          <label className="block text-sm font-medium text-ink">Correo</label>
          <input
            value={email}
            disabled
            className={`${inputCls} cursor-not-allowed opacity-60`}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink">
            Nombre
          </label>
          <input id="name" name="name" defaultValue={nombre} required className={inputCls} />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-ink">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            defaultValue={telefono}
            className={inputCls}
          />
        </div>

        <Aviso estado={estadoDatos} />

        <button
          type="submit"
          disabled={pendDatos}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pendDatos ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      {/* Cambio de contraseña */}
      <form
        action={accionPass}
        className="space-y-4 rounded-2xl bg-surface p-6 shadow"
      >
        <h3 className="title-serif text-lg font-bold">Cambiar contraseña</h3>

        <div>
          <label htmlFor="actual" className="block text-sm font-medium text-ink">
            Contraseña actual
          </label>
          <input
            id="actual"
            name="actual"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="nueva" className="block text-sm font-medium text-ink">
            Nueva contraseña
          </label>
          <input
            id="nueva"
            name="nueva"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={inputCls}
          />
        </div>

        <Aviso estado={estadoPass} />

        <button
          type="submit"
          disabled={pendPass}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pendPass ? "Actualizando…" : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}
