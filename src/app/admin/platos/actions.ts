"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requiereAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }
}

/** Extrae y normaliza los campos de un plato desde el FormData del formulario. */
function datosDesdeForm(formData: FormData) {
  const num = (v: FormDataEntryValue | null) => {
    const s = (v as string | null)?.trim();
    return s ? Number(s) : null;
  };
  const fecha = (v: FormDataEntryValue | null) => {
    const s = (v as string | null)?.trim();
    return s ? new Date(s) : null;
  };
  const texto = (v: FormDataEntryValue | null) => {
    const s = (v as string | null)?.trim();
    return s ? s : null;
  };

  return {
    nombre: (formData.get("nombre") as string).trim(),
    descripcion: texto(formData.get("descripcion")),
    ingredientes: texto(formData.get("ingredientes")),
    precio: num(formData.get("precio")) ?? 0,
    imagen: texto(formData.get("imagen")),
    cantidad: num(formData.get("cantidad")) ?? 0,
    tipoComida: texto(formData.get("tipoComida")),
    saludable: formData.get("saludable") === "on",
    vegano: formData.get("vegano") === "on",
    incluirEnSaludables: formData.get("incluirEnSaludables") === "on",
    descuentoPorcentaje: num(formData.get("descuentoPorcentaje")),
    fechaInicioOferta: fecha(formData.get("fechaInicioOferta")),
    fechaFinOferta: fecha(formData.get("fechaFinOferta")),
  };
}

export async function crearPlato(formData: FormData) {
  await requiereAdmin();
  await prisma.plato.create({ data: datosDesdeForm(formData) });
  revalidatePath("/admin/platos");
  redirect("/admin/platos");
}

export async function actualizarPlato(id: number, formData: FormData) {
  await requiereAdmin();
  await prisma.plato.update({
    where: { id },
    data: datosDesdeForm(formData),
  });
  revalidatePath("/admin/platos");
  redirect("/admin/platos");
}

export async function eliminarPlato(id: number) {
  await requiereAdmin();
  await prisma.plato.delete({ where: { id } });
  revalidatePath("/admin/platos");
}
