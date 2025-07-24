import api from "./api";

export interface Achievement {
  key: string;
  title: string;
  date: string;   // ISO
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const resp = await api.get<Achievement[]>("/achievements");
  return resp.data;
}
