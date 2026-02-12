"use client";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { startAutoSync } from "@/offline/sync";

export default function Dashboard() {
  const [stats, setStats] = useState({ lotes: 0, motos: 0, finalizadas: 0 });

  useEffect(() => {
    const stop = startAutoSync();
    (async () => {
      const { count: lotes } = await supabase.from("lotes").select("*", { count: "exact", head: true });
      const { count: motos } = await supabase.from("motos").select("*", { count: "exact", head: true });
      const { count: finalizadas } = await supabase.from("motos").select("*", { count: "exact", head: true }).eq("status_inspecao", "Finalizada");
      setStats({ lotes: lotes ?? 0, motos: motos ?? 0, finalizadas: finalizadas ?? 0 });
    })();
    return () => stop();
  }, []);

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card title="Total de lotes" value={stats.lotes} />
          <Card title="Total de motos" value={stats.motos} />
          <Card title="Motos finalizadas" value={stats.finalizadas} />
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-medium">Modo offline</div>
          <div className="text-sm text-neutral-600">
            Se a internet cair, você consegue continuar inspecionando. Quando voltar, o tablet sincroniza automaticamente.
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-sm text-neutral-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
