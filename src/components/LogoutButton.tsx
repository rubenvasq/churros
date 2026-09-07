import { cerrarSesion } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={cerrarSesion}>
      <button
        type="submit"
        className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
