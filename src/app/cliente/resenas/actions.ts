"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** El cliente registra una reseña de un plato que ya le fue entregado. */
export async function crearResena(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const cliente = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!cliente) redirect("/login");

  const platoId = Number(formData.get("platoId"));
  const calificacion = Number(formData.get("calificacion"));
  const comentario = (formData.get("comentario") as string | null)?.trim() || null;

  if (Number.isNaN(platoId) || calificacion < 1 || calificacion > 5) {
    return;
  }

  // Solo puede reseñar platos que le fueron entregados.
  const entregado = await prisma.pedido.findFirst({
    where: { clienteId: cliente.id, platoId, estado: "entregado" },
    select: { id: true },
  });
  if (!entregado) return;

  await prisma.resena.create({
    data: { userId: cliente.id, platoId, calificacion, comentario },
  });

  revalidatePath("/cliente/resenas");
}
