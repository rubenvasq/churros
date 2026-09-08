// Seed de datos inicial: un usuario por rol y algunos platos de ejemplo.
// Ejecutar con:  npx prisma db seed   (o  node prisma/seed.mjs)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const usuarios = [
    { name: "Administrador", email: "admin@rinconcito.com", role: "admin" },
    { name: "Chef", email: "chef@rinconcito.com", role: "chef" },
    { name: "Repartidor", email: "repartidor@rinconcito.com", role: "repartidor" },
    { name: "Cliente Demo", email: "cliente@rinconcito.com", role: "cliente" },
  ];

  for (const u of usuarios) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { ...u, password },
    });
  }

  const img = (id) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

  const platos = [
    {
      nombre: "Lomo Saltado",
      descripcion: "Clásico salteado de res con papas fritas y arroz.",
      ingredientes: "Res, cebolla, tomate, papa, arroz",
      precio: 25.9,
      cantidad: 20,
      tipoComida: "Plato de fondo",
      imagen: img("1414235077428-338989a2e8c0"),
    },
    {
      nombre: "Ají de Gallina",
      descripcion: "Crema de gallina con ají amarillo sobre arroz.",
      ingredientes: "Gallina, ají amarillo, pan, leche, arroz",
      precio: 22.5,
      cantidad: 15,
      tipoComida: "Plato de fondo",
      imagen: img("1546069901-ba9599a7e63c"),
    },
    {
      nombre: "Ceviche Clásico",
      descripcion: "Pescado fresco marinado en limón con camote y cancha.",
      ingredientes: "Pescado, limón, cebolla, camote, cancha",
      precio: 28.0,
      cantidad: 12,
      tipoComida: "Entrada",
      saludable: true,
      incluirEnSaludables: true,
      imagen: img("1512621776951-a57141f2eefd"),
    },
    {
      nombre: "Causa Limeña",
      descripcion: "Papa amarilla prensada rellena de pollo y palta.",
      ingredientes: "Papa amarilla, pollo, palta, mayonesa",
      precio: 18.0,
      cantidad: 10,
      tipoComida: "Entrada",
      imagen: img("1476224203421-9ac39bcb3327"),
    },
    {
      nombre: "Suspiro a la Limeña",
      descripcion: "Postre tradicional de manjar blanco y merengue.",
      ingredientes: "Leche, huevo, azúcar, oporto",
      precio: 12.0,
      cantidad: 25,
      tipoComida: "Postre",
      imagen: img("1567620905732-2d1ec7ab7445"),
    },
  ];

  for (const p of platos) {
    const existente = await prisma.plato.findFirst({
      where: { nombre: p.nombre },
    });
    if (existente) {
      await prisma.plato.update({ where: { id: existente.id }, data: p });
    } else {
      await prisma.plato.create({ data: p });
    }
  }

  console.log("Seed completado: usuarios y platos creados.");
  console.log("Credenciales de prueba (todas con contraseña 'password123'):");
  usuarios.forEach((u) => console.log(`  - ${u.role}: ${u.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
