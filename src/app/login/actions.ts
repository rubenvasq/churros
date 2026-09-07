"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { panelPara } from "@/lib/roles";

export type EstadoLogin = { error?: string };

export async function autenticar(
  _prev: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }

  // Redirige al panel correspondiente según el rol del usuario.
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  redirect(panelPara(user?.role));
}
