"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** El repartidor marca un pedido listo como entregado. */
export async function marcarEntregado(pedidoId: number) {
  const session = await auth();
  if (session?.user?.role !== "repartidor" && session?.user?.role !== "admin") {
    return;
  }

  await prisma.pedido.updateMany({
    where: { id: pedidoId, estado: "listo" },
    data: { estado: "entregado" },
  });

  revalidatePath("/repartidor");
}
