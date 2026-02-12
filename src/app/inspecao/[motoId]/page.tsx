"use client";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { offlineDB } from "@/offline/db";
import { uuidv4 } from "@/lib/uuid";
import { syncPending } from "@/offline/sync";

type Moto = { id: string; chassi: string; modelo: string; status_inspecao: string };

export default function InspecaoPage({ params }: { params: { motoId: string } }) {
  const [moto, setMoto] = useState<Moto | null>(null);
  const [localId, setLocalId] = useState("");
  const [status, setStatus] = useState<"Em Andamento" | "Pausado" | "Finalizado">("Em Andamento");
  const [obs, setObs] = useState("");
  const [msg, setMsg] = useState("");

  const online = typeof navigator !== "undefined" ? navigator.onLine : true;

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("motos").select("id,chassi,modelo,status_inspecao").eq("id", params.motoId).single();
      setMoto(data as any);

      const existing = await offlineDB.inspections.where("moto_id").equals(params.motoId).and(i => i.status !== "Finalizado").first();
      if (existing) {
        setLocalId(existing.id);
        setStatus(existing.status);
        setObs(existing.payload?.observacao_geral ?? "");
        return;
      }

      const id = uuidv4();
      const now = new Date().toISOString();
      await offlineDB.inspections.add({
        id,
        moto_id: params.motoId,
        started_at: now,
        status: "Em Andamento",
        sync_state: "pending",
        payload: { observacao_geral: "" },
        created_at: now,
        updated_at: now
      });
      setLocalId(id);
    })();
  }, [params.motoId]);

  async function save() {
    if (!localId) return;
    await offlineDB.inspections.update(localId, {
      status,
      payload: { observacao_geral: obs },
      sync_state: "pending",
      updated_at: new Date().toISOString()
    });
    setMsg("Salvo no tablet ✅");
    setTimeout(() => setMsg(""), 1500);
  }

  async function finalize() {
    if (!localId) return;
    const finished = new Date().toISOString();
    await offlineDB.inspections.update(localId, {
      status: "Finalizado",
      finished_at: finished,
      sync_state: "pending",
      updated_at: finished,
      payload: { observacao_geral: obs }
    });
    setStatus("Finalizado");
    setMsg("Finalizado no tablet. Sincroniza quando voltar internet ✅");

    if (navigator.onLine) {
      await syncPending();
      await supabase.from("motos").update({ status_inspecao: "Finalizada" }).eq("id", params.motoId);
    }
  }

  return (
    <Shell>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Inspeção</h1>
            <div className="text-sm text-neutral-600">
              Chassi: <span className="font-medium">{moto?.chassi ?? ""}</span>
            </div>
            <div className="text-sm text-neutral-600">Online: {online ? "Sim" : "Não (offline)"}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="rounded-xl border px-4 py-2 text-sm">Salvar</button>
            <button onClick={finalize} className="rounded-xl bg-shinerayRed text-white px-4 py-2 text-sm">Finalizar</button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="font-medium">Status</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {(["Em Andamento","Pausado","Finalizado"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={[
                  "rounded-xl px-3 py-2 text-sm border",
                  status === s ? "bg-shinerayRed text-white border-shinerayRed" : "bg-white"
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-sm">Observações gerais</label>
            <textarea className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[120px]" value={obs} onChange={(e) => setObs(e.target.value)} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="font-medium">Sincronização</div>
          <div className="text-sm text-neutral-600 mt-1">
            {navigator.onLine ? "Internet OK." : "Sem internet — dados ficam salvos no tablet."}
          </div>
          <button disabled={!navigator.onLine} onClick={() => syncPending()} className="mt-3 rounded-xl border px-4 py-2 text-sm disabled:opacity-50">
            Sincronizar agora
          </button>
        </div>

        {msg && <div className="text-sm text-green-700">{msg}</div>}
      </div>
    </Shell>
  );
}
