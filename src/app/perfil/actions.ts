"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type EstadoPerfil = { ok?: string; error?: string };

const datosSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre completo."),
  telefono: z.string().trim().optional(),
});

export async function actualizarPerfil(
  _prev: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Sesión no válida." };

  const parsed = datosSchema.safeParse({
    name: formData.get("name"),
    telefono: formData.get("telefono"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: parsed.data.name,
      telefono: parsed.data.telefono || null,
    },
  });

  revalidatePath("/perfil");
  return { ok: "Datos actualizados correctamente." };
}

const passSchema = z.object({
  actual: z.string().min(1, "Ingresa tu contraseña actual."),
  nueva: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
});

export async function cambiarPassword(
  _prev: EstadoPerfil,
  formData: FormData,
): Promise<EstadoPerfil> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Sesión no válida." };

  const parsed = passSchema.safeParse({
    actual: formData.get("actual"),
    nueva: formData.get("nueva"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { error: "Usuario no encontrado." };

  // Normaliza el prefijo $2y$ (Laravel) a $2b$ (bcryptjs).
  const hashActual = user.password.replace(/^\$2y\$/, "$2b$");
  const ok = await bcrypt.compare(parsed.data.actual, hashActual);
  if (!ok) return { error: "La contraseña actual no es correcta." };

  const nuevoHash = await bcrypt.hash(parsed.data.nueva, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: nuevoHash },
  });

  return { ok: "Contraseña actualizada correctamente." };
}
