import type { EstadoPedido } from "@prisma/client";

/** Etiqueta y color para cada estado de pedido (para las insignias de la UI). */
export const ESTADO_INFO: Record<EstadoPedido, { texto: string; clase: string }> = {
  en_espera: { texto: "En espera", clase: "bg-yellow-100 text-yellow-800" },
  listo: { texto: "Listo", clase: "bg-blue-100 text-blue-800" },
  entregado: { texto: "Entregado", clase: "bg-green-100 text-green-800" },
};

/** Siguiente estado en el ciclo de vida del pedido (null si ya está entregado). */
export function siguienteEstado(estado: EstadoPedido): EstadoPedido | null {
  if (estado === "en_espera") return "listo";
  if (estado === "listo") return "entregado";
  return null;
}
