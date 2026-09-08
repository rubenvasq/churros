"use client";

import { useEffect, useRef, useState } from "react";

/** Insignia del contador del carrito que "salta" cuando cambia el total. */
export function CarritoBadge({ total }: { total: number }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(total);

  useEffect(() => {
    if (total !== prev.current) {
      prev.current = total;
      if (total > 0) {
        setBump(true);
        const t = setTimeout(() => setBump(false), 400);
        return () => clearTimeout(t);
      }
    }
  }, [total]);

  if (total <= 0) return null;

  return (
    <span
      className={`absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white ${
        bump ? "animate-bump" : ""
      }`}
    >
      {total}
    </span>
  );
}
