"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ROLES, type Rol } from "@/lib/roles";

async function requiereAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");
  return session;
}

function esRol(v: unknown): v is Rol {
  return typeof v === "string" && (ROLES as string[]).includes(v);
}

export async function cambiarRol(userId: number, formData: FormData) {
  await requiereAdmin();
  const role = formData.get("role");
  if (!esRol(role)) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
}

export type EstadoUsuario = { ok?: string; error?: string };

const crearSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre completo."),
  email: z.string().trim().toLowerCase().email("Correo no válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  role: z.enum(["cliente", "chef", "repartidor", "admin"]),
});

export async function crearUsuario(
  _prev: EstadoUsuario,
  formData: FormData,
): Promise<EstadoUsuario> {
  await requiereAdmin();

  const parsed = crearSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  }

  const existente = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existente) return { error: "Ya existe un usuario con ese correo." };

  const hash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hash,
      role: parsed.data.role,
    },
  });

  revalidatePath("/admin/usuarios");
  return { ok: `Usuario ${parsed.data.name} creado como ${parsed.data.role}.` };
}

export async function eliminarUsuario(userId: number) {
  const session = await requiereAdmin();

  // Evita que el admin se elimine a sí mismo.
  const propio = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    select: { id: true },
  });
  if (propio?.id === userId) return;

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/usuarios");
}
