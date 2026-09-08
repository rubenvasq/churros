"use client";

import { useActionState } from "react";
import Link from "next/link";
import { autenticar, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = {};

const LOGIN_IMG =
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80";

export default function LoginPage() {
  const [estado, formAction, pendiente] = useActionState(autenticar, estadoInicial);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Imagen lateral (solo en pantallas grandes) */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGIN_IMG}
          alt="Cocina"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <p className="eyebrow">El Rinconcito</p>
          <p className="title-serif mt-2 max-w-xs text-3xl font-bold">
            Bienvenido de vuelta a la mesa.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="title-serif text-2xl font-bold tracking-tight"
          >
            El Rinconcito
          </Link>
          <h1 className="mt-8 text-2xl font-semibold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-[--color-muted]">
            Ingresa tus datos para continuar.
          </p>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[--color-ink]"
              >
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-[--color-line] bg-[--color-surface] px-4 py-2.5 text-[--color-ink] outline-none transition focus:border-[--color-accent] focus:ring-2 focus:ring-[--color-accent]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[--color-ink]"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-xl border border-[--color-line] bg-[--color-surface] px-4 py-2.5 text-[--color-ink] outline-none transition focus:border-[--color-accent] focus:ring-2 focus:ring-[--color-accent]/20"
              />
            </div>

            {estado.error && (
              <p className="rounded-xl bg-[--color-accent-soft] px-4 py-2.5 text-sm text-[--color-accent]">
                {estado.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pendiente}
              className="w-full rounded-full bg-[--color-ink] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {pendiente ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[--color-muted]">
            <Link href="/" className="hover:text-[--color-ink]">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
