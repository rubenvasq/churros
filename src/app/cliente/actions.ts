"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  leerCarrito,
  guardarCarrito,
  limpiarCarrito,
} from "@/lib/carrito";
import { precioConDescuento } from "@/lib/platos";

export async function agregarAlCarrito(platoId: number) {
  const items = await leerCarrito();
  const existente = items.find((i) => i.platoId === platoId);
  if (existente) {
    existente.cantidad += 1;
  } else {
    items.push({ platoId, cantidad: 1 });
  }
  await guardarCarrito(items);
  revalidatePath("/cliente");
}

export async function cambiarCantidad(platoId: number, cantidad: number) {
  let items = await leerCarrito();
  if (cantidad <= 0) {
    items = items.filter((i) => i.platoId !== platoId);
  } else {
    items = items.map((i) =>
      i.platoId === platoId ? { ...i, cantidad } : i,
    );
  }
  await guardarCarrito(items);
  revalidatePath("/cliente/carrito");
}

export async function quitarDelCarrito(platoId: number) {
  const items = (await leerCarrito()).filter((i) => i.platoId !== platoId);
  await guardarCarrito(items);
  revalidatePath("/cliente/carrito");
}

export async function confirmarPedido() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const cliente = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!cliente) redirect("/login");

  const items = await leerCarrito();
  if (items.length === 0) redirect("/cliente/carrito");

  const platos = await prisma.plato.findMany({
    where: { id: { in: items.map((i) => i.platoId) } },
  });

  const filas = items
    .map((item) => {
      const plato = platos.find((p) => p.id === item.platoId);
      if (!plato) return null;
      return {
        clienteId: cliente.id,
        platoId: plato.id,
        cantidad: item.cantidad,
        precioConDescuento: precioConDescuento(plato),
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  if (filas.length > 0) {
    await prisma.pedido.createMany({ data: filas });
  }
  await limpiarCarrito();
  redirect("/cliente/pedidos");
}
