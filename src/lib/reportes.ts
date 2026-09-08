import { prisma } from "@/lib/prisma";
import { ESTADO_INFO } from "@/lib/pedidos";

export type FilaReporte = {
  id: number;
  cliente: string;
  plato: string;
  cantidad: number;
  precio: number | null;
  estado: string;
  fecha: string;
};

/** Obtiene los pedidos aplanados para exportar (Excel/PDF). */
export async function filasReportePedidos(): Promise<FilaReporte[]> {
  const pedidos = await prisma.pedido.findMany({
    include: { plato: true, cliente: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return pedidos.map((p) => ({
    id: p.id,
    cliente: p.cliente.name,
    plato: p.plato.nombre,
    cantidad: p.cantidad,
    precio: p.precioConDescuento != null ? Number(p.precioConDescuento) : null,
    estado: ESTADO_INFO[p.estado].texto,
    fecha: p.createdAt.toLocaleString("es-PE"),
  }));
}
