// client/src/services/challenges.ts
import api from "./api";
import { Challenge } from "../types";

export interface NewChallenge {
  title: string;
  description: string;
  type: "libro" | "manga" | "pelicula" | "serie";
}

// Crea un reto
export async function createChallenge(data: NewChallenge): Promise<Challenge> {
  const resp = await api.post<Challenge>("/challenges", data);
  return resp.data;
}

// Marca/desmarca un reto
export async function updateChallenge(
  id: string,
  completed: boolean
): Promise<Challenge> {
  const resp = await api.patch<Challenge>(`/challenges/${id}`, { completed });
  return resp.data;
}

// Obtiene todos los retos del usuario
export async function fetchChallenges(): Promise<Challenge[]> {
  const resp = await api.get<Challenge[]>("/challenges");
  return resp.data;
}
