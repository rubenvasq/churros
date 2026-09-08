import { cerrarSesion } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={cerrarSesion}>
      <button
        type="submit"
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-muted transition hover:border-ink/40 hover:text-ink"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
