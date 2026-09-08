"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

export type EstadoRegistro = { error?: string };

const esquema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre completo."),
  email: z.string().trim().toLowerCase().email("Correo no válido."),
  telefono: z.string().trim().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export async function registrar(
  _prev: EstadoRegistro,
  formData: FormData,
): Promise<EstadoRegistro> {
  const parsed = esquema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  }

  const { name, email, telefono, password } = parsed.data;

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      telefono: telefono || null,
      password: hash,
      role: "cliente",
    },
  });

  // Inicia sesión automáticamente tras el registro.
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      // La cuenta se creó; si el auto-login falla, que inicie sesión manualmente.
      redirect("/login");
    }
    throw error;
  }

  redirect("/cliente");
}
