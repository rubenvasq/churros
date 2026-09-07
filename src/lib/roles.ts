// Roles y utilidades de autorización compartidas.

export type Rol = "cliente" | "chef" | "repartidor" | "admin";

export const ROLES: Rol[] = ["cliente", "chef", "repartidor", "admin"];

/** Ruta del panel principal según el rol (a dónde se redirige tras el login). */
export const PANEL_POR_ROL: Record<Rol, string> = {
  cliente: "/cliente",
  chef: "/chef",
  repartidor: "/repartidor",
  admin: "/admin",
};

export function panelPara(rol: string | undefined | null): string {
  if (rol && rol in PANEL_POR_ROL) {
    return PANEL_POR_ROL[rol as Rol];
  }
  return "/";
}
