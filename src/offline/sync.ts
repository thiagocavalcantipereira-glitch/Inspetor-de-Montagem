import { offlineDB } from "./db";
import { supabase } from "@/lib/supabase";

export async function syncPending() {
  const pending = await offlineDB.inspections.where("sync_state").equals("pending").toArray();
  for (const item of pending) {
    try {
      const { error } = await supabase.from("inspecoes_offline_inbox").insert({
        id: item.id,
        moto_id: item.moto_id,
        started_at: item.started_at,
        finished_at: item.finished_at,
        status: item.status,
        tempo_total_segundos: item.tempo_total_segundos ?? null,
        payload: item.payload
      });
      if (error) throw error;
      await offlineDB.inspections.update(item.id, { sync_state: "synced", updated_at: new Date().toISOString() });
    } catch {
      await offlineDB.inspections.update(item.id, { sync_state: "error", updated_at: new Date().toISOString() });
    }
  }
}

export function startAutoSync() {
  const handler = () => { if (navigator.onLine) syncPending(); };
  window.addEventListener("online", handler);
  if (navigator.onLine) syncPending();
  return () => window.removeEventListener("online", handler);
}
