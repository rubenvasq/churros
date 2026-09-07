import { cookies } from "next/headers";

export type ItemCarrito = { platoId: number; cantidad: number };

const COOKIE = "carrito";

/** Lee el carrito desde la cookie (se puede llamar en cualquier componente server). */
export async function leerCarrito(): Promise<ItemCarrito[]> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => typeof i?.platoId === "number" && typeof i?.cantidad === "number")
      .map((i) => ({ platoId: i.platoId, cantidad: i.cantidad }));
  } catch {
    return [];
  }
}

/** Guarda el carrito. Solo debe llamarse dentro de Server Actions o Route Handlers. */
export async function guardarCarrito(items: ItemCarrito[]): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

/** Vacía el carrito. */
export async function limpiarCarrito(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Nº total de unidades en el carrito. */
export async function contarCarrito(): Promise<number> {
  const items = await leerCarrito();
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}
