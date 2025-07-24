// client/src/services/ranking.ts
import api from "./api";

export interface RankingEntry {
  userId: string;
  name: string;
  completedCount: number;
}

export async function fetchRanking(): Promise<RankingEntry[]> {
  const resp = await api.get<RankingEntry[]>("/ranking");
  return resp.data;
}
