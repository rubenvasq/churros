import Link from "next/link";
import type { Plato } from "@prisma/client";

/** Convierte una fecha a formato yyyy-MM-dd para <input type="date">. */
function fechaInput(fecha: Date | null | undefined): string {
  if (!fecha) return "";
  return fecha.toISOString().slice(0, 10);
}

export function PlatoForm({
  action,
  plato,
}: {
  action: (formData: FormData) => void | Promise<void>;
  plato?: Plato;
}) {
  const label = "block text-sm font-medium text-ink";
  const input =
    "mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  return (
    <form action={action} className="space-y-5 rounded-2xl bg-surface p-6 shadow">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={plato?.nombre ?? ""}
            className={input}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Descripción</label>
          <textarea
            name="descripcion"
            rows={2}
            defaultValue={plato?.descripcion ?? ""}
            className={input}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Ingredientes</label>
          <textarea
            name="ingredientes"
            rows={2}
            defaultValue={plato?.ingredientes ?? ""}
            className={input}
          />
        </div>

        <div>
          <label className={label}>Precio (S/) *</label>
          <input
            name="precio"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={plato ? Number(plato.precio) : ""}
            className={input}
          />
        </div>

        <div>
          <label className={label}>Stock (cantidad)</label>
          <input
            name="cantidad"
            type="number"
            min="0"
            defaultValue={plato?.cantidad ?? 0}
            className={input}
          />
        </div>

        <div>
          <label className={label}>Tipo de comida</label>
          <input
            name="tipoComida"
            defaultValue={plato?.tipoComida ?? ""}
            placeholder="Entrada, plato de fondo, postre…"
            className={input}
          />
        </div>

        <div>
          <label className={label}>URL de imagen</label>
          <input
            name="imagen"
            defaultValue={plato?.imagen ?? ""}
            placeholder="https://…"
            className={input}
          />
        </div>
      </div>

      <fieldset className="flex flex-wrap gap-6 rounded-lg bg-bg p-4">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="saludable"
            defaultChecked={plato?.saludable ?? false}
          />
          Saludable
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="vegano"
            defaultChecked={plato?.vegano ?? false}
          />
          Vegano
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="incluirEnSaludables"
            defaultChecked={plato?.incluirEnSaludables ?? false}
          />
          Incluir en “saludables”
        </label>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-5 rounded-lg border border-line bg-accent-soft p-4 sm:grid-cols-3">
        <legend className="px-1 text-sm font-semibold text-accent">
          Oferta (opcional)
        </legend>
        <div>
          <label className={label}>Descuento (%)</label>
          <input
            name="descuentoPorcentaje"
            type="number"
            min="0"
            max="100"
            defaultValue={plato?.descuentoPorcentaje ?? ""}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Inicio de oferta</label>
          <input
            name="fechaInicioOferta"
            type="date"
            defaultValue={fechaInput(plato?.fechaInicioOferta)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Fin de oferta</label>
          <input
            name="fechaFinOferta"
            type="date"
            defaultValue={fechaInput(plato?.fechaFinOferta)}
            className={input}
          />
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {plato ? "Guardar cambios" : "Crear plato"}
        </button>
        <Link
          href="/admin/platos"
          className="rounded-lg border border-line px-5 py-2 text-sm font-medium text-ink hover:bg-bg"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
