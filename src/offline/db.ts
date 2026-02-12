import Dexie, { type Table } from "dexie";

export type SyncState = "synced" | "pending" | "error";

export type OfflineInspection = {
  id: string;
  moto_id: string;
  started_at: string;
  finished_at?: string;
  status: "Em Andamento" | "Pausado" | "Finalizado";
  tempo_total_segundos?: number;
  sync_state: SyncState;
  payload: any;
  created_at: string;
  updated_at: string;
};

class OfflineDB extends Dexie {
  inspections!: Table<OfflineInspection, string>;
  constructor() {
    super("shineray_inspecao_offline");
    this.version(1).stores({
      inspections: "id, moto_id, sync_state, updated_at"
    });
  }
}

export const offlineDB = new OfflineDB();
