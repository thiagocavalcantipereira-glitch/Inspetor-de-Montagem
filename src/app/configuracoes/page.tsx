"use client";
import { Shell } from "@/components/Shell";

export default function Config() {
  return (
    <Shell>
      <h1 className="text-xl font-semibold">Configurações</h1>
      <div className="mt-3 rounded-2xl border bg-white p-4 text-sm text-neutral-700">
        Aqui entrará a tela de SMTP configurável.
      </div>
    </Shell>
  );
}
