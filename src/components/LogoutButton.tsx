import { cerrarSesion } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={cerrarSesion}>
      <button
        type="submit"
        className="rounded-full border border-[--color-line] px-4 py-1.5 text-sm font-medium text-[--color-muted] transition hover:border-[--color-ink]/40 hover:text-[--color-ink]"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
