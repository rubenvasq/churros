import type { Plato } from "@prisma/client";

/** Formatea un número como precio en soles (S/). */
export function formatearPrecio(valor: number | string): string {
  const n = typeof valor === "string" ? parseFloat(valor) : valor;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(n);
}

/** Indica si un plato está actualmente en oferta (fecha de hoy dentro del rango). */
export function estaEnOferta(plato: Pick<Plato, "descuentoPorcentaje" | "fechaInicioOferta" | "fechaFinOferta">): boolean {
  if (
    plato.descuentoPorcentaje == null ||
    plato.fechaInicioOferta == null ||
    plato.fechaFinOferta == null
  ) {
    return false;
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy >= plato.fechaInicioOferta && hoy <= plato.fechaFinOferta;
}

/** Precio final considerando el descuento vigente. */
export function precioConDescuento(
  plato: Pick<Plato, "precio" | "descuentoPorcentaje" | "fechaInicioOferta" | "fechaFinOferta">,
): number {
  const base = Number(plato.precio);
  if (estaEnOferta(plato) && plato.descuentoPorcentaje != null) {
    return Math.round(base * (1 - plato.descuentoPorcentaje / 100) * 100) / 100;
  }
  return base;
}
