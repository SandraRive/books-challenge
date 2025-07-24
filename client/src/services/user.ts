// client/src/services/user.ts
import api from "./api";

export interface Profile {
  name: string;
  email: string;
  totalCreated: number;
  totalCompleted: number;
}

export async function fetchProfile(): Promise<Profile> {
  const resp = await api.get<Profile>("/me");
  return resp.data;
}
