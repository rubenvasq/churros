"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** El chef marca un pedido en espera como listo para reparto. */
export async function marcarListo(pedidoId: number) {
  const session = await auth();
  if (session?.user?.role !== "chef" && session?.user?.role !== "admin") {
    return;
  }

  await prisma.pedido.updateMany({
    where: { id: pedidoId, estado: "en_espera" },
    data: { estado: "listo" },
  });

  revalidatePath("/chef");
}
