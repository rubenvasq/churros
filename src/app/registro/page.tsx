"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrar, type EstadoRegistro } from "./actions";

const estadoInicial: EstadoRegistro = {};

const IMG =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export default function RegistroPage() {
  const [estado, formAction, pendiente] = useActionState(registrar, estadoInicial);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG} alt="Cocina" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <p className="eyebrow">El Rinconcito</p>
          <p className="title-serif mt-2 max-w-xs text-3xl font-bold">
            Únete y pide en minutos.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="title-serif text-2xl font-bold tracking-tight">
            El Rinconcito
          </Link>
          <h1 className="mt-8 text-2xl font-semibold">Crear cuenta</h1>
          <p className="mt-1 text-sm text-muted">
            Regístrate como cliente para hacer pedidos.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">
                Nombre completo
              </label>
              <input id="name" name="name" required autoComplete="name" className={inputCls} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Correo
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-ink">
                Teléfono <span className="text-muted">(opcional)</span>
              </label>
              <input id="telefono" name="telefono" autoComplete="tel" className={inputCls} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className={inputCls}
              />
            </div>

            {estado.error && (
              <p className="rounded-xl bg-accent-soft px-4 py-2.5 text-sm text-accent">
                {estado.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pendiente}
              className="w-full rounded-full bg-ink py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {pendiente ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
