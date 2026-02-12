"use client";
import { Shell } from "@/components/Shell";

export default function Importar() {
  return (
    <Shell>
      <h1 className="text-xl font-semibold">Importar Tracking</h1>
      <div className="mt-3 rounded-2xl border bg-white p-4 text-sm text-neutral-700">
        MVP: importação via CSV (rápido).
        <div className="mt-2 text-neutral-600">
          Formato: <code>invoice,modelo,chassi</code> (1 chassi por linha).
        </div>
      </div>
    </Shell>
  );
}
