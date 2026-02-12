"use client";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Lote = { id: string; invoice: string; modelo: string; quantidade: number; status: string; data_importacao: string };

export default function LotesPage() {
  const [items, setItems] = useState<Lote[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("lotes").select("*").order("data_importacao", { ascending: false });
      if (!error) setItems((data ?? []) as any);
    })();
  }, []);

  const filtered = items.filter((l) => (q ? (l.invoice + " " + l.modelo).toLowerCase().includes(q.toLowerCase()) : true));

  return (
    <Shell>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Lotes</h1>
        <Link href="/importar" className="rounded-xl bg-shinerayRed text-white px-4 py-2 text-sm">
          Importar Tracking
        </Link>
      </div>

      <div className="mt-4">
        <input className="w-full rounded-xl border px-3 py-2" placeholder="Buscar por lote (invoice) ou modelo…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.map((l) => (
          <Link key={l.id} href={`/lotes/${l.id}`} className="rounded-2xl border bg-white p-4 hover:shadow-sm transition">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">Lote: {l.invoice}</div>
                <div className="text-sm text-neutral-600">Modelo: {l.modelo} • Qtd: {l.quantidade}</div>
                <div className="text-xs text-neutral-500">Importado em: {new Date(l.data_importacao).toLocaleString()}</div>
              </div>
              <span className="text-xs rounded-full border px-2 py-1">{l.status}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="text-sm text-neutral-600">Nenhum lote encontrado.</div>}
      </div>
    </Shell>
  );
}
