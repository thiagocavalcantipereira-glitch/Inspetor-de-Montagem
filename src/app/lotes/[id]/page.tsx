"use client";
import { Shell } from "@/components/Shell";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Moto = { id: string; chassi: string; status_inspecao: string };

export default function LoteDetail({ params }: { params: { id: string } }) {
  const [lote, setLote] = useState<any>(null);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: l } = await supabase.from("lotes").select("*").eq("id", params.id).single();
      setLote(l);
      const { data: m } = await supabase.from("motos").select("id,chassi,status_inspecao").eq("lote_id", params.id).order("chassi");
      setMotos((m ?? []) as any);
    })();
  }, [params.id]);

  const filtered = useMemo(() => motos.filter((m) => (q ? m.chassi.toLowerCase().includes(q.toLowerCase()) : true)), [motos, q]);

  const progress = useMemo(() => {
    if (!motos.length) return 0;
    const done = motos.filter((m) => m.status_inspecao === "Finalizada").length;
    return Math.round((done / motos.length) * 100);
  }, [motos]);

  return (
    <Shell>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Lote {lote?.invoice ?? ""}</h1>
            <div className="text-sm text-neutral-600">Modelo: {lote?.modelo ?? ""}</div>
            <div className="text-sm text-neutral-600">Progresso: {progress}%</div>
          </div>
          <Link href="/lotes" className="rounded-xl border px-4 py-2 text-sm">Voltar</Link>
        </div>

        <input className="w-full rounded-xl border px-3 py-2" placeholder="Buscar chassi…" value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="grid gap-2">
          {filtered.map((m) => (
            <Link key={m.id} href={`/inspecao/${m.id}`} className="rounded-2xl border bg-white p-4 flex items-center justify-between">
              <div className="font-medium">{m.chassi}</div>
              <span className="text-xs rounded-full border px-2 py-1">{m.status_inspecao}</span>
            </Link>
          ))}
          {filtered.length === 0 && <div className="text-sm text-neutral-600">Nenhuma moto encontrada.</div>}
        </div>
      </div>
    </Shell>
  );
}
